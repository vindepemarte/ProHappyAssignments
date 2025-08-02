# 🚀 Google Drive + Sheets Direct Integration Setup

## 🎯 What This Does

Your forms now:
1. **Upload files directly to Google Drive** (in folders you choose)
2. **Add a row to your Google Sheet** with all form data + file URLs
3. **Your existing n8n workflow triggers automatically** when new rows are added

No more complex webhooks! Simple and direct. 🎉

## 🔧 Setup Steps

### 1. **Create Google Cloud Project & Enable APIs**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Google Drive API**
   - **Google Sheets API**

### 2. **Create Service Account & Get Credentials**

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name it "ProHappy Forms Integration"
4. Click **Create and Continue**
5. Skip role assignment for now
6. Click **Done**
7. Click on your new service account
8. Go to **Keys** tab
9. Click **Add Key** → **Create New Key** → **JSON**
10. Download the JSON file (keep it safe!)

### 3. **Get OAuth2 Credentials (Alternative Method)**

If you prefer OAuth2 instead of service account:

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add your domain to authorized origins
5. Get your **Client ID** and **Client Secret**
6. Use Google OAuth2 Playground to get refresh token

### 4. **Create Google Drive Folders**

1. Go to [Google Drive](https://drive.google.com/)
2. Create these folders:
   - **"ProHappy - Assignment Files"**
   - **"ProHappy - Changes Files"**  
   - **"ProHappy - Worker Files"**
3. Right-click each folder → **Share** → Add your service account email
4. Give **Editor** permissions
5. Copy each folder ID from the URL (the long string after `/folders/`)

### 5. **Set Up Your Google Sheet**

Your existing sheet: `1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA`

Make sure you have these sheets with these exact column headers:

#### **"Form Assignments" Sheet:**
| Timestamp | Order Deadline | Full Name | Module Name | Word Count | Assignment Files | Email address | Guidance | Access Code |
|-----------|----------------|-----------|-------------|------------|------------------|---------------|----------|-------------|

#### **"Form Changes" Sheet:**
| Timestamp | Reference Code | Email | Order Reference Number | Notes | Deadline Changes | Upload Files |
|-----------|----------------|-------|------------------------|-------|------------------|--------------|

#### **"Form Workers" Sheet:**
| Timestamp | Reference Code | Email | Order Reference Number | Notes for Client | Upload Section |
|-----------|----------------|-------|------------------------|------------------|----------------|

### 6. **Configure Environment Variables**

Create a `.env` file with:

```env
# Google API Configuration
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
VITE_GOOGLE_REFRESH_TOKEN=your_refresh_token_here

# Your existing spreadsheet
VITE_GOOGLE_SPREADSHEET_ID=1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA

# Your Google Drive folder IDs
VITE_GOOGLE_ASSIGNMENT_FOLDER_ID=your_assignment_folder_id
VITE_GOOGLE_CHANGES_FOLDER_ID=your_changes_folder_id  
VITE_GOOGLE_WORKER_FOLDER_ID=your_worker_folder_id
```

## 🎉 How It Works

### **When Someone Submits a Form:**

1. **Files Upload** → Your chosen Google Drive folder
2. **Get File URLs** → `https://drive.google.com/open?id=FILE_ID`
3. **Add Row** → Your Google Sheet with all data + comma-separated file URLs
4. **n8n Triggers** → Your existing workflow runs automatically!

### **Example Row Added:**
```
Timestamp: 31/07/2025 19:49:28
Order Deadline: 01/08/2025  
Full Name: John Doe
Module Name: CS101
Word Count: 5000
Assignment Files: https://drive.google.com/open?id=IVA983, https://drive.google.com/open?id=DEF456
Email address: john@example.com
Guidance: Please focus on the theoretical aspects
Access Code: JD001
```

## 🔧 Your n8n Workflow

**No changes needed!** Your existing trigger will work exactly the same:

```json
{
  "pollTimes": {"item": [{"mode": "everyMinute"}]},
  "documentId": "1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA",
  "sheetName": "Form Assignments",
  "event": "rowAdded"
}
```

The only difference is now the "Assignment Files" column will have the actual Google Drive URLs, ready to use!

## 🚀 Benefits

- ✅ **No complex webhooks** - Direct Google integration
- ✅ **Files organized** - Separate folders for each form type
- ✅ **Your n8n works unchanged** - Same trigger, same data structure
- ✅ **File URLs ready** - Direct links to Google Drive files
- ✅ **Reliable** - Google's infrastructure handles everything
- ✅ **Simple** - Just upload files and add rows

## 🧪 Testing

1. **Submit a form** with files
2. **Check Google Drive** - Files should appear in the correct folder
3. **Check Google Sheet** - New row should appear with file URLs
4. **Check n8n** - Your workflow should trigger automatically

Perfect! Much simpler than webhooks and works exactly like you want! 🎯"