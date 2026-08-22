#!/bin/bash
# =============================================================================
# 一键配置脚本 - 在本地电脑上运行
# 功能：自动配置 SSH 密钥并启动 serveo 隧道
#
# 用法：
#   1. 下载此脚本到本地电脑
#   2. 运行: bash setup_serveo.sh
#   3. 保持窗口开着（隧道会自动重连）
# =============================================================================
set -e

echo "============================================"
echo " 一键配置 serveo 隧道"
echo "============================================"
echo ""

# 创建密钥目录
KEY_DIR="${HOME}/.ssh"
mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"

echo "📁 创建密钥目录: $KEY_DIR"

# 写入 SSH 私钥
cat > "$KEY_DIR/id_rsa" << 'KEYEOF'
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
KEYEOF

chmod 600 "$KEY_DIR/id_rsa"

# 写入 SSH 公钥
cat > "$KEY_DIR/id_rsa.pub" << 'KEYEOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCogOa0hZJX2hO46Qd2wzPXiXngjffnDB5M0SovyoFmvns6PeFOAulycTzuWszT4u/1Dz2rc2ntx6RuyUyiww3Y/9r9B6Nz/x9HYhhK+2yE2kaGz1nkfQyYmhU+YtaqszAffigDALQnNZiQmK7rbF08RFDSg1wM0DchG6QE8ssdUYTGZRWMgNasqaXCoRPbgt400DpLof7rQKTQS6TFXOcWTIgwOW1aZvdSUGahqidTgZ4HNhrrcsxjMO7wP5DjtTJuD4nYR14A6D5z3A6TAqJSqx6GBZCyjzCRl+LZ2/GFyxwSe0hp1IFE44Ncq/DX9WZWnzvV4RHg0YIcSQ86r+rXthu9mnqW2j5gwAYvVqoYkkWH2aEekwjN60DA2YCkhA96MUQnrcIJXT8MRQxxQFTgsHmzlALqATE2aLq6g3byq3/LmzHqGhzwfq9EPC5zlU/uVNy2VPFDZBhYOCZyS/bqqCyZHoPmsDmjJh9wfFlmMBQhwec3qy/rF4gnFCO0/YXWbuGwZyq+dfxVzf36DzZrU1H2FpxMo0WUI1F9FKrWtEoArrj2glZt12FdfzFt+RqlRqmg7RSF4jXJ+S8SSTdxumii6EsHfWBjlcc6uSJ+qiisbTWONCVpoOfadFO9x5IfFi9Ez3NPAUo0bjXa7MK3cVKMzMLxrBZUwIBn9TDOew== ankangbp@trae
KEYEOF

chmod 644 "$KEY_DIR/id_rsa.pub"

echo "✅ SSH 密钥已配置"
echo ""

# 显示密钥指纹
echo "🔑 密钥指纹:"
ssh-keygen -lf "$KEY_DIR/id_rsa.pub" 2>/dev/null || echo "  (运行 ssh-keygen -lf $KEY_DIR/id_rsa.pub 查看)"
echo ""

# 测试密钥
echo "📝 密钥内容 (前 3 行):"
head -3 "$KEY_DIR/id_rsa"
echo ""

# 询问是否启动隧道
read -p "按 Enter 启动隧道 (Ctrl+C 取消): " _

# 建立 SSH 隧道
SUBDOMAIN="ankangbp"
LOCAL_PORT="8091"

echo ""
echo "============================================"
echo "启动 serveo 隧道..."
echo "  子域名: $SUBDOMAIN"
echo "  本地端口: $LOCAL_PORT (band-server)"
echo "  公网地址: https://${SUBDOMAIN}.serveousercontent.com"
echo "============================================"
echo ""

# 主循环：断线自动重连
FAILS=0
while true; do
    echo "[$(date '+%H:%M:%S')] 连接 serveo.net..."
    
    ssh -i "$KEY_DIR/id_rsa" \
        -o IdentitiesOnly=yes \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=15 \
        -o ServerAliveInterval=30 \
        -o ServerAliveCountMax=3 \
        -R "${SUBDOMAIN}:80:localhost:${LOCAL_PORT}" \
        serveo.net -T
    
    FAILS=$((FAILS + 1))
    DELAY=$((FAILS * 5))
    [ "$DELAY" -gt 60 ] && DELAY=60
    
    echo "[$(date '+%H:%M:%S')] 隧道断开，${DELAY}s 后重连 (累计 $FAILS 次)"
    sleep "$DELAY"
    
    [ "$FAILS" -ge 12 ] && FAILS=0
done
