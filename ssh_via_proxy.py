#!/usr/bin/env python3
import socket, sys, select, os, signal

# 设置信号处理 - 当 SSH 关闭 stdin 时退出
def handler(sig, frame):
    os._exit(0)
signal.signal(signal.SIGPIPE, handler)

def main():
    target_host = sys.argv[1]
    target_port = int(sys.argv[2])
    
    # 连接到本地 CONNECT proxy (17844)
    proxy = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    proxy.settimeout(30)
    
    try:
        proxy.connect(('127.0.0.1', 17844))
    except Exception as e:
        sys.stderr.write(f"[proxy] connect failed: {e}\n")
        sys.stderr.flush()
        sys.exit(1)
    
    # 发送 CONNECT 请求
    req = f"CONNECT {target_host}:{target_port} HTTP/1.1\r\nHost: {target_host}:{target_port}\r\n\r\n"
    try:
        proxy.sendall(req.encode())
    except Exception as e:
        sys.stderr.write(f"[proxy] send failed: {e}\n")
        sys.stderr.flush()
        proxy.close()
        sys.exit(1)
    
    # 读取响应
    resp = b''
    while b'\r\n\r\n' not in resp:
        try:
            chunk = proxy.recv(4096)
        except:
            break
        if not chunk:
            proxy.close()
            sys.exit(1)
        resp += chunk
        if len(resp) > 8192:
            break
    
    if b'200' not in resp:
        sys.stderr.write(f"[proxy] CONNECT failed: {resp[:200]}\n")
        sys.stderr.flush()
        proxy.close()
        sys.exit(1)
    
    # 没有终端可用时的处理
    # 使用 os.read/write 代替 sys.stdin/stdout
    stdin_fd = sys.stdin.fileno()
    stdout_fd = sys.stdout.fileno()
    proxy_fd = proxy.fileno()
    
    # 双向转发
    while True:
        try:
            r, _, _ = select.select([stdin_fd, proxy_fd], [], [], 30)
        except:
            break
        
        if not r:
            continue
        
        if stdin_fd in r:
            try:
                data = os.read(stdin_fd, 8192)
            except:
                break
            if not data:
                break
            try:
                proxy.sendall(data)
            except:
                break
        
        if proxy_fd in r:
            try:
                data = proxy.recv(8192)
            except:
                break
            if not data:
                break
            try:
                os.write(stdout_fd, data)
            except:
                break
    
    proxy.close()

if __name__ == '__main__':
    main()
