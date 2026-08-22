#!/bin/bash
# =============================================================================
# 本地 serveo 隧道启动脚本
# 用于在本地电脑上运行，将本地 8091 端口暴露到公网
#
# 手环和雷达共享同一个隧道：
#   手环回调: https://ankangbp.serveousercontent.com/pb/upload
#   雷达回调: https://ankangbp.serveousercontent.com/api/radar/push
#
# 使用方法：
#   1. 将 /workspace/band-server/.ssh/ 目录复制到本地 ~/.ssh/
#   2. 运行: bash local_serveo.sh
#   3. 保持此窗口开着（隧道断开后会自动重连）
# =============================================================================
set -e

SUBDOMAIN="ankangbp"
LOCAL_PORT="8091"
KEY_DIR="${HOME}/.ssh"
KEY="${KEY_DIR}/id_rsa"

echo "============================================"
echo " 本地 serveo 隧道"
echo "============================================"
echo ""
echo "子域名: $SUBDOMAIN"
echo "本地端口: $LOCAL_PORT (band-server)"
echo "公网地址: https://${SUBDOMAIN}.serveousercontent.com"
echo ""

# 检查密钥
if [ ! -f "$KEY" ]; then
    echo "❌ SSH 密钥不存在: $KEY"
    echo ""
    echo "请从沙盒复制密钥到本地:"
    echo "  1. 从沙盒下载 /workspace/band-server/.ssh/id_rsa 和 id_rsa.pub"
    echo "  2. 放到本地 ~/.ssh/ 目录"
    echo "  3. 运行 chmod 600 ~/.ssh/id_rsa"
    echo ""
    echo "或者生成新密钥（需要在 serveo.net 重新注册）:"
    echo "  ssh-keygen -t rsa -b 4096 -N '' -f ~/.ssh/id_rsa -C 'ankangbp@local'"
    echo "  然后到 https://console.serveo.net 注册新公钥"
    exit 1
fi

chmod 600 "$KEY" 2>/dev/null || true

echo "✅ 密钥已就绪"
echo ""
echo "启动隧道..."
echo "  ssh -i $KEY -R $SUBDOMAIN:80:localhost:$LOCAL_PORT serveo.net"
echo ""

# 主循环：断线自动重连
FAILS=0
while true; do
    echo "[$(date '+%H:%M:%S')] 连接 serveo.net..."
    
    ssh -i "$KEY" \
        -o IdentitiesOnly=yes \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=15 \
        -o ServerAliveInterval=30 \
        -o ServerAliveCountMax=3 \
        -R "$SUBDOMAIN:80:localhost:$LOCAL_PORT" \
        serveo.net -T
    
    FAILS=$((FAILS + 1))
    DELAY=$((FAILS * 5))
    [ "$DELAY" -gt 60 ] && DELAY=60
    
    echo "[$(date '+%H:%M:%S')] 隧道断开，${DELAY}s 后重连 (累计 $FAILS 次)"
    sleep "$DELAY"
    
    [ "$FAILS" -ge 12 ] && FAILS=0
done
