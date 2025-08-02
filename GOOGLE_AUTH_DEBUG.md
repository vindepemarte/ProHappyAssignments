# 🔍 Google Authentication Debug Guide

## 🚨 Common Issues & Solutions

The "Failed to authenticate with Google" error is usually caused by one of these issues:

### 1. **Environment Variables Not Set Properly**

In Coolify, make sure your environment variables are set exactly like this:

```env
VITE_GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...your private key content...
...
-----END PRIVATE KEY-----"
```

**Important Notes:**
- The private key MUST be wrapped in quotes
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Keep all the newlines in the private key

### 2. **Private Key Formatting Issues**

If you're copying from the JSON file, the private key will have `\\n` instead of actual newlines. The server now handles this automatically, but make sure:

- Copy the ENTIRE private key including begin/end lines
- Wrap it in quotes in Coolify
- Don't remove any characters

### 3. **Service Account Permissions**

Make sure your service account has:
- ✅ **Editor access** to your Google Drive folders
- ✅ **Editor access** to your Google Spreadsheet
- ✅ **Google Drive API** enabled in Google Cloud Console
- ✅ **Google Sheets API** enabled in Google Cloud Console

## 🧪 Debug Steps

### Step 1: Test Environment Variables

1. **Deploy your updated code**
2. **Open browser console** on your website
3. **Go to**: `https://your-domain.com/api/test-env`
4. **Check the response** - you should see:
   ```json
   {
     "hasClientEmail": true,
     "hasPrivateKey": true,
     "clientEmail": "your-service-account@project.iam.gserviceaccount.com",
     "privateKeyLength": 1675,
     "privateKeyStart": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG..."
   }
   ```

**If any value is `false` or `null`:**
- ❌ Environment variables are not set correctly in Coolify
- ✅ Go back to Coolify and check your environment variables

### Step 2: Test Google Authentication

1. **Open browser console** on your website
2. **Run**: `debugService.testGoogleAuth()`
3. **Check the console output**

**Expected Success:**
```
Client-side environment check:
Client Email: your-service-account@project.iam.gserviceaccount.com
Private Key available: true
Private Key length: 1675
Google Auth Test Success: { access_token: "ya29.c.c0AY_VpZ...", ... }
```

**If it fails:**
- Check the server logs for detailed error messages
- Look for JWT signing errors
- Verify service account permissions

### Step 3: Check Server Logs

Look for these log messages in your server:
```
Processing Google authentication request
Client Email: your-service-account@project.iam.gserviceaccount.com
Private Key length: 1675
Private Key starts with: -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...
```

**Common Error Messages:**
- `"invalid_grant"` → Service account key is wrong or expired
- `"invalid_scope"` → API permissions issue
- `"invalid_assertion"` → JWT signing failed (private key issue)

## 🔧 Quick Fixes

### Fix 1: Recreate Service Account Key

If the private key is causing issues:

1. **Go to Google Cloud Console**
2. **IAM & Admin** → **Service Accounts**
3. **Click your service account**
4. **Keys** tab → **Add Key** → **Create New Key**
5. **Download new JSON file**
6. **Update environment variables** with new key

### Fix 2: Check API Enablement

1. **Go to Google Cloud Console**
2. **APIs & Services** → **Enabled APIs**
3. **Make sure these are enabled:**
   - Google Drive API
   - Google Sheets API

### Fix 3: Verify Permissions

1. **Check Google Drive folders** - service account should have Editor access
2. **Check Google Spreadsheet** - service account should have Editor access
3. **Test by sharing a test folder** with the service account email

## 🚀 Test the Fix

After making changes:

1. **Redeploy your application**
2. **Try submitting a form**
3. **Check browser console** for detailed error messages
4. **Check server logs** for authentication details

## 📞 Still Having Issues?

If you're still getting authentication errors, please share:

1. **The output from** `/api/test-env`
2. **Browser console errors** when submitting a form
3. **Server logs** during form submission
4. **Your environment variable setup** (without the actual private key)

The debug information will help identify exactly what's going wrong! 🔍"