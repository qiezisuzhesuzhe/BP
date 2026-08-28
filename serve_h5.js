const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

const STATIC_DIR = '/workspace/h5build/dist/dev/h5';
const BACKEND = 'http://127.0.0.1:8091';
const PORT = process.env.PORT || 8080;

const proxy = httpProxy.createProxyServer({});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API proxy
  if (pathname.startsWith('/api/') || pathname.startsWith('/push')) {
    proxy.web(req, res, { target: BACKEND }, (err, target, proxyRes) => {
      if (err) {
        console.error(`Proxy error: ${err.message}`);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ code: 502, message: 'Backend unavailable' }));
        }
      }
    });
    return;
  }

  // Static files
  let filePath = path.join(STATIC_DIR, pathname);
  
  // Security check - prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Default to index.html
  if (pathname === '/' || pathname === '') {
    filePath = path.join(STATIC_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA fallback for unknown routes
      filePath = path.join(STATIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
      });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`H5 server running on http://0.0.0.0:${PORT}`);
  console.log(`Static files: ${STATIC_DIR}`);
  console.log(`API proxy: ${BACKEND}`);
});
