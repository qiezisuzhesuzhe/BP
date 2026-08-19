#!/usr/bin/env bash
# serveo.net 内网穿透（经沙箱 HTTP 代理 127.0.0.1:18080），自动断线重连。
# 输出写入 /tmp/band-tunnel.log，band-server 的 /api/address 会解析最新一条公网地址。
# 已注册密钥后，-R ankangbp:80 可拿到固定子域名 https://ankangbp.serveo.net（注册一次永不再变）。
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
