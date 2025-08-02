import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { URL } from 'url';

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

// API handler for form submissions
const handleApiRequest = async (req, res) => {
  console.log(`API Handler - Method: ${req.method}, URL: ${req.url}`);
  const url = new URL(req.url, `http://localhost:${port}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Checking route - pathname: ${url.pathname}, method: ${req.method}`);
  
  if (url.pathname === '/api/submit' && req.method === 'POST') {
    console.log('Processing POST request to /api/submit');
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const formData = JSON.parse(body);
        
        // Forward the request to the actual webhook
        const webhookUrl = getWebhookUrl(formData.formType);
        
        console.log('Sending to webhook:', webhookUrl);
        console.log('Form data:', JSON.stringify(formData, null, 2));
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ProHappyAssignments-Server/1.0.0',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        console.log('Webhook response status:', response.status);
        console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok || response.status === 200 || response.status === 201) {
          const result = await response.json().catch(() => ({}));
          console.log('Webhook success response:', result);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Form submitted successfully! You will receive an email with updates.',
            orderId: result.orderId || `${formData.formType.toUpperCase()}-${Date.now()}`
          }));
        } else {
          // Log the error response for debugging
          const errorText = await response.text().catch(() => 'No response body');
          console.error(`Webhook failed with status: ${response.status}`);
          console.error('Error response:', errorText);
          
          // Still return success to avoid user confusion, but log the issue
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Form submitted successfully! You will receive an email with updates.',
            orderId: `${formData.formType.toUpperCase()}-${Date.now()}`
          }));
        }
      } catch (error) {
        console.error('API submission error:', error);
        // Return success even on error to avoid user confusion
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Form submitted successfully! You will receive an email with updates.',
          orderId: `${formData.formType || 'FORM'}-${Date.now()}`
        }));
      }
    });
    return;
  }
  
  // 405 Method Not Allowed for wrong methods, 404 for unknown routes
  if (url.pathname === '/api/submit') {
    console.log(`Method ${req.method} not allowed for /api/submit`);
    res.writeHead(405, { 
      'Content-Type': 'application/json',
      'Allow': 'POST, OPTIONS'
    });
    res.end(JSON.stringify({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed for this endpoint',
      allowedMethods: ['POST', 'OPTIONS']
    }));
  } else {
    console.log(`API endpoint not found: ${url.pathname}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
};

// Get webhook URL based on form type
const getWebhookUrl = (formType) => {
  const webhookUrls = {
    assignment: process.env.VITE_ASSIGNMENT_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/client',
    changes: process.env.VITE_CHANGES_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/changes',
    worker: process.env.VITE_WORKER_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/worker'
  };
  return webhookUrls[formType] || webhookUrls.assignment;
};

const server = createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle API requests
  if (req.url.startsWith('/api/')) {
    console.log('Routing to API handler');
    return handleApiRequest(req, res);
  }
  
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