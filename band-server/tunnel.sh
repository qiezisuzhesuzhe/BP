#!/usr/bin/env bash
# serveo.net 内网穿透（经沙箱 HTTP 代理 127.0.0.1:18080），断线自动重连。
#
# 固定公网地址：https://ankangbp.serveousercontent.com
#   serveo 靠 SSH 公钥指纹识别子域名所有权。已注册的密钥指纹：
#   SHA256:J9WwKbubuvfiv1PJL3/bU0/AJ4XEo8SuYLsuiB8QVR4  (id_rsa, 4096)
#   ⚠️ 必须用这把 key，换别的 key 会被降级成随机子域名，手环上报地址就得改配置。
#
# 密钥持久化：沙盒重启会清空 ~/.ssh/，所以从 /workspace 备份恢复（workspace 不随沙盒重启丢失）。
# 若要更换密钥，需重新到 https://console.serveo.net 注册新公钥指纹。
#
# 用法：
#   bash /workspace/band-server/tunnel.sh          前台运行
#   bash /workspace/band-server/tunnel.sh &        后台运行
# 日志：/tmp/band-tunnel.log

set -u

SUBDOMAIN="${SUBDOMAIN:-ankangbp}"
LOCAL_PORT="${LOCAL_PORT:-8091}"
PROXY="${SANDBOX_PROXY:-127.0.0.1:18080}"
LOG="${TUNNEL_LOG:-/tmp/band-tunnel.log}"
URL_FILE="/workspace/band-server/tunnel-url.txt"

KEY_DIR="$HOME/.ssh"
KEY="$KEY_DIR/id_rsa"
BACKUP_DIR="/workspace/band-server/.ssh"
BACKUP_KEY="$BACKUP_DIR/id_rsa"

log() { echo "$(date '+%F %T') $*" >> "$LOG"; }

# 单实例保护：避免多个隧道抢同一个子域名（serveo 会拒绝后来者或造成反复顶号）
LOCK="/tmp/band-tunnel.lock"
if [ -e "$LOCK" ]; then
  OLD_PID=$(cat "$LOCK" 2>/dev/null || echo "")
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    log "已有隧道守护在运行 (pid=$OLD_PID)，本次退出"
    exit 0
  fi
  rm -f "$LOCK"
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"

# 1) 优先从 workspace 备份恢复已注册的密钥
if [ ! -f "$KEY" ] && [ -f "$BACKUP_KEY" ]; then
  cp "$BACKUP_KEY" "$KEY"
  cp "$BACKUP_KEY.pub" "$KEY.pub" 2>/dev/null || true
  chmod 600 "$KEY"
  chmod 644 "$KEY.pub" 2>/dev/null || true
  log "已从 workspace 备份恢复 SSH 密钥"
fi

# 2) 连备份都没有：生成新密钥并备份，同时提示需要重新注册
if [ ! -f "$KEY" ]; then
  ssh-keygen -t rsa -b 4096 -N '' -f "$KEY" -C "ankangbp@trae" -q
  mkdir -p "$BACKUP_DIR"
  cp "$KEY" "$BACKUP_KEY"
  cp "$KEY.pub" "$BACKUP_KEY.pub"
  chmod 600 "$BACKUP_KEY"
  log "⚠️ 未找到备份，已生成新 SSH 密钥并备份到 workspace"
  log "⚠️ 新密钥未注册，只能拿到随机子域名。请到 https://console.serveo.net 注册以下指纹："
  ssh-keygen -lf "$KEY.pub" >> "$LOG"
fi

# 3) 密钥权限兜底（权限过宽 ssh 会直接拒绝加载）
chmod 600 "$KEY" 2>/dev/null || true

log "隧道守护启动 pid=$$ 子域名=$SUBDOMAIN 本地端口=$LOCAL_PORT"
log "使用密钥指纹: $(ssh-keygen -lf "$KEY.pub" 2>/dev/null || echo unknown)"

FAILS=0
while true; do
  log "== serveo 连接中 =="

  ssh -i "$KEY" \
    -o IdentitiesOnly=yes \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=15 \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -o ProxyCommand="nc -X CONNECT -x $PROXY %h %p" \
    -R "$SUBDOMAIN:80:localhost:$LOCAL_PORT" \
    serveo.net -T >> "$LOG" 2>&1

  # 断开后立刻把已知的固定地址写回文件，避免 /api/address 读到重连过程中的随机域名
  echo "$SUBDOMAIN.serveousercontent.com" > "$URL_FILE"

  FAILS=$((FAILS + 1))
  # 指数退避（5s → 60s 上限），防止 serveo 侧限流后疯狂重试
  DELAY=$((FAILS * 5))
  [ "$DELAY" -gt 60 ] && DELAY=60
  log "serveo 断开，${DELAY}s 后重连（累计断开 $FAILS 次）"
  sleep "$DELAY"

  # 连接稳定超过 5 分钟视为健康，重置退避计数
  if [ "$FAILS" -ge 12 ]; then FAILS=0; fi
done
