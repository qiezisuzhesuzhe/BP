#!/usr/bin/env python3
"""
Local CONNECT proxy that forwards connections via HTTP_PROXY.
Cloudflared connects to this proxy (127.0.0.1:17844), which forwards
to Cloudflare edge nodes through the HTTP_PROXY at 127.0.0.1:18080.
"""
import socket
import threading
import sys

PROXY_HOST = '127.0.0.1'
PROXY_PORT = 18080

def connect_via_proxy(target_host, target_port):
    """Establish TCP tunnel via HTTP CONNECT through HTTP_PROXY"""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(30)
    s.connect((PROXY_HOST, PROXY_PORT))
    req = f"CONNECT {target_host}:{target_port} HTTP/1.1\r\nHost: {target_host}:{target_port}\r\n\r\n"
    s.sendall(req.encode())
    resp = b''
    while b'\r\n\r\n' not in resp:
        chunk = s.recv(4096)
        if not chunk:
            s.close()
            raise Exception("Connection closed")
        resp += chunk
        if len(resp) > 8192:
            break
    if b'200' not in resp:
        s.close()
        raise Exception(f"CONNECT failed: {resp[:200]}")
    return s

def relay(src, dst):
    """Bidirectional data relay"""
    try:
        while True:
            data = src.recv(65536)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        for s in [src, dst]:
            try:
                s.shutdown(socket.SHUT_RDWR)
            except Exception:
                pass

def handle_client(client):
    """Handle incoming CONNECT request from cloudflared"""
    try:
        req = b''
        while b'\r\n\r\n' not in req:
            chunk = client.recv(4096)
            if not chunk:
                client.close()
                return
            req += chunk

        first_line = req.decode('utf-8', errors='replace').split('\r\n')[0]
        if first_line.startswith('CONNECT '):
            parts = first_line.split()
            target = parts[1]
            host, port = target.split(':')
            port = int(port)

            remote = connect_via_proxy(host, port)
            client.sendall(b'HTTP/1.1 200 Connection Established\r\n\r\n')

            t1 = threading.Thread(target=relay, args=(client, remote), daemon=True)
            t2 = threading.Thread(target=relay, args=(remote, client), daemon=True)
            t1.start()
            t2.start()
            t1.join()
            t2.join()
        else:
            client.sendall(b'HTTP/1.1 400 Bad Request\r\n\r\n')
            client.close()
    except Exception as e:
        print(f"Error: {e}", flush=True)
        try:
            client.close()
        except Exception:
            pass

def main():
    listen_port = int(sys.argv[1]) if len(sys.argv) > 1 else 17844
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', listen_port))
    server.listen(100)

    print(f"Local CONNECT proxy on 127.0.0.1:{listen_port}", flush=True)
    print(f"  Forwards via HTTP_PROXY {PROXY_HOST}:{PROXY_PORT}", flush=True)

    try:
        while True:
            client, addr = server.accept()
            threading.Thread(target=handle_client, args=(client,), daemon=True).start()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.close()

if __name__ == '__main__':
    main()
