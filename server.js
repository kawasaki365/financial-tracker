import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import handler from './api/yquote.js';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/api/yquote') {
    req.query = parsed.query;
    res.status = code => { res.statusCode = code; return res; };
    res.json = obj => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(obj));
    };
    handler(req, res);
    return;
  }

  let filePath = path.join(process.cwd(), parsed.pathname === '/' ? '/index.html' : parsed.pathname);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
    else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'text/javascript');
    else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(data);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
