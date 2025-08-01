# 🚀 1-Click Coolify Deployment Guide

## ✅ Ready to Deploy!

Your ProHappyAssignments app is now at the repository root and ready for 1-click Coolify deployment.

## 🔧 Coolify Setup (Super Easy!)

### Step 1: Create Application in Coolify

1. **Go to your Coolify dashboard**
2. **Click "New Application"**
3. **Select "Git Repository"**
4. **Connect this GitHub repository**

### Step 2: Configure Build Settings

In Coolify, set these build settings:

```yaml
Build Pack: Dockerfile
Dockerfile: Dockerfile.production
Port: 80
Health Check: /health.json
```

**Important**: Make sure to select "Dockerfile" as the build pack to avoid Nixpacks!

### Step 3: Environment Variables

Add these in Coolify's environment section:

```env
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker
VITE_FILE_UPLOAD_MAX_SIZE=10485760
VITE_ENVIRONMENT=production
```

### Step 4: Deploy! 🎉

Click **"Deploy"** and you're done!

## 🎯 What Changed

- ✅ Moved all files to repository root
- ✅ Dockerfile is at root level (Coolify loves this!)
- ✅ No more nested folder issues
- ✅ 1-click deployment ready

## 🔍 Verification

After deployment, test:
- `https://your-domain.com` - Main site
- `https://your-domain.com/health.json` - Health check

That's it! Your app will be live in minutes! 🚀