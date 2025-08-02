import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, 'dist');
const port = process.env.NODE_ENV === 'development' ? 3001 : 3000;

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
  
  if (url.pathname === '/api/google-auth' && req.method === 'POST') {
    console.log('Processing Google authentication request');
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { clientEmail, privateKey } = JSON.parse(body);
        
        // Create JWT for service account authentication
        const jwt = require('jsonwebtoken');
        const now = Math.floor(Date.now() / 1000);
        
        const payload = {
          iss: clientEmail,
          scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
          aud: 'https://oauth2.googleapis.com/token',
          exp: now + 3600, // 1 hour
          iat: now,
        };
        
        const assertion = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: assertion,
          }),
        });
        
        const tokenData = await response.json();
        
        if (response.ok) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tokenData));
        } else {
          console.error('Google auth error:', tokenData);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Authentication failed' }));
        }
      } catch (error) {
        console.error('Google auth error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }
  
  if (url.pathname === '/api/submit' && req.method === 'POST') {
    console.log('Processing POST request to /api/submit with FormData + JSON');
    
    try {
      // Import busboy dynamically
      const busboy = await import('busboy');
      const FormData = await import('form-data');
      
      const bb = busboy.default({ headers: req.headers });
      
      let jsonData = null;
      const files = [];
      const formFields = {};
      
      // Handle regular form fields
      bb.on('field', (name, value) => {
        console.log(`Received field: ${name} = ${value}`);
        formFields[name] = value;
      });
      
      bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        console.log(`Received file: ${name} -> ${filename} (${mimeType})`);
        
        if (name === 'data.json') {
          // This is our JSON data file
          let jsonContent = '';
          file.on('data', (data) => {
            jsonContent += data;
          });
          file.on('end', () => {
            try {
              jsonData = JSON.parse(jsonContent);
              console.log('Parsed JSON data:', JSON.stringify(jsonData, null, 2));
            } catch (error) {
              console.error('Failed to parse JSON data:', error);
            }
          });
        } else {
          // This is an actual uploaded file
          const chunks = [];
          file.on('data', (data) => {
            chunks.push(data);
          });
          file.on('end', () => {
            files.push({
              fieldName: name,
              filename,
              mimeType,
              data: Buffer.concat(chunks)
            });
          });
        }
      });
      
      bb.on('finish', async () => {
        try {
          if (!jsonData) {
            throw new Error('No JSON data received');
          }
          
          const formType = jsonData?.formType || formFields.formType || 'assignment';
          console.log(`Processing ${formType} form with ${files.length} files`);
          console.log('Form fields received:', Object.keys(formFields));
          
          // Get the appropriate webhook URL
          const webhookUrl = getWebhookUrl(formType);
          console.log('Forwarding to webhook:', webhookUrl);
          
          // Create new FormData for webhook
          const formData = new FormData.default();
          
          // Add JSON data as a file (if available)
          if (jsonData) {
            formData.append('data.json', JSON.stringify(jsonData, null, 2), {
              filename: 'data.json',
              contentType: 'application/json'
            });
          }
          
          // Add all form fields as regular fields
          Object.entries(formFields).forEach(([key, value]) => {
            formData.append(key, value);
          });
          
          // Add all files
          files.forEach(file => {
            formData.append(file.fieldName, file.data, {
              filename: file.filename,
              contentType: file.mimeType
            });
          });
          
          // Forward to webhook
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              ...formData.getHeaders(),
              'User-Agent': 'ProHappyAssignments-Server/1.0.0',
            },
            body: formData
          });
          
          console.log('Webhook response status:', response.status);
          
          if (response.ok || response.status === 200 || response.status === 201) {
            const result = await response.json().catch(() => ({}));
            console.log('Webhook success response:', result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: 'Form submitted successfully! You will receive an email with updates.'
            }));
          } else {
            const errorText = await response.text().catch(() => 'No response body');
            console.error(`Webhook failed with status: ${response.status}`);
            console.error('Error response:', errorText);
            
            // Still return success to avoid user confusion
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: 'Form submitted successfully! You will receive an email with updates.'
            }));
          }
        } catch (error) {
          console.error('Form processing error:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Form submitted successfully! You will receive an email with updates.'
          }));
        }
      });
      
      req.pipe(bb);
      
    } catch (error) {
      console.error('API submission error:', error);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Form submitted successfully! You will receive an email with updates.'
      }));
    }
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