# Get NocoDB Table IDs

## Method 1: From URL
1. Open your NocoDB dashboard: http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
2. Click on each table (Form_Assignments, Form_Changes_Required, Form_Worker)
3. Look at the URL in your browser: `/dashboard/#/nc/p165c7l1e9c2a3z/{TABLE_ID}`
4. Copy the table ID from the URL

## Method 2: From Browser Console
1. Open your NocoDB dashboard
2. Open browser developer tools (F12)
3. Go to Console tab
4. Run this command (replace YOUR_API_TOKEN with your actual token):

```javascript
fetch('http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io/api/v2/meta/bases/p165c7l1e9c2a3z/tables', {
  headers: {
    'xc-token': 'YOUR_API_TOKEN'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Tables:');
  data.list.forEach(table => {
    console.log(`${table.title}: ${table.id}`);
  });
})
.catch(console.error);
```

## Expected Table Names
Based on your screenshot, you should have:
- `Form_Assignments` - for assignment submissions
- `Form_Changes_Required` - for change requests  
- `Form_Worker` - for worker submissions

## Your .env File Should Look Like:
```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_API_TOKEN=your_actual_api_token_here
VITE_NOCODB_PROJECT_ID=p165c7l1e9c2a3z
VITE_NOCODB_ASSIGNMENT_TABLE_ID=table_id_for_form_assignments
VITE_NOCODB_CHANGES_TABLE_ID=table_id_for_form_changes_required
VITE_NOCODB_WORKER_TABLE_ID=table_id_for_form_worker
```

## Get Your API Token
1. Go to your NocoDB instance
2. Click on your profile (top right)
3. Go to "Account Settings" → "Tokens"
4. Create a new token or copy existing one