#!/usr/bin/env bash
# 启动 localhost.run 内网穿透（经沙箱 HTTP 代理 127.0.0.1:18080），
# 把公网地址打印到 /tmp/band-tunnel.log，band-server 的 /api/address 会解析最新一条。
# 注意：匿名隧道重启后 lhr.life 域名会变化，重启后请以页面显示的地址为准。
set -e
exec ssh -o StrictHostKeyChecking=no \
  -o ConnectTimeout=12 \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -o ProxyCommand="nc -X CONNECT -x 127.0.0.1:18080 %h %p" \
  -R 80:localhost:8091 \
  nokey@localhost.run -T > /tmp/band-tunnel.log 2>&1
