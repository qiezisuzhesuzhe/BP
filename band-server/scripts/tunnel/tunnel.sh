#!/usr/bin/env bash
# =============================================================================
#  内网穿透一键启动脚本（ngrok / frp 自动选择）
#  暴露 band-server 的 8091 端口到公网，供叁陆伍智慧云平台回调 HTTP 数据
#
#  用法:
#    bash tunnel.sh              # 自动选择（优先 ngrok，再 frp）
#    bash tunnel.sh ngrok         # 强制使用 ngrok
#    bash tunnel.sh frp           # 强制使用 frp
#    bash tunnel.sh status        # 查看状态
#    bash tunnel.sh stop          # 停止所有隧道
#
#  环境变量（ngrok）:
#    NGROK_AUTH_TOKEN=xxx         # ngrok 授权 token
#    NGROK_REGION=cn              # cn | us | eu
#
#  环境变量（frp）:
#    FRPS_ADDR=xxx                # frps 服务器地址
#    FRPS_TOKEN=xxx               # frps 鉴权 token
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TUNNEL_NGROK="${SCRIPT_DIR}/ngrok-setup.sh"
TUNNEL_FRP="${SCRIPT_DIR}/frp-setup.sh"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[tunnel]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; }
info() { echo -e "${CYAN}[info]${NC} $*"; }

usage() {
  cat <<EOF
内网穿透 — 暴露 band-server 到公网
==============================================

  bash tunnel.sh [MODE]

  MODE:
    (默认)    自动选择：先检查 ngrok 认证配置，再检查 frp 配置
    ngrok     强制使用 ngrok（需 NGROK_AUTH_TOKEN）
    frp       强制使用 frp（需 FRPS_ADDR）
    status    查看隧道状态
    stop      停止所有隧道
    help      显示本帮助

  ngrok 快速开始:
    # 1. 注册 https://ngrok.com 获取免费账号
    # 2. 获取 token: https://dashboard.ngrok.com/get-started/your-authtoken
    # 3. 启动:
       export NGROK_AUTH_TOKEN=你的token
       bash tunnel.sh ngrok

  frp 快速开始:
    # 1. 你需要一台已部署 frps 的公网服务器
    # 2. 启动:
       export FRPS_ADDR=你的frps服务器
       export FRPS_TOKEN=你的token
       bash tunnel.sh frp

  平台配置（两种方式通用）:
    复制启动脚本输出的公网 URL
    → 在叁陆伍智慧云平台后台配置推送 URL 为:
      公网URL/api/radar/push

  本地 band-server 端口: 8091
  回调路径:             /api/radar/push
EOF
}

# ---- 停止所有 ----
stop_all() {
  log "停止所有隧道 ..."
  # ngrok
  if pkill -f "ngrok" 2>/dev/null; then
    log "ngrok 已停止"
  fi
  # frpc
  if pkill -f "frpc" 2>/dev/null; then
    log "frpc 已停止"
  fi
  # 清理 pid 文件
  rm -f "${HOME}/.ngrok/ngrok.pid" "${HOME}/.frp/frpc.pid" 2>/dev/null
  log "完成"
}

# ---- 状态检查 ----
check_status() {
  echo ""
  info "===== 隧道状态 ====="
  echo ""

  local ngrok_running=0 frp_running=0

  # ngrok
  if curl -fsSL http://127.0.0.1:4040/api/tunnels > /dev/null 2>&1; then
    ngrok_running=1
    echo -e "${GREEN}  ngrok:  运行中${NC}"
    echo "  -----"
    curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null \
      | python3 -c "
import sys,json
try:
    data = json.load(sys.stdin)
    for t in data.get('tunnels', []):
        print(f\"  名称: {t.get('name','-')}\")
        print(f\"  公网: {t.get('public_url','-')}\")
        print(f\"  本地: {t.get('config',{}).get('addr','-')}\")
        print()
except: print('  获取状态失败')
" 2>/dev/null
  else
    echo -e "${YELLOW}  ngrok:  未运行${NC}"
  fi

  # frp
  if pgrep -x frpc > /dev/null 2>&1; then
    frp_running=1
    echo -e "${GREEN}  frpc:   运行中 (PID=$(pgrep -x frpc | tr '\n' ' '))${NC}"
    if [[ -f "${HOME}/.frp/frpc.log" ]]; then
      echo "  最近日志:"
      tail -5 "${HOME}/.frp/frpc.log" 2>/dev/null | sed 's/^/    /'
    fi
  else
    echo -e "${YELLOW}  frpc:   未运行${NC}"
  fi

  echo ""
  info "===== band-server HTTP Push 状态 ====="
  local push_status
  push_status=$(curl -s http://127.0.0.1:8091/api/radar/status 2>/dev/null || echo '{}')
  echo "${push_status}" | python3 -c "
import sys,json
try:
    d = json.load(sys.stdin)
    p = d.get('data',{}).get('push',{})
    print(f\"  模式: {p.get('mode','-')}\")
    print(f\"  已接收报文: {p.get('msgCount',0)}\")
    last = p.get('lastMsgAt')
    if last:
        import datetime
        t = datetime.datetime.fromtimestamp(last/1000)
        print(f\"  最近推送: {t.strftime('%Y-%m-%d %H:%M:%S')}\")
    else:
        print(f\"  最近推送: 暂无\")
except: print('  band-server 未响应')
" 2>/dev/null

  if [[ ${ngrok_running} -eq 0 && ${frp_running} -eq 0 ]]; then
    echo ""
    warn "无隧道在运行。执行 bash tunnel.sh 启动"
  fi
  echo ""
}

# ---- 自动选择 ----
auto_detect() {
  info "自动选择隧道方案 ..."

  # 优先 ngrok（如果已配置 token）
  if [[ -n "${NGROK_AUTH_TOKEN:-}" ]] || [[ -f "${HOME}/.ngrok/ngrok.yml" ]]; then
    log "检测到 ngrok 配置，使用 ngrok"
    bash "${TUNNEL_NGROK}" "${NGROK_AUTH_TOKEN:-}" start
    return
  fi

  # 其次 frp
  if [[ -n "${FRPS_ADDR:-}" ]]; then
    log "检测到 frp 配置，使用 frp"
    bash "${TUNNEL_FRP}" start
    return
  fi

  # 都没有 → 提示
  warn "未检测到任何隧道配置"
  echo ""
  echo "  ngrok 方式（推荐新手）:"
  echo "    export NGROK_AUTH_TOKEN=你的token"
  echo "    bash tunnel.sh ngrok"
  echo ""
  echo "  frp 方式（需公网服务器）:"
  echo "    export FRPS_ADDR=你的frps服务器"
  echo "    bash tunnel.sh frp"
  echo ""
  echo "  详细帮助: bash tunnel.sh help"
}

# ---- 主入口 ----
mode="${1:-auto}"

case "${mode}" in
  help|-h|--help)   usage; exit 0 ;;
  status)           check_status ;;
  stop)             stop_all ;;
  ngrok)            bash "${TUNNEL_NGROK}" "${NGROK_AUTH_TOKEN:-}" start ;;
  frp)              bash "${TUNNEL_FRP}" start ;;
  auto)             auto_detect ;;
  *)                err "未知模式: ${mode}"; usage; exit 1 ;;
esac
