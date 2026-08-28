#!/usr/bin/env bash
# =============================================================================
#  frp 客户端（frpc）一键配置脚本
#  前提：你需要有一台公网服务器运行 frps
#       免费公共 frps: github.com/fatedier/frp/issues?q=public+server
#  用法: bash frp-setup.sh
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[frpc]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; }
info() { echo -e "${CYAN}[info]${NC} $*"; }

# ---- 配置 ----
FRP_VERSION="${FRP_VERSION:-0.68.0}"
FRPS_ADDR="${FRPS_ADDR:-}"       # 必填：公网服务器 IP / 域名
FRPS_PORT="${FRPS_PORT:-7000}"   # frps 端口
FRPS_TOKEN="${FRPS_TOKEN:-}"     # 鉴权 token
SUBDOMAIN="${SUBDOMAIN:-}"       # 子域名（可选，frp 0.52+ 支持）
REMOTE_PORT="${REMOTE_PORT:-8091}"  # 服务端映射端口（留空则自动分配）
LOCAL_PORT="${LOCAL_PORT:-8091}"    # 本地 band-server 端口
LOCAL_HOST="${LOCAL_HOST:-127.0.0.1}"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}" # 可选：自定义绑定域名

INSTALL_DIR="${HOME}/.frp"
BIN="${INSTALL_DIR}/frpc"
CFG="${INSTALL_DIR}/frpc.toml"
LOG="${INSTALL_DIR}/frpc.log"

# ---- 检查必填 ----
[[ -z "${FRPS_ADDR}" ]] && {
  err "缺少 FRPS_ADDR（frps 服务器地址）"
  echo "示例: FRPS_ADDR=your-server.com FRPS_TOKEN=your-token bash $0"
  echo ""
  echo "若使用免费公共 frps，可参考:"
  echo "  github.com/fatedier/frp/issues/4375  (公开服务器列表)"
  echo "  github.com/frp-contrib/frp-public-servers"
  exit 1
}

# ---- 架构检测 ----
detect_arch() {
  local os arch
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$(uname -m)" in
    x86_64|amd64) arch='amd64' ;;
    aarch64|arm64) arch='arm64' ;;
    armv7l) arch='arm' ;;
    *) err "不支持的架构: $(uname -m)"; exit 1 ;;
  esac
  echo "${os}_${arch}"
}

download_frp() {
  local arch pkg url
  arch=$(detect_arch)
  pkg="frp_${FRP_VERSION}_linux_${arch}.tar.gz"
  url="https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/${pkg}"

  if [[ -x "${BIN}" ]]; then
    local ver
    ver=$("${BIN}" --version 2>/dev/null | head -1 || echo '未知')
    log "已存在 frpc: ${ver}"
    return 0
  fi

  mkdir -p "${INSTALL_DIR}"
  info "下载 frp ${FRP_VERSION} (${arch}) ..."
  cd "${INSTALL_DIR}"

  if ! curl -fsSL -o "${pkg}" "${url}"; then
    # 镜像站回退
    info "GitHub 直连失败，尝试镜像 ..."
    curl -fsSL -o "${pkg}" "https://ghproxy.com/${url}" || {
      err "下载失败: ${url}"
      warn "请手动下载后放到 ${BIN}"
      exit 1
    }
  fi

  tar xzf "${pkg}"
  # frp 解压后有 frp_<ver>_linux_<arch>/frpc
  local extracted_dir
  extracted_dir=$(tar tzf "${pkg}" | head -1 | cut -d/ -f1)
  if [[ -f "${extracted_dir}/frpc" ]]; then
    mv "${extracted_dir}/frpc" "${BIN}"
  else
    err "解压后未找到 frpc 二进制"
    exit 1
  fi
  chmod +x "${BIN}"
  rm -rf "${pkg}" "${extracted_dir}"
  log "frpc ${FRP_VERSION} 已安装到 ${BIN}"
}

generate_config() {
  mkdir -p "${INSTALL_DIR}"

  cat > "${CFG}" <<EOF
# frpc 客户端配置
# 生成时间: $(date '+%Y-%m-%d %H:%M:%S')

serverAddr = "${FRPS_ADDR}"
serverPort = ${FRPS_PORT}

# 鉴权 token（与 frps 保持一致）
${FRPS_TOKEN:+auth.method = "token"}
${FRPS_TOKEN:+auth.token = "${FRPS_TOKEN}"}

# 心跳
heartbeatInterval = 30
heartbeatTimeout  = 90

# 日志
log.to = "${LOG}"
log.level = "info"
log.maxDays = 7

# ---- 代理：band-server HTTP ----
# 平台回调路径: /api/radar/push
# 本地服务端口: ${LOCAL_PORT}
[[proxies]]
name = "radar-http"
type = "http"
localIP = "${LOCAL_HOST}"
localPort = ${LOCAL_PORT}
EOF

  # 自定义域名
  if [[ -n "${CUSTOM_DOMAIN}" ]]; then
    echo "customDomains = [\"${CUSTOM_DOMAIN}\"]" >> "${CFG}"
  fi

  # 子域名（frp 0.52+）
  if [[ -n "${SUBDOMAIN}" ]]; then
    echo "subdomain = \"${SUBDOMAIN}\"" >> "${CFG}"
  fi

  # 若需固定远程端口（TCP 模式备用，HTTP 模式用域名路由）
  if [[ -n "${REMOTE_PORT}" && "${REMOTE_PORT}" != "8091" ]]; then
    cat >> "${CFG}" <<EOF

# 备用 TCP 隧道（如需直接 IP:端口 访问）
[[proxies]]
name = "radar-tcp"
type = "tcp"
localIP = "${LOCAL_HOST}"
localPort = ${LOCAL_PORT}
remotePort = ${REMOTE_PORT}
EOF
  fi

  log "配置文件: ${CFG}"
}

