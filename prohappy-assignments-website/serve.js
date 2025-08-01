import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, 'dist');
const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache'
    });
    res.end('healthy');
    return;
  }
  
  let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
  
  // Handle SPA routing - serve index.html for non-asset requests
  if (!existsSync(filePath) && !req.url.includes('.')) {
    filePath = join(distPath, 'index.html');
  }
  
  if (existsSync(filePath)) {
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Set appropriate cache headers
    const cacheHeaders = {};
    if (['.js', '.css', '.png', '.jpg', '.gif', '.svg', '.woff', '.woff2'].includes(ext)) {
      cacheHeaders['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (ext === '.html') {
      cacheHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      cacheHeaders['Pragma'] = 'no-cache';
      cacheHeaders['Expires'] = '0';
    }
    
    // Security headers
    cacheHeaders['X-Content-Type-Options'] = 'nosniff';
    cacheHeaders['X-Frame-Options'] = 'DENY';
    cacheHeaders['X-XSS-Protection'] = '1; mode=block';
    cacheHeaders['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      ...cacheHeaders
    });
    res.end(readFileSync(filePath));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});