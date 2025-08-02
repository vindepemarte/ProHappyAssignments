# NocoDB Connection Test

## CORS Issue Solution

The error you're seeing is a CORS (Cross-Origin Resource Sharing) issue. Your NocoDB instance needs to allow requests from your frontend domain.

## Quick Fixes:

### 1. Update your .env file
Create a `.env` file in your project root with:
```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io:8080
VITE_NOCODB_API_TOKEN=your_actual_api_token_here
VITE_NOCODB_PROJECT_ID=p343-f61-394-a9fa-b36a8bbcaaf4
VITE_NOCODB_ASSIGNMENT_TABLE_ID=your_assignment_table_id_here
VITE_NOCODB_CHANGES_TABLE_ID=your_changes_table_id_here
VITE_NOCODB_WORKER_TABLE_ID=your_worker_table_id_here
```

### 2. Fix CORS in NocoDB (Coolify)

In your Coolify NocoDB deployment, add these environment variables:

```env
NC_CORS_ORIGIN=*
NC_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
NC_CORS_HEADERS=Content-Type,Authorization,xc-token
```

Or more specifically for your domain:
```env
NC_CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com
```

### 3. Alternative: Use Server-Side Proxy

If CORS continues to be an issue, we can create a server-side proxy in your `serve.js` file to forward requests to NocoDB.

## Test Connection

Open browser console and run:
```javascript
fetch('http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io:8080/api/v1/db/meta/projects', {
  headers: {
    'xc-token': 'your_api_token_here'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## Get Your API Token

1. Go to your NocoDB instance
2. Click on your profile (top right)
3. Go to "Account Settings" → "Tokens"
4. Create a new token or copy existing one

## Get Table IDs

1. Open each table in NocoDB
2. Look at the URL: `/dashboard/#/nc/{project_id}/{table_id}`
3. Copy the table IDs for your .env file