start_frpc() {
  info "启动 frpc ..."
  "${BIN}" -c "${CFG}" > "${LOG}" 2>&1 &
  local pid=$!
  echo "${pid}" > "${INSTALL_DIR}/frpc.pid"
  sleep 2

  if kill -0 "${pid}" 2>/dev/null; then
    log "frpc 已启动 (PID=${pid})"
    sleep 1

    local public_url
    if [[ -n "${CUSTOM_DOMAIN}" ]]; then
      public_url="https://${CUSTOM_DOMAIN}"
    elif [[ -n "${SUBDOMAIN}" ]]; then
      public_url="https://${SUBDOMAIN}.${FRPS_ADDR}"
    else
      public_url="http://${FRPS_ADDR}:${REMOTE_PORT}"
    fi

    echo ""
    info "===== 公网地址 ====="
    echo -e "${GREEN}  ${public_url}${NC}"
    echo ""
    info "===== 平台配置 ====="
    info "在叁陆伍智慧云平台后台配置推送 URL 为:"
    echo -e "${CYAN}  ${public_url}/api/radar/push${NC}"
    echo ""
    info "日志: tail -f ${LOG}"
    info "停止: kill \$(cat ${INSTALL_DIR}/frpc.pid)"
  else
    err "frpc 启动失败"
    tail -20 "${LOG}" 2>/dev/null || true
    exit 1
  fi
}

show_status() {
  if [[ -f "${INSTALL_DIR}/frpc.pid" ]]; then
    local pid
    pid=$(cat "${INSTALL_DIR}/frpc.pid")
    if kill -0 "${pid}" 2>/dev/null; then
      info "frpc 运行中 (PID=${pid})"
      tail -5 "${LOG}" 2>/dev/null || true
    else
      warn "frpc 已停止 (PID=${pid} 不存在)"
    fi
  else
    warn "frpc 未运行"
  fi
}

stop_frpc() {
  if [[ -f "${INSTALL_DIR}/frpc.pid" ]]; then
    local pid
    pid=$(cat "${INSTALL_DIR}/frpc.pid")
    kill "${pid}" 2>/dev/null || true
    # 尝试 kill 所有 frpc
    pkill -f "${BIN}" 2>/dev/null || true
    rm -f "${INSTALL_DIR}/frpc.pid"
    log "已停止 frpc"
  fi
}

show_config() {
  cat "${CFG}"
  echo ""
  info "===== 配置参数 ====="
  info "frps 地址: ${FRPS_ADDR}:${FRPS_PORT}"
  info "本地端口:  ${LOCAL_HOST}:${LOCAL_PORT}"
  [[ -n "${CUSTOM_DOMAIN}" ]] && info "自定义域名: ${CUSTOM_DOMAIN}"
  [[ -n "${SUBDOMAIN}" ]] && info "子域名: ${SUBDOMAIN}"
}

# ---- 子命令分派 ----
cmd="${1:-start}"
case "${cmd}" in
  start)   download_frp; generate_config; start_frpc ;;
  status)  show_status ;;
  stop)    stop_frpc ;;
  config)  download_frp; generate_config; show_config ;;
  *)
    echo "用法: $0 [start|stop|status|config]"
    echo ""
    echo "环境变量:"
    echo "  FRPS_ADDR      frps 服务器地址 (必填)"
    echo "  FRPS_PORT      frps 端口 (默认 7000)"
    echo "  FRPS_TOKEN     鉴权 token"
    echo "  SUBDOMAIN      子域名 (可选)"
    echo "  CUSTOM_DOMAIN  自定义域名 (可选)"
    echo "  REMOTE_PORT    TCP 映射端口 (默认 8091)"
    echo "  LOCAL_PORT     本地端口 (默认 8091)"
    echo ""
    echo "示例:"
    echo "  FRPS_ADDR=my.frps.com FRPS_TOKEN=secret bash $0 start"
    exit 0
    ;;
esac
