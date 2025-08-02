# Test NocoDB Connection

## Quick Test Steps:

1. **Create your `.env` file** in the project root:
```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_API_TOKEN=your_actual_api_token_here
VITE_NOCODB_PROJECT_ID=p165c7l1e9c2a3z
VITE_NOCODB_ASSIGNMENT_TABLE_ID=your_assignment_table_id_here
VITE_NOCODB_CHANGES_TABLE_ID=your_changes_table_id_here
VITE_NOCODB_WORKER_TABLE_ID=your_worker_table_id_here
```

2. **Get your API token**:
   - Go to your NocoDB dashboard
   - Click profile → Account Settings → Tokens
   - Create/copy token

3. **Get table IDs**:
   - Open each table in NocoDB
   - Look at URL: `/dashboard/#/nc/p165c7l1e9c2a3z/{TABLE_ID}`
   - Copy the table ID

4. **Test the form**:
   - Fill out the assignment form
   - Check browser console for detailed logs
   - Check your NocoDB database for the new record

## What the Code Does Now:

✅ **Uses correct API v2 endpoints**: `/api/v2/tables/{table_id}/records`
✅ **Sends JSON data** (not FormData) for basic fields
✅ **Handles authentication** with `xc-token` header
✅ **Provides detailed logging** for debugging
✅ **Maps form fields correctly** to database columns

## Expected Database Columns:

**Form_Assignments table should have:**
- access_code
- full_name  
- email
- module_name
- word_count
- order_deadline
- guidance
- data_processing_consent
- terms_acceptance
- submitted_at

## If It Still Doesn't Work:

1. **Check CORS**: Add these to your NocoDB environment in Coolify:
   ```
   NC_CORS_ORIGIN=*
   NC_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
   NC_CORS_HEADERS=Content-Type,Authorization,xc-token
   ```

2. **Check console logs** - they will show exactly what's happening

3. **Verify table structure** - make sure column names match what the code sends