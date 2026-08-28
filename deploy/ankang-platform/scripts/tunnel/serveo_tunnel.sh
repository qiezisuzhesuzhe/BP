#!/bin/bash
# serveo SSH 隧道脚本
# 用法: ./serveo_tunnel.sh [本地端口] [远端端口]
# 示例: ./serveo_tunnel.sh 8091 0
# 本地端口: band-server 端口 (默认 8091)
# 远端端口: 0 表示随机分配 (默认 0)

LOCAL_PORT="${1:-8091}"
REMOTE_PORT="${2:-0}"
KEY_FILE="/workspace/.ssh/serveo_key"
PROXY_CMD="python3 /workspace/ssh_via_proxy.py %h %p"

echo "============================================"
echo " serveo SSH 隧道配置"
echo "============================================"
echo ""
echo "本地端口: $LOCAL_PORT (band-server)"
echo "远端端口: ${REMOTE_PORT} (0=随机)"
echo "密钥文件: $KEY_FILE"
echo "代理命令: $PROXY_CMD"
echo ""

# 检查密钥
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ 密钥文件不存在: $KEY_FILE"
    echo "请先生成密钥: ssh-keygen -t ed25519 -f $KEY_FILE"
    exit 1
fi

# 检查本地 CONNECT proxy
if ! ss -tlnp | grep -q 17844; then
    echo "启动本地 CONNECT proxy..."
    python3 /workspace/band-server/scripts/tunnel/local_connect_proxy.py 17844 &
    sleep 1
fi

echo "✅ 本地 proxy 已就绪"
echo ""

# 建立 SSH 隧道
echo "建立 SSH 隧道到 serveo.net..."
echo "命令: ssh -i $KEY_FILE -o ProxyCommand=\"$PROXY_CMD\" -p 22 -R $REMOTE_PORT:localhost:$LOCAL_PORT serveo.net"
echo ""
echo "提示:"
echo "  1. 先在 serveo.net 注册账号"
echo "  2. 将公钥添加到 serveo.net"
echo "  3. 运行此脚本建立隧道"
echo "  4. 查看 serveo.net 分配的公网 URL"
echo "  5. 配置到叁陆伍智慧云平台推送 URL"
echo ""

# 实际执行 SSH 命令
ssh -i "$KEY_FILE" \
  -o "ProxyCommand=$PROXY_CMD" \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -p 22 \
  -R "$REMOTE_PORT:localhost:$LOCAL_PORT" \
  serveo.net

echo ""
echo "隧道已关闭"
