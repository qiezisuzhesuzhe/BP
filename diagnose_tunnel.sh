#!/bin/bash
# 隧道诊断脚本

echo "============================================"
echo " serveo 隧道诊断"
echo "============================================"
echo ""

# 检查 SSH 密钥
KEY_DIR="${HOME}/.ssh"
KEY="$KEY_DIR/id_rsa"

echo "1. 检查 SSH 密钥:"
if [ -f "$KEY" ]; then
    echo "   ✅ 密钥存在"
    FINGERPRINT=$(ssh-keygen -lf "$KEY.pub" 2>/dev/null)
    echo "   指纹: $FINGERPRINT"
else
    echo "   ❌ 密钥不存在"
    echo "   请先运行 setup_serveo.sh"
    exit 1
fi

echo ""

# 检查本地端口
echo "2. 检查本地端口 8091:"
if command -v netstat > /dev/null 2>&1; then
    netstat -tlnp 2>/dev/null | grep 8091 || echo "   ⚠️  端口 8091 未监听"
elif command -v lsof > /dev/null 2>&1; then
    lsof -i :8091 2>/dev/null || echo "   ⚠️  端口 8091 未监听"
else
    echo "   请确保 band-server 在 8091 端口运行"
fi

echo ""

# 测试 SSH 连接
echo "3. 测试 SSH 连接到 serveo:"
timeout 15 ssh -i "$KEY" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=10 \
    -o BatchMode=yes \
    -p 22 \
    serveo.net 'echo "SSH连接成功" && hostname' 2>&1

if [ $? -eq 0 ]; then
    echo "   ✅ SSH 连接正常"
else
    echo "   ❌ SSH 连接失败"
    echo "   可能原因:"
    echo "   - 网络无法访问 serveo.net"
    echo "   - 密钥未注册到 serveo"
    echo "   - serveo 服务不可用"
fi

echo ""

# 测试隧道转发
echo "4. 测试端口转发:"
echo "   运行: ssh -i $KEY -R ankangbp:80:localhost:8091 serveo.net"
echo "   然后访问 https://ankangbp.serveousercontent.com/api/health"
echo ""

echo "5. 如果一切正常:"
echo "   打开浏览器访问 https://ankangbp.serveousercontent.com/api/health"
echo "   应该返回 JSON: {\"code\":0,\"msg\":\"band-server running\"}"
