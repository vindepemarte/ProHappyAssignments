# 🔧 Coolify Deployment Troubleshooting

## Problem: Coolify Still Using Nixpacks

If you see errors like `ghcr.io/railwayapp/nixpacks` in the build logs, Coolify is ignoring your Dockerfile.

### Solution 1: Manual Build Pack Selection

In Coolify dashboard:
1. Go to your application settings
2. Find "Build Pack" or "Builder" setting
3. **Manually select "Dockerfile"**
4. Set Dockerfile path to: `Dockerfile.production`
5. Redeploy

### Solution 2: Use Dockerfile.production

We created a special `Dockerfile.production` that:
- ✅ Removes the problematic postinstall script
- ✅ Builds without Playwright dependencies
- ✅ Uses multi-stage build with Nginx

### Solution 3: Pre-deployment Script

Run this before pushing to GitHub:
```bash
./prepare-deploy.sh
git add package.json
git commit -m "Remove postinstall for deployment"
git push
```

## Files Created to Force Dockerfile Usage

- ✅ `.coolify` - Coolify configuration
- ✅ `nixpacks.toml` - Disable Nixpacks
- ✅ `.nixpacksignore` - Ignore entire project for Nixpacks
- ✅ `Dockerfile.production` - Clean production Dockerfile
- ✅ `prepare-deploy.sh` - Pre-deployment script

## Manual Deployment Steps

If automatic detection fails:

1. **In Coolify Dashboard**:
   - Build Pack: `Dockerfile`
   - Dockerfile: `Dockerfile.production`
   - Port: `80`
   - Health Check: `/health.json`

2. **Environment Variables**:
   ```env
   VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
   VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
   VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker
   VITE_FILE_UPLOAD_MAX_SIZE=10485760
   VITE_ENVIRONMENT=production
   ```

3. **Deploy**!

## Success Indicators

✅ Build logs show: `FROM node:20-alpine AS builder`
✅ No mention of `nixpacks` or `ghcr.io/railwayapp`
✅ Build completes without Playwright errors
✅ Health check returns: `{"status":"healthy"}`

## Still Having Issues?

Try this nuclear option:
1. Delete the application in Coolify
2. Create a new one
3. **Manually select "Dockerfile" during creation**
4. Point to `Dockerfile.production`
5. Deploy

Your app should work perfectly now! 🚀