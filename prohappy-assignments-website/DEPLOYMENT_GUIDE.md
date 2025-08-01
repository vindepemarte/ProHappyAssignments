# Deployment Guide

This guide provides step-by-step instructions for deploying the ProHappyAssignments website to various platforms, with a focus on Coolify deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Coolify Deployment](#coolify-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Manual Deployment](#manual-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally (for building)
- Git repository with the project code
- n8n instance with webhook endpoints configured
- Domain name configured (optional but recommended)
- SSL certificate (handled automatically by most platforms)

## Coolify Deployment

Coolify is the recommended deployment platform for this application. It provides easy Git-based deployments with automatic SSL and domain management.

### Method 1: Static Site Deployment (Recommended)

This method builds the application and serves it as static files.

#### Step 1: Create New Project

1. Log into your Coolify dashboard
2. Click "New Project" or "Add Application"
3. Select "Git Repository" as the source
4. Connect your Git repository containing the project

#### Step 2: Configure Build Settings

1. **Project Root**: Set to `prohappy-assignments-website` (if in a monorepo)
2. **Build Command**: 
   ```bash
   npm run deploy:build
   ```
3. **Publish Directory**: `dist`
4. **Node.js Version**: Select 18.x or 20.x
5. **Install Command**: `npm ci` (default)

#### Step 3: Environment Variables

Add the following environment variables in Coolify:

```env
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker
VITE_FILE_UPLOAD_MAX_SIZE=10485760
VITE_ENVIRONMENT=production
```

#### Step 4: Domain Configuration

1. In Coolify, go to your application settings
2. Add your custom domain (e.g., `assignments.yourdomain.com`)
3. Coolify will automatically handle SSL certificate generation
4. Update your DNS records to point to Coolify's IP address

#### Step 5: Deploy

1. Click "Deploy" in Coolify
2. Monitor the build logs for any errors
3. Once deployed, test the application at your domain

### Method 2: Docker Deployment

For more control over the deployment environment, use Docker deployment.

#### Step 1: Create Docker Application

1. In Coolify, select "Docker" as the application type
2. Connect your Git repository
3. Coolify will automatically detect the `Dockerfile`

#### Step 2: Configure Docker Settings

1. **Dockerfile Path**: `./Dockerfile` (default)
2. **Build Context**: `./` (project root)
3. **Port**: `80` (as defined in nginx.conf)
4. **Health Check**: `/health` (optional)

#### Step 3: Environment Variables

Same as Method 1 - add the required environment variables.

#### Step 4: Deploy

1. Click "Deploy"
2. Coolify will build the Docker image and deploy the container
3. The application will be available on the assigned port/domain

### Advanced Coolify Configuration

#### Custom Build Script

If you need custom build behavior, create a `coolify-build.sh` script:

```bash
#!/bin/bash
set -e

echo "Starting ProHappyAssignments build..."

# Install dependencies
npm ci --silent

# Run quality checks
npm run type-check
npm run lint

# Run tests (optional - comment out if you want faster builds)
npm run test

# Build for production
npm run build:production

echo "Build completed successfully!"
```

Make it executable and reference it in Coolify:
```bash
chmod +x coolify-build.sh
```

Build Command: `./coolify-build.sh`

#### Multiple Environments

Set up different applications in Coolify for different environments:

1. **Staging**: 
   - Branch: `develop` or `staging`
   - Environment: `VITE_ENVIRONMENT=staging`
   - Domain: `staging-assignments.yourdomain.com`

2. **Production**:
   - Branch: `main` or `production`
   - Environment: `VITE_ENVIRONMENT=production`
   - Domain: `assignments.yourdomain.com`

## Docker Deployment

For manual Docker deployment or other container platforms:

### Build Docker Image

```bash
# Clone the repository
git clone <your-repo-url>
cd prohappy-assignments-website

# Build the Docker image
docker build -t prohappy-assignments:latest .

# Run the container
docker run -d \
  --name prohappy-assignments \
  -p 80:80 \
  -e VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment \
  -e VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes \
  -e VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker \
  -e VITE_FILE_UPLOAD_MAX_SIZE=10485760 \
  -e VITE_ENVIRONMENT=production \
  prohappy-assignments:latest
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  prohappy-assignments:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
      - VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
      - VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker
      - VITE_FILE_UPLOAD_MAX_SIZE=10485760
      - VITE_ENVIRONMENT=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - prohappy-assignments
    restart: unless-stopped
```

Deploy with:
```bash
docker-compose up -d
```

## Manual Deployment

For traditional web hosting or VPS deployment:

### Step 1: Build the Application

```bash
# On your local machine or CI/CD pipeline
git clone <your-repo-url>
cd prohappy-assignments-website

# Install dependencies
npm ci

# Create production environment file
cp .env.example .env.production
# Edit .env.production with your actual values

# Build for production
npm run build:production
```

### Step 2: Upload Files

Upload the contents of the `dist/` directory to your web server's document root.

### Step 3: Configure Web Server

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/prohappy-assignments;
    index index.html;

    # Include the provided nginx.conf settings
    include /path/to/nginx.conf;
}
```

#### Apache Configuration

Create `.htaccess` in the document root:

```apache
# Copy the Apache configuration from the README.md
```

### Step 4: SSL Configuration

Use Let's Encrypt or your preferred SSL provider:

```bash
# Using certbot for Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

