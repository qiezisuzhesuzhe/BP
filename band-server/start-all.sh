#!/usr/bin/env bash
# 一键启动：band-server + serveo 隧道守护（沙盒重启后跑这一条就行）
#
#   bash /workspace/band-server/start-all.sh
#
# 幂等：已在运行的组件会跳过，不会重复起进程/顶号。
# 公网地址固定为 https://ankangbp.serveousercontent.com（手环上报地址无需改）

set -u
cd /workspace/band-server

PORT=8091

echo "=== 1/3 启动 serveo 隧道守护 ==="
# tunnel.sh 内置 lock 单实例保护 + 从 /workspace/band-server/.ssh 恢复已注册密钥
nohup bash /workspace/band-server/tunnel.sh > /dev/null 2>&1 &
sleep 1

echo "=== 2/3 启动 band-server ==="
RUNNING=$(ss -ltnp 2>/dev/null | grep ":$PORT" | grep -oP 'pid=\K[0-9]+' | head -1)
if [ -n "$RUNNING" ]; then
  echo "band-server 已在运行 (pid=$RUNNING)，跳过"
else
  nohup node server.js >> /tmp/band.log 2>&1 &
  echo "band-server 已启动 pid=$!"
fi

echo "=== 3/3 等待隧道就绪并自检 ==="
sleep 14

echo "--- 本地 /api/address ---"
curl -m 5 -s "http://localhost:$PORT/api/address"; echo
echo "--- 公网 /api/health ---"
curl -m 12 -s -w " <- HTTP %{http_code}\n" https://ankangbp.serveousercontent.com/api/health
echo "--- 隧道日志尾部 ---"
tail -4 /tmp/band-tunnel.log

echo
echo "完成。若公网返回非 200，检查 /tmp/band-tunnel.log 是否出现随机子域名"
echo "（出现随机域名说明密钥未被 serveo 识别，需到 https://console.serveo.net 重新注册指纹）"
