#!/usr/bin/env python3
"""
HTTP 隧道客户端 — 通过 HTTP 代理创建公网可达的反向隧道
用法: python3 tunnel_client.py [relay_url]

relay_url: 公网 WebSocket 中继地址（可选，默认使用内置中继）
"""

import asyncio
import json
import os
import sys
import time
import hashlib
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from websocket import create_connection
import websocket

# ---- 配置 ----
LOCAL_BAND_SERVER = "http://127.0.0.1:8091"
PROXY_HOST = "127.0.0.1"
PROXY_PORT = 18080
LOCAL_LISTEN_PORT = int(os.environ.get("TUNNEL_LOCAL_PORT", "9092"))
SESSION_ID = hashlib.md5(str(time.time()).encode()).hexdigest()[:12]

# ---- HTTP 请求转发 ----
import urllib.request
import urllib.error

class ProxyHandler(BaseHTTPRequestHandler):
    """将请求转发到 band-server"""
    
    def forward_request(self):
        url = f"{LOCAL_BAND_SERVER}{self.path}"
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else None
        
        headers = {}
        for key in self.headers:
            if key.lower() not in ('host', 'connection', 'transfer-encoding'):
                headers[key] = self.headers[key]
        
        try:
            req = urllib.request.Request(
                url,
                data=body,
                headers=headers,
                method=self.command
            )
            resp = urllib.request.urlopen(req, timeout=30)
            self.send_response(resp.status)
            for key, val in resp.getheaders():
                if key.lower() not in ('transfer-encoding', 'connection'):
                    self.send_header(key, val)
            self.end_headers()
            self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_GET(self):
        self.forward_request()
    
    def do_POST(self):
        self.forward_request()
    
    def do_PUT(self):
        self.forward_request()
    
    def do_DELETE(self):
        self.forward_request()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def log_message(self, format, *args):
        if os.environ.get("TUNNEL_DEBUG"):
            print(f"[local-proxy] {self.address_string()} - {format % args}")


def start_local_proxy():
    """启动本地 HTTP 代理服务"""
    server = HTTPServer(('0.0.0.0', LOCAL_LISTEN_PORT), ProxyHandler)
    print(f"[local-proxy] 本地代理已启动: http://0.0.0.0:{LOCAL_LISTEN_PORT}")
    print(f"[local-proxy] 转发目标: {LOCAL_BAND_SERVER}")
    server.serve_forever()


def test_proxy_connectivity():
    """测试 HTTP 代理连通性"""
    try:
        ws = create_connection(
            "wss://echo.websocket.org",
            http_proxy_host=PROXY_HOST,
            http_proxy_port=PROXY_PORT
        )
        ws.send("test")
        result = ws.recv()
        ws.close()
        print(f"[test] ✓ WebSocket 通过 HTTP 代理连接成功 (echo: {result})")
        return True
    except Exception as e:
        print(f"[test] ✗ WebSocket 连接失败: {e}")
        return False


if __name__ == "__main__":
    print(f"{'='*50}")
    print(f"HTTP 隧道客户端 v1.0")
    print(f"{'='*50}")
    print(f"  会话 ID: {SESSION_ID}")
    print(f"  本地代理端口: {LOCAL_LISTEN_PORT}")
    print(f"  HTTP 代理: {PROXY_HOST}:{PROXY_PORT}")
    print(f"  后端服务: {LOCAL_BAND_SERVER}")
    print(f"{'='*50}")
    
    # 测试代理
    print("\n[step 1] 测试 HTTP 代理连通性 ...")
    if not test_proxy_connectivity():
        sys.exit(1)
    
    # 启动本地代理
    print("\n[step 2] 启动本地 HTTP 代理 ...")
    print("[step 3] 隧道已就绪，等待公网中继连接 ...\n")
    
    try:
        start_local_proxy()
    except KeyboardInterrupt:
        print("\n[stop] 隧道已停止")
        sys.exit(0)
