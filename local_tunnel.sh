#!/bin/bash
# =============================================================================
# 一键隧道脚本 - 在本地电脑上运行
#
# 用法:
#   1. 先在 serveo.net 注册账号并添加 SSH 公钥
#   2. 运行此脚本: bash local_tunnel.sh
#   3. 获取公网 URL 配置到叁陆伍智慧云平台
#
# 平台推送 URL 格式: https://YOUR-SUBDOMAIN.serveousercontent.com/api/radar/push
# =============================================================================
set -e

echo "============================================"
echo " 一键 SSH 隧道脚本"
echo "============================================"
echo ""

# 检查 SSH 客户端
if ! command -v ssh &> /dev/null; then
    echo "❌ 需要 SSH 客户端"
    echo "   Windows: 下载 https://www.ssh.com/ssh/putty/download"
    echo "   Mac:     已内置"
    echo "   Linux:   已内置"
    exit 1
fi

# 检查密钥
KEY_FILE="$HOME/.ssh/serveo_key"
if [ ! -f "$KEY_FILE" ]; then
    echo "📝 生成 SSH 密钥..."
    ssh-keygen -t ed25519 -f "$KEY_FILE" -N "" -q
    echo ""
    echo "✅ 密钥已生成"
    echo ""
    echo "🔑 请将以下公钥添加到 serveo.net:"
    echo "   https://serveo.net/settings/ssh-keys"
    echo ""
    cat "$KEY_FILE.pub"
    echo ""
    read -p "公钥已添加到 serveo.net? (y/n): " CONFIRM
    if [ "$CONFIRM" != "y" ]; then
        echo "请先添加公钥后再运行此脚本"
        exit 1
    fi
fi

echo "🔗 建立 SSH 隧道..."
echo "   本地端口: 8091 (band-server)"
echo "   转发到: serveo.net:80"
echo ""

# 建立隧道
# -R 80:localhost:8091 表示将远端的 80 端口转发到本地 8091
# serveo 会给一个 URL: https://SUBDOMAIN.serveousercontent.com
echo "ssh -i $KEY_FILE -R 80:localhost:8091 serveo.net"
echo ""

ssh -i "$KEY_FILE" \
  -o "StrictHostKeyChecking=accept-new" \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -R 80:localhost:8091 \
  serveo.net

echo ""
echo "隧道已关闭"
echo "重新运行脚本可重新建立隧道"
