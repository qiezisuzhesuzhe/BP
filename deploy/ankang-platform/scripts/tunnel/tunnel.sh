#!/usr/bin/env bash
# =============================================================================
#  公网暴露脚本 — 暴露 band-server 到公网，供叁陆伍智慧云平台回调
#
#  【发现】Trae 预览代理 (port 16000) 已自动将 /api/* 路由到 band-server:8091
#  因此首选方案是利用预览代理的公网 URL 直接暴露 API
#  备选方案：ngrok / frp 隧道
#
#  用法:
#    bash tunnel.sh              # 自动检测（预览代理 → ngrok → frp）
#    bash tunnel.sh preview      # 使用 Trae 预览代理（推荐）
#    bash tunnel.sh ngrok        # 使用 ngrok 隧道
#    bash tunnel.sh frp          # 使用 frp 隧道
#    bash tunnel.sh status       # 查看所有通道状态
#    bash tunnel.sh stop         # 停止所有隧道
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TUNNEL_NGROK="${SCRIPT_DIR}/ngrok-setup.sh"
TUNNEL_FRP="${SCRIPT_DIR}/frp-setup.sh"

PREVIEW_PORT="${PREVIEW_PROXY_PUBLIC_PORT:-16000}"
BAND_PORT=8091

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[tunnel]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; }
info() { echo -e "${CYAN}[info]${NC} $*"; }

