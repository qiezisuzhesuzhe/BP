#!/bin/bash
# =============================================================================
# 安康智慧平台 - 一键启动脚本（Mac / Linux）
# 双击运行（Mac 右键 → 打开；或在终端执行 bash start.sh）
# =============================================================================
set -e

cd "$(dirname "$0")"

echo ""
echo "============================================"
echo "   安康智慧健康平台 (手环 + 雷达)"
echo "============================================"
echo ""

# 1. 检查 Node.js
if ! command -v node > /dev/null 2>&1; then
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js（推荐 v18 或更高版本）："
    echo "  macOS:  brew install node"
    echo "  官网:   https://nodejs.org/"
    echo ""
    read -p "按 Enter 退出" _
    exit 1
fi

NODE_VER=$(node -v)
echo "✅ Node.js 版本: $NODE_VER"

# 2. 检查依赖（自动安装）
if [ ! -d "node_modules" ] || [ ! -f "node_modules/express/index.js" ]; then
    echo ""
    echo "📦 首次运行，正在安装依赖（约 1~3 分钟）..."
    # 用临时文件捕获输出，避免管道掩盖 npm 的真实退出码
    npm install --no-audit --no-fund --loglevel=error > "$TMPDIR/npm-install.log" 2>&1
    NPM_RC=$?
    tail -5 "$TMPDIR/npm-install.log"
    if [ $NPM_RC -ne 0 ]; then
        echo "❌ 依赖安装失败（退出码 $NPM_RC），请检查网络后重试"
        echo "   完整日志: $TMPDIR/npm-install.log"
        read -p "按 Enter 退出" _
        exit 1
    fi
    echo "✅ 依赖安装完成"
fi

# 3. 检查端口占用
PORT=8091
if command -v lsof > /dev/null 2>&1; then
    OLD_PID=$(lsof -ti:$PORT 2>/dev/null || true)
    if [ -n "$OLD_PID" ]; then
        echo "⚠️  端口 $PORT 已被占用 (PID $OLD_PID)，正在关闭..."
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 1
    fi
fi

# 4. 启动服务
echo ""
echo "🚀 启动服务中..."
LOG_FILE="server.log"
nohup node server.js > "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "  PID: $SERVER_PID"

# 5. 等待服务就绪
MAX_WAIT=15
WAIT=0
READY=0
while [ "$WAIT" -lt "$MAX_WAIT" ]; do
    sleep 1
    if curl -sf http://127.0.0.1:$PORT/api/health > /dev/null 2>&1; then
        READY=1
        break
    fi
    WAIT=$((WAIT + 1))
    printf "  %2ds / %ds\r" "$WAIT" "$MAX_WAIT"
done
echo ""

if [ "$READY" -ne 1 ]; then
    echo "❌ 服务启动超时，请查看日志: $(pwd)/$LOG_FILE"
    tail -20 "$LOG_FILE"
    read -p "按 Enter 退出" _
    exit 1
fi

# 6. 获取本机 IP 供手机访问
LOCAL_IP=""
if command -v ipconfig > /dev/null 2>&1; then
    # macOS
    LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")
elif command -v hostname > /dev/null 2>&1; then
    # Linux
    LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

# 7. 显示访问地址
echo ""
echo "============================================"
echo "   ✅ 服务已启动成功！"
echo "============================================"
echo ""
echo "📱 本机访问（推荐）:  http://localhost:8091/"
if [ -n "$LOCAL_IP" ]; then
echo "📱 同局域网手机:     http://$LOCAL_IP:8091/"
fi
echo ""
echo "🔗 手环回调 URL:      https://ankangbp.serveousercontent.com/pb/upload"
echo "🔗 雷达回调 URL:      https://ankangbp.serveousercontent.com/api/radar/push"
echo ""
echo "💡 提示：关闭本窗口不会停止服务，如需停止请执行："
echo "   kill $SERVER_PID"
echo "   或关闭 8091 端口对应的 Node 进程"
echo ""

# 8. 自动打开浏览器（可选）
URL="http://localhost:8091/"
if command -v open > /dev/null 2>&1; then
    # macOS
    sleep 0.5 && open "$URL" 2>/dev/null &
elif command -v xdg-open > /dev/null 2>&1; then
    # Linux
    sleep 0.5 && xdg-open "$URL" 2>/dev/null &
fi

# 保持窗口打开，显示服务日志
echo "📝 实时日志（按 Ctrl+C 退出查看，服务仍在后台运行）:"
echo "============================================"
# 使用 -n 0 只显示新日志，避免刷屏
tail -n 0 -f "$LOG_FILE" 2>/dev/null || true
echo ""
echo "已退出查看模式，服务 PID=$SERVER_PID 仍在后台运行"
echo "如需停止服务，请执行: kill $SERVER_PID"
read -p "按 Enter 关闭窗口" _
