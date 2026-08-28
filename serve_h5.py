import http.server
import socketserver
import urllib.request
import urllib.error
import os
import sys

BACKEND = 'http://127.0.0.1:8091'
STATIC_DIR = '/workspace/h5build/dist/dev/h5'
PORT = 8080

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)
    
    def do_GET(self):
        if self.path.startswith('/api/') or self.path.startswith('/push'):
            self.proxy_request()
        elif self.path in ('/', '/index.html'):
            # 返回 SPA 入口
            return super().do_GET()
        else:
            # 检查是否存在静态文件
            filepath = os.path.join(STATIC_DIR, self.path.lstrip('/'))
            if os.path.isfile(filepath):
                return super().do_GET()
            else:
                # SPA fallback
                self.path = '/index.html'
                return super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/') or self.path.startswith('/push'):
            self.proxy_request()
        else:
            self.send_error(405)
    
    def proxy_request(self):
        # 转发请求到后端
        url = BACKEND + self.path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None
        
        headers = {}
        for key in self.headers:
            if key.lower() not in ('host', 'connection', 'transfer-encoding'):
                headers[key] = self.headers[key]
        headers['Host'] = '127.0.0.1:8091'
        
        req = urllib.request.Request(
            url,
            data=body,
            headers=headers,
            method=self.command
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                self.send_response(resp.status)
                for key, val in resp.headers.items():
                    if key.lower() not in ('connection', 'transfer-encoding'):
                        self.send_header(key, val)
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for key, val in e.headers.items():
                if key.lower() not in ('connection', 'transfer-encoding'):
                    self.send_header(key, val)
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_error(502, str(e))

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True
    request_queue_size = 128

if __name__ == '__main__':
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    with ReusableTCPServer(('0.0.0.0', PORT), ProxyHandler) as httpd:
        print(f'H5 server running on http://0.0.0.0:{PORT}')
        print(f'Static files: {STATIC_DIR}')
        print(f'API proxy: {BACKEND}')
        httpd.serve_forever()
