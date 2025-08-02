# Debug Environment Variables

## Check if your Coolify environment variables are working:

1. **Open browser console** on your deployed app
2. **Run this command** to check what environment variables are loaded:

```javascript
console.log('Environment Variables Check:');
console.log('VITE_NOCODB_BASE_URL:', import.meta.env.VITE_NOCODB_BASE_URL);
console.log('VITE_NOCODB_PROJECT_ID:', import.meta.env.VITE_NOCODB_PROJECT_ID);
console.log('VITE_NOCODB_API_TOKEN:', import.meta.env.VITE_NOCODB_API_TOKEN ? 'Present' : 'Missing');
console.log('VITE_NOCODB_ASSIGNMENT_TABLE_ID:', import.meta.env.VITE_NOCODB_ASSIGNMENT_TABLE_ID);
```

## Expected Output:
```
VITE_NOCODB_BASE_URL: http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_PROJECT_ID: p165c7l1e9c2a3z
VITE_NOCODB_API_TOKEN: Present
VITE_NOCODB_ASSIGNMENT_TABLE_ID: md_xxxxx (your actual table ID)
```

## If Variables Show as `undefined`:

1. **Check Coolify Environment Variables** - make sure they're set correctly
2. **Redeploy the app** - environment variables are injected at build time
3. **Check variable names** - they must start with `VITE_` to be available in the browser

## If Still Getting localhost:8080:

The issue might be:
1. **Old build cache** - try a fresh deployment
2. **Environment variables not set** in Coolify
3. **Variable names incorrect** in Coolify

## Current Code Status:
✅ No hardcoded localhost in source code
✅ All services use `import.meta.env.VITE_*` variables
✅ No fallback values that could cause localhost
✅ Debugging logs added to show actual values used