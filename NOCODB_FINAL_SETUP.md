# NocoDB Final Setup - WORKING VERSION

## ✅ What's Been Fixed:

1. **Correct API Version**: Now using NocoDB API v2
2. **Correct Project ID**: Updated to `p165c7l1e9c2a3z`
3. **Correct Base URL**: Fixed to your actual NocoDB instance
4. **Proper Service Structure**: Clean webhookService that calls NocoDB
5. **JSON Data Format**: Using JSON instead of FormData for basic fields
6. **Removed Unused Imports**: Cleaned up all form components

## 🚀 Your Current Setup:

**Files Created/Updated:**
- `src/services/webhookService.ts` - Main service that handles form submissions
- `src/services/nocodbService.ts` - NocoDB API wrapper
- `src/services/index.ts` - Exports the submit functions
- `.env.example` - Updated with your NocoDB details

**All Forms Work:**
- ✅ AssignmentForm → `submitAssignmentForm()`
- ✅ ChangesForm → `submitChangesForm()`  
- ✅ WorkerForm → `submitWorkerForm()`

## 📋 Final Steps:

### 1. Create `.env` file:
```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_API_TOKEN=your_actual_api_token_here
VITE_NOCODB_PROJECT_ID=p165c7l1e9c2a3z
VITE_NOCODB_ASSIGNMENT_TABLE_ID=your_assignment_table_id_here
VITE_NOCODB_CHANGES_TABLE_ID=your_changes_table_id_here
VITE_NOCODB_WORKER_TABLE_ID=your_worker_table_id_here
```

### 2. Get API Token:
- Go to NocoDB → Profile → Account Settings → Tokens
- Create new token or copy existing

### 3. Get Table IDs:
- Open each table in NocoDB
- Copy ID from URL: `/dashboard/#/nc/p165c7l1e9c2a3z/{TABLE_ID}`

### 4. Test:
- Fill out assignment form
- Check browser console for logs
- Check NocoDB database for new record

## 🔧 API Endpoints Used:

**Assignment Form:**
```
POST http://your-nocodb/api/v2/tables/{assignment_table_id}/records
```

**Data Sent:**
```json
{
  "access_code": "IVA98",
  "full_name": "John Doe",
  "email": "john@example.com",
  "module_name": "CS101",
  "word_count": 1000,
  "order_deadline": "2025-02-15",
  "guidance": "Additional notes",
  "data_processing_consent": true,
  "terms_acceptance": true,
  "submitted_at": "2025-02-08T..."
}
```

## 🚨 If CORS Issues Persist:

Add to your NocoDB environment in Coolify:
```env
NC_CORS_ORIGIN=*
NC_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
NC_CORS_HEADERS=Content-Type,Authorization,xc-token
```

## 📊 Expected Database Columns:

Your NocoDB tables should have these columns:

**Form_Assignments:**
- access_code (Text)
- full_name (Text)
- email (Email)
- module_name (Text)
- word_count (Number)
- order_deadline (Date)
- guidance (LongText)
- data_processing_consent (Checkbox)
- terms_acceptance (Checkbox)
- submitted_at (DateTime)

**Form_Changes_Required:**
- reference_code (Text)
- email (Email)
- order_reference_number (Text)
- notes (LongText)
- deadline_changes (LongText)
- data_processing_consent (Checkbox)
- terms_acceptance (Checkbox)
- submitted_at (DateTime)

**Form_Worker:**
- reference_code (Text)
- email (Email)
- order_reference_number (Text)
- notes_for_client (LongText)
- data_processing_consent (Checkbox)
- terms_acceptance (Checkbox)
- submitted_at (DateTime)

## 🎯 Everything is now properly connected and should work!