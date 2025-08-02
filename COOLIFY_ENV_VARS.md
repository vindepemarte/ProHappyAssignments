# Coolify Environment Variables Setup

## Add These Environment Variables in Your Coolify Deployment:

```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_API_TOKEN=your_actual_api_token_here
VITE_NOCODB_PROJECT_ID=p165c7l1e9c2a3z
VITE_NOCODB_ASSIGNMENT_TABLE_ID=your_assignment_table_id_here
VITE_NOCODB_CHANGES_TABLE_ID=your_changes_table_id_here
VITE_NOCODB_WORKER_TABLE_ID=your_worker_table_id_here
```

## How to Get the Values:

### 1. API Token:
- Go to your NocoDB dashboard
- Click profile → Account Settings → Tokens
- Create new token or copy existing one

### 2. Table IDs:
- Open each table in NocoDB:
  - Form_Assignments
  - Form_Changes_Required  
  - Form_Worker
- Look at the URL: `/dashboard/#/nc/p165c7l1e9c2a3z/{TABLE_ID}`
- Copy the table ID from each URL

### 3. Example URLs to get Table IDs:
When you click on each table, you'll see URLs like:
- `http://nocodb.../dashboard/#/nc/p165c7l1e9c2a3z/md_abc123` ← `md_abc123` is your table ID
- `http://nocodb.../dashboard/#/nc/p165c7l1e9c2a3z/md_def456` ← `md_def456` is your table ID
- `http://nocodb.../dashboard/#/nc/p165c7l1e9c2a3z/md_ghi789` ← `md_ghi789` is your table ID

## After Setting Environment Variables:

1. **Redeploy your app** in Coolify
2. **Test the forms** - they will now connect to NocoDB
3. **Check browser console** for detailed logs
4. **Check NocoDB database** for new records

## The Code Will Now Use:
- ✅ Your Coolify environment variables
- ✅ NocoDB API v2 endpoints
- ✅ Correct project ID: `p165c7l1e9c2a3z`
- ✅ JSON data format for submissions