usage() {
  cat <<EOF
公网暴露 — 让叁陆伍智慧云平台能回调 band-server
====================================================

  bash tunnel.sh [MODE]

  MODE:
    (默认)     自动检测：预览代理 → ngrok → frp
    preview    使用 Trae 预览代理（推荐，无需额外工具）
    ngrok      使用 ngrok 隧道（需 NGROK_AUTH_TOKEN）
    frp        使用 frp 隧道（需 FRPS_ADDR）
    status     查看状态
    stop       停止所有隧道
    help       显示本帮助

  ┌──────────────────────────────────────────────────────────────┐
  │  方案 A：Trae 预览代理（推荐，当前已就绪）                    │
  │                                                              │
  │  Trae IDE 已内置预览代理，自动将 /api/* 路由到后端服务        │
  │  只需获取工作空间的公网 URL 即可：                            │
  │                                                              │
  │  1. 在 Trae IDE 中点击右上角 "预览" 或 "分享" 按钮            │
  │  2. 复制公网 URL（格式: https://xxx.trae.ai/）              │
  │  3. 在叁陆伍智慧云平台后台配置推送 URL 为:                    │
  │     https://你的公网域名/api/radar/push                      │
  │                                                              │
  │  当前预览代理状态:                                           │
  │    端口: ${PREVIEW_PORT}                                     │
  │    API 路径: /api/* → band-server:${BAND_PORT}               │
  │    回调接口: /api/radar/push                                 │
  └──────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────┐
  │  方案 B：ngrok 隧道（需额外配置）                             │
  │                                                              │
  │  export NGROK_AUTH_TOKEN=你的token                           │
  │  bash tunnel.sh ngrok                                        │
  └──────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────┐
  │  方案 C：frp 隧道（需公网服务器）                             │
  │                                                              │
  │  export FRPS_ADDR=你的frps服务器                             │
  │  bash tunnel.sh frp                                          │
  └──────────────────────────────────────────────────────────────┘
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
  info "===== 通道状态 ====="
  echo ""

  # 检查预览代理
  local preview_ok=0
  local preview_msg=""
  if curl -fsSL "http://127.0.0.1:${PREVIEW_PORT}/api/radar/status" > /dev/null 2>&1; then
    preview_ok=1
    local preview_data
    preview_data=$(curl -s "http://127.0.0.1:${PREVIEW_PORT}/api/radar/status" 2>/dev/null)
    preview_msg=$(echo "${preview_data}" | python3 -c "
import sys,json
try:
    d = json.load(sys.stdin)
    p = d.get('data',{}).get('push',{})
    print(f'{p.get(\"mode\",\"?\")} | {p.get(\"msgCount\",0)} 报文')
except: print('ok')
" 2>/dev/null)
    echo -e "${GREEN}  预览代理: ✓ 运行中 (${PREVIEW_PORT} → band-server)${NC}"
    echo "    API 路径: /api/* → band-server:${BAND_PORT}"
    echo "    回调接口: /api/radar/push"
    echo "    Push 信息: ${preview_msg}"
    echo "    公网 URL:  需从 Trae IDE 获取（预览/分享按钮）"
  else
    echo -e "${YELLOW}  预览代理: 未运行${NC}"
  fi

  # ngrok
  local ngrok_running=0
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
  push_status=$(curl -s "http://127.0.0.1:${BAND_PORT}/api/radar/status" 2>/dev/null || echo '{}')
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

  echo ""
  info "===== 平台回调配置 ====="
  echo "  在叁陆伍智慧云平台后台配置推送 URL:"
  echo "    https://<公网域名>/api/radar/push"
  echo ""
  echo "  获取公网域名:"
  echo "    1. Trae IDE: 点击右上角 预览 / 分享 按钮"
  echo "    2. ngrok:    查看本脚本输出的公网 URL"
  echo "    3. frp:      查看 frpc 配置中的 customDomains"
  echo ""
}

# ---- 自动选择 ----
auto_detect() {
  info "自动检测最佳方案 ..."

  # 优先：Trae 预览代理（已内置，无需额外工具）
  if curl -fsSL "http://127.0.0.1:${PREVIEW_PORT}/api/radar/status" > /dev/null 2>&1; then
    log "检测到 Trae 预览代理已运行"
    log "端口 ${PREVIEW_PORT} → band-server:${BAND_PORT} 路由正常"
    echo ""
    info "✓ 预览代理已就绪！"
    echo ""
    info "下一步："
    echo "  1. 在 Trae IDE 中点击 预览 / 分享 按钮"
    echo "  2. 复制公网 URL"
    echo "  3. 配置叁陆伍智慧云平台推送 URL:"
    echo "     https://你的公网域名/api/radar/push"
    echo ""
    info "  本地验证: bash tunnel.sh status"
    echo ""
    return
  fi

  # 其次：ngrok（如果已配置 token）
  if [[ -n "${NGROK_AUTH_TOKEN:-}" ]] || [[ -f "${HOME}/.ngrok/ngrok.yml" ]]; then
    log "检测到 ngrok 配置，使用 ngrok"
    bash "${TUNNEL_NGROK}" "${NGROK_AUTH_TOKEN:-}" start
    return
  fi

  # 再次：frp
  if [[ -n "${FRPS_ADDR:-}" ]]; then
    log "检测到 frp 配置，使用 frp"
    bash "${TUNNEL_FRP}" start
    return
  fi

  # 都没有 → 提示
  warn "预览代理未运行，且未检测到 ngrok/frp 配置"
  echo ""
  echo "  请先启动 Trae 预览代理或配置隧道："
  echo ""
  echo "  方案 A（推荐）: 启动 Trae 预览代理"
  echo "    在 Trae IDE 中点击 预览 按钮即可启动"
  echo ""
  echo "  方案 B: ngrok"
  echo "    export NGROK_AUTH_TOKEN=你的token"
  echo "    bash tunnel.sh ngrok"
  echo ""
  echo "  方案 C: frp"
  echo "    export FRPS_ADDR=你的frps服务器"
  echo "    bash tunnel.sh frp"
  echo ""
  echo "  详细帮助: bash tunnel.sh help"
}

# ---- 预览代理模式 ----
start_preview() {
  info "检测 Trae 预览代理状态 ..."
  if curl -fsSL "http://127.0.0.1:${PREVIEW_PORT}/api/radar/status" > /dev/null 2>&1; then
    log "✓ 预览代理已在运行 (port ${PREVIEW_PORT})"
    log "✓ /api/* 已路由到 band-server:${BAND_PORT}"
  else
    warn "预览代理未运行，请在 Trae IDE 中启动"
    warn "点击右上角 预览 按钮启动预览代理"
    exit 1
  fi
  echo ""
  info "===== 预览代理配置 ====="
  echo ""
  info "  本地 API 测试: http://127.0.0.1:${PREVIEW_PORT}/api/radar/status"
  info "  平台回调 URL: https://<公网域名>/api/radar/push"
  echo ""
  info "  获取公网域名:"
  echo "    Trae IDE 右上角 → 预览 / 分享"
  echo "    复制显示的公网 URL"
  echo ""
  info "  配置到叁陆伍智慧云平台:"
  echo "    推送 URL: https://你的域名/api/radar/push"
  echo "    Token:    yguvogy8g976t79gy9"
  echo ""
}

# ---- 主入口 ----
mode="${1:-auto}"

case "${mode}" in
  help|-h|--help)   usage; exit 0 ;;
  status)           check_status ;;
  stop)             stop_all ;;
  preview)          start_preview ;;
  ngrok)            bash "${TUNNEL_NGROK}" "${NGROK_AUTH_TOKEN:-}" start ;;
  frp)              bash "${TUNNEL_FRP}" start ;;
  auto)             auto_detect ;;
  *)                err "未知模式: ${mode}"; usage; exit 1 ;;
esac
