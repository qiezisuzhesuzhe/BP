#!/usr/bin/env bash
# =============================================================================
#  ngrok 一键配置脚本 — 暴露 band-server 端口到公网
#  用法: bash ngrok-setup.sh [authtoken]
#  文档: https://ngrok-agent.s3.amazonaws.com/ngrok.2024.html
# =============================================================================
set -euo pipefail

# ---- 颜色 & 输出 ----
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[ngrok]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; }
info() { echo -e "${CYAN}[info]${NC} $*"; }

# ---- 参数 ----
AUTH_TOKEN="${1:-${NGROK_AUTH_TOKEN:-}}"
REMOTE_PORT="${REMOTE_PORT:-8091}"
LOCAL_PORT="${LOCAL_PORT:-8091}"
DOMAIN="${DOMAIN:-}"          # 可选：ngrok 付费版自定义域名
REGION="${REGION:-cn}"       # cn | us | eu | ap | au | jp | in | sa

INSTALL_DIR="${HOME}/.ngrok"
BIN="${INSTALL_DIR}/ngrok"
CFG="${INSTALL_DIR}/ngrok.yml"
DOWNLOAD_BASE="https://bin.equinox.io/c/bNyj1mQVY4c"

# ---- 架构检测 ----
detect_arch() {
  local os arch
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$(uname -m)" in
    x86_64|amd64) arch='amd64' ;;
    aarch64|arm64) arch='arm64' ;;
    armv7l) arch='armv7' ;;
    *) err "不支持的架构: $(uname -m)"; exit 1 ;;
  esac
  echo "${os}-${arch}"
}

download_ngrok() {
  local arch pkg
  arch=$(detect_arch)
  pkg="ngrok-v3-stable-linux-${arch}.tgz"

  if [[ -x "${BIN}" ]]; then
    log "已存在 ngrok: $( "${BIN}" version 2>/dev/null | head -1 || echo '未知版本')"
    return 0
  fi

  mkdir -p "${INSTALL_DIR}"
  info "下载 ngrok (${arch}) ..."
  cd "${INSTALL_DIR}"
  curl -fsSL -o "${pkg}" "${DOWNLOAD_BASE}/${pkg}" || {
    # fallback: 尝试替代 URL 格式
    curl -fsSL -o "${pkg}" "https://bin.equinox.io/a/4pKtkRKzsYH/${pkg}" || {
      err "下载失败，请手动下载: ${DOWNLOAD_BASE}/${pkg}"
      exit 1
    }
  }
  tar xzf "${pkg}"
  chmod +x ngrok
  mv ngrok "${BIN}" 2>/dev/null || true
  rm -f "${pkg}"
  log "ngrok 已安装到 ${BIN}"
}

setup_config() {
  mkdir -p "${INSTALL_DIR}"

  # 认证
  if [[ -n "${AUTH_TOKEN}" ]]; then
    info "配置 auth token ..."
    "${BIN}" config-authtoken "${AUTH_TOKEN}" --config="${CFG}" 2>/dev/null || true
  else
    warn "未提供 auth token（匿名隧道启动时会提示登录）"
    warn "注册地址: https://dashboard.ngrok.com/signup"
    warn "获取 token: https://dashboard.ngrok.com/get-started/your-authtoken"
  fi

  # 写入基础配置
  cat > "${CFG}" <<EOF
version: "3"
web_addr: 127.0.0.1:4040
region: ${REGION}

tunnels:
  radar:
    addr: ${LOCAL_PORT}
    proto: http
EOF

  if [[ -n "${DOMAIN}" ]]; then
    echo "    domain: ${DOMAIN}" >> "${CFG}"
  fi

  log "配置文件: ${CFG}"
}

start_tunnel() {
  info "启动隧道 (${LOCAL_PORT} → 公网:${REMOTE_PORT}) ..."
  info "控制台地址: http://127.0.0.1:4040"

  "${BIN}" http \
    --config="${CFG}" \
    --log-level=info \
    --log="${INSTALL_DIR}/ngrok.log" \
    -- "http://127.0.0.1:${LOCAL_PORT}" &

  local pid=$!
  echo "${pid}" > "${INSTALL_DIR}/ngrok.pid"
  sleep 3

  if kill -0 "${pid}" 2>/dev/null; then
    log "隧道已启动 (PID=${pid})"
    echo ""
    info "===== 公网地址 ====="
    # 从 ngrok API 读取实际 URL
    sleep 2
    local public_url
    public_url=$(curl -fsSL http://127.0.0.1:4040/api/tunnels 2>/dev/null \
      | grep -oP '"public_url"\s*:\s*"\Khttps?://[^"]+' | head -1)
    if [[ -n "${public_url}" ]]; then
      echo -e "${GREEN}  ${public_url}${NC}"
      echo ""
      info "===== 平台配置 ====="
      info "在叁陆伍智慧云平台后台配置推送 URL 为:"
      echo -e "${CYAN}  ${public_url}/api/radar/push${NC}"
      echo ""
      info "停止隧道: kill \$(cat ${INSTALL_DIR}/ngrok.pid)"
    else
      warn "尚未获取到公网地址，查看日志: tail -f ${INSTALL_DIR}/ngrok.log"
    fi
  else
    err "隧道启动失败，查看日志: tail ${INSTALL_DIR}/ngrok.log"
    tail -20 "${INSTALL_DIR}/ngrok.log" 2>/dev/null || true
    exit 1
  fi
}

status() {
  if curl -fsSL http://127.0.0.1:4040/api/tunnels > /dev/null 2>&1; then
    info "隧道运行中"
    curl -s http://127.0.0.1:4040/api/tunnels | python3 -m json.tool 2>/dev/null || true
  else
    warn "隧道未运行"
  fi
}

cleanup() {
  if [[ -f "${INSTALL_DIR}/ngrok.pid" ]]; then
    local pid
    pid=$(cat "${INSTALL_DIR}/ngrok.pid")
    kill "${pid}" 2>/dev/null || true
    rm -f "${INSTALL_DIR}/ngrok.pid"
    log "已停止隧道"
  fi
}

# ---- 子命令分派 ----
cmd="${2:-start}"
case "${cmd}" in
  start)   download_ngrok; setup_config; start_tunnel ;;
  status)  status ;;
  stop)    cleanup ;;
  config)  download_ngrok; setup_config; log "配置已生成"; cat "${CFG}" ;;
  *)       echo "用法: $0 [auth_token] [start|stop|status|config]"; exit 0 ;;
esac