## Environment Configuration

### Required Variables

All deployments require these environment variables:

```env
# Webhook URLs (replace with your actual n8n instance)
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker

# File upload limit (10MB = 10485760 bytes)
VITE_FILE_UPLOAD_MAX_SIZE=10485760

# Environment identifier
VITE_ENVIRONMENT=production
```

### Optional Variables

```env
# Analytics (if using)
VITE_ANALYTICS_ID=your-analytics-id

# Error tracking (if using Sentry)
VITE_SENTRY_DSN=your-sentry-dsn

# API base URL (if different from webhook URLs)
VITE_API_BASE_URL=https://your-api.com

# Feature flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### Environment-Specific Configuration

#### Development
```env
VITE_ENVIRONMENT=development
VITE_ASSIGNMENT_WEBHOOK_URL=http://localhost:5678/webhook/assignment
# ... other local URLs
```

#### Staging
```env
VITE_ENVIRONMENT=staging
VITE_ASSIGNMENT_WEBHOOK_URL=https://staging-n8n.yourdomain.com/webhook/assignment
# ... other staging URLs
```

#### Production
```env
VITE_ENVIRONMENT=production
VITE_ASSIGNMENT_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/assignment
# ... other production URLs
```

## Post-Deployment Verification

After deployment, verify everything is working:

### 1. Basic Functionality

- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] Forms display properly
- [ ] Mobile responsiveness works

### 2. Health Check

```bash
curl -f https://your-domain.com/health
# Should return: healthy
```

### 3. Form Testing

Test each form type:

1. **Assignment Form**:
   - Enter a test access code
   - Fill out the form
   - Submit and verify webhook receives data

2. **Changes Form**:
   - Enter a test reference code
   - Submit change request
   - Verify webhook processing

3. **Worker Form**:
   - Enter a test reference code
   - Submit worker form
   - Verify file upload works

### 4. Performance Testing

```bash
# Test page load speed
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/

# Test with different user agents (mobile)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
     https://your-domain.com/
```

### 5. Security Testing

- [ ] HTTPS is working
- [ ] Security headers are present
- [ ] No sensitive information in client-side code
- [ ] File upload restrictions work

## Troubleshooting

### Common Issues

#### Build Failures

**Error**: `npm run build` fails
**Solution**:
```bash
# Clear cache and reinstall
npm run clean:all
npm install
npm run build
```

**Error**: TypeScript errors during build
**Solution**:
```bash
# Check types first
npm run type-check
# Fix any type errors, then build
```

#### Deployment Issues

**Error**: Application not loading
**Solutions**:
1. Check if `dist/index.html` exists
2. Verify web server configuration
3. Check browser console for errors
4. Verify environment variables are set

**Error**: Forms not submitting
**Solutions**:
1. Check webhook URLs are accessible
2. Verify CORS settings on n8n
3. Check browser network tab for failed requests
4. Test webhook endpoints directly

#### Performance Issues

**Error**: Slow loading times
**Solutions**:
1. Enable gzip compression
2. Check CDN configuration
3. Optimize images
4. Enable browser caching

**Error**: Large bundle size
**Solutions**:
```bash
# Analyze bundle
npm run build:analyze
# Check for unnecessary dependencies
```

### Getting Help

1. **Check Logs**:
   - Coolify deployment logs
   - Web server error logs
   - Browser console errors

2. **Test Locally**:
   ```bash
   npm run build:production
   npm run preview
   ```

3. **Verify Configuration**:
   - Environment variables
   - Webhook endpoints
   - DNS settings

4. **Monitor**:
   - Set up uptime monitoring
   - Monitor webhook delivery
   - Track error rates

### Support Checklist

When seeking help, provide:

- [ ] Deployment method used
- [ ] Error messages (full logs)
- [ ] Environment variables (without sensitive values)
- [ ] Browser/device information
- [ ] Steps to reproduce the issue
- [ ] Expected vs actual behavior

## Maintenance

### Regular Tasks

1. **Update Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor Performance**:
   - Check page load times
   - Monitor webhook response times
   - Review error logs

3. **Security Updates**:
   - Keep Node.js updated
   - Update Docker base images
   - Review security headers

4. **Backup**:
   - Backup environment configuration
   - Document any custom changes
   - Keep deployment scripts updated

### Scaling Considerations

For high-traffic deployments:

1. **CDN**: Use a CDN for static assets
2. **Load Balancing**: Deploy multiple instances
3. **Caching**: Implement proper caching strategies
4. **Monitoring**: Set up comprehensive monitoring
5. **Database**: Consider caching webhook responses