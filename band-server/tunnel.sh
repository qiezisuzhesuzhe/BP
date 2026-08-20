#!/usr/bin/env bash
# serveo.net 内网穿透（经沙箱 HTTP 代理 127.0.0.1:18080），自动断线重连。
# 输出写入 /tmp/band-tunnel.log，band-server 的 /api/address 会解析最新一条公网地址。
# 已注册密钥后，-R ankangbp:80 可拿到固定子域名 https://ankangbp.serveousercontent.com
#
# SSH 密钥持久化：沙盒每次重启会清空 ~/.ssh/，所以从 workspace 备份恢复。
# 首次使用需在 serveo 控制台注册密钥（Google/GitHub 登录），注册后 ankangbp 子域永久生效。
KEY_DIR="$HOME/.ssh"
BACKUP_DIR="/workspace/band-server/.ssh"

# 启动前恢复 SSH 密钥
if [ ! -f "$KEY_DIR/id_ed25519" ] && [ -f "$BACKUP_DIR/id_ed25519" ]; then
  mkdir -p "$KEY_DIR"
  cp "$BACKUP_DIR/id_ed25519" "$KEY_DIR/id_ed25519"
  cp "$BACKUP_DIR/id_ed25519.pub" "$KEY_DIR/id_ed25519.pub"
  chmod 600 "$KEY_DIR/id_ed25519"
  chmod 644 "$KEY_DIR/id_ed25519.pub"
  echo "== $(date '+%F %T') 已从 workspace 恢复 SSH 密钥 ==" >> /tmp/band-tunnel.log
fi

# 如果连备份都没有，生成新密钥并保存
if [ ! -f "$KEY_DIR/id_ed25519" ]; then
  ssh-keygen -t ed25519 -f "$KEY_DIR/id_ed25519" -N '' -q
  mkdir -p "$BACKUP_DIR"
  cp "$KEY_DIR/id_ed25519" "$BACKUP_DIR/"
  cp "$KEY_DIR/id_ed25519.pub" "$BACKUP_DIR/"
  echo "== $(date '+%F %T') 生成新 SSH 密钥并备份到 workspace ==" >> /tmp/band-tunnel.log
  echo "请注册密钥：" >> /tmp/band-tunnel.log
  ssh-keygen -lf "$KEY_DIR/id_ed25519.pub" >> /tmp/band-tunnel.log
fi

while true; do
  echo "== $(date '+%F %T') serveo 连接中 ==" >> /tmp/band-tunnel.log
  ssh -o StrictHostKeyChecking=no \
    -o ConnectTimeout=12 \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -o ProxyCommand="nc -X CONNECT -x 127.0.0.1:18080 %h %p" \
    -R ankangbp:80:localhost:8091 \
    serveo.net -T >> /tmp/band-tunnel.log 2>&1
  echo "$(date '+%F %T') serveo 断开，5 秒后重连" >> /tmp/band-tunnel.log
  sleep 5
done
