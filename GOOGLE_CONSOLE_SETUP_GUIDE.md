# 🚀 Google Console Setup Guide - Complete Instructions

## ✅ What I've Updated

1. **✅ Set default access code to 'IVA98'** - Forms will auto-validate with this code
2. **✅ Updated Google Drive folder IDs** - Using your actual folder IDs
3. **✅ Fixed Google Sheet structure** - Matches your exact sheet columns
4. **✅ Added Access Code column** - Will be added to Form Assignments sheet

## 🔧 Google Console Setup Steps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it **"ProHappy Assignments"**
4. Click **"Create"**

### Step 2: Enable Required APIs

1. In your new project, go to **"APIs & Services"** → **"Library"**
2. Search and enable these APIs:
   - **Google Drive API** (click Enable)
   - **Google Sheets API** (click Enable)

### Step 3: Create Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - **Service account name**: `prohappy-forms`
   - **Service account ID**: `prohappy-forms` (auto-filled)
   - **Description**: `Service account for ProHappy form submissions`
4. Click **"Create and Continue"**
5. Skip role assignment (click **"Continue"**)
6. Skip user access (click **"Done"**)

### Step 4: Generate Service Account Key

1. Click on your new service account email
2. Go to **"Keys"** tab
3. Click **"Add Key"** → **"Create New Key"**
4. Choose **"JSON"** format
5. Click **"Create"**
6. **Save the downloaded JSON file safely** - you'll need it!

### Step 5: Share Google Drive Folders

You need to share your 3 Google Drive folders with the service account:

1. **Assignment Files Folder**: `127g6jiDJr9oU-BDBP5DKmjNt8ARKulopBnXSmVRYvv2zvxrM3RJhA3DaOEIdTFMHIAx-7WeL`
2. **Changes Files Folder**: `1ondq8HFeZxmTt48bmQr6333BZPHVdv_Fzpzx1I4ADdYfwFmMFd3emPmLPcytghMSkDC69Ssn`
3. **Worker Files Folder**: `1HVIzeZ-G7zCUytfKDntkAvec5CC46oXCDL3IMrQ7x5iYhY2X8fvcAwmJKXlv3Xx_Iswdlz91`

For each folder:
1. Go to [Google Drive](https://drive.google.com/)
2. Find the folder (use the folder ID in the URL)
3. Right-click → **"Share"**
4. Add your service account email (from the JSON file, looks like `prohappy-forms@your-project.iam.gserviceaccount.com`)
5. Set permission to **"Editor"**
6. Click **"Send"**

### Step 6: Share Google Spreadsheet

1. Go to your spreadsheet: `https://docs.google.com/spreadsheets/d/1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA/edit`
2. Click **"Share"** button
3. Add your service account email
4. Set permission to **"Editor"**
5. Click **"Send"**

### Step 7: Add Access Code Column to Form Assignments Sheet

You need to add the "Access Code" column to your Form Assignments sheet:

1. Go to your **Form Assignments** sheet
2. Click on column **I** (after "Guidance")
3. Right-click → **"Insert 1 column right"**
4. In the header row (row 1), add **"Access Code"** in the new column

Your Form Assignments sheet should now have these columns:
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Order Deadline | Full Name | Module Name | Word Count | Assignment Files | Email address | Guidance | Access Code |

### Step 8: Configure Environment Variables

Create a `.env` file in your project root with the information from your JSON file:

```env
# From your service account JSON file
VITE_GOOGLE_CLIENT_EMAIL=prohappy-forms@your-project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Your spreadsheet and folder IDs (already configured)
VITE_GOOGLE_SPREADSHEET_ID=1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA
VITE_GOOGLE_ASSIGNMENT_FOLDER_ID=127g6jiDJr9oU-BDBP5DKmjNt8ARKulopBnXSmVRYvv2zvxrM3RJhA3DaOEIdTFMHIAx-7WeL
VITE_GOOGLE_CHANGES_FOLDER_ID=1ondq8HFeZxmTt48bmQr6333BZPHVdv_Fzpzx1I4ADdYfwFmMFd3emPmLPcytghMSkDC69Ssn
VITE_GOOGLE_WORKER_FOLDER_ID=1HVIzeZ-G7zCUytfKDntkAvec5CC46oXCDL3IMrQ7x5iYhY2X8fvcAwmJKXlv3Xx_Iswdlz91
```

## 🎯 How It Will Work

### **Assignment Form Submission:**
1. **Files upload** → Your "Client" Google Drive folder
2. **Row added** to "Form Assignments" sheet:
   ```
   31/07/2025 20:38:42 | 01/09/2025 | John Doe | CS101 | 5000 | https://drive.google.com/open?id=ABC123, https://drive.google.com/open?id=DEF456 | john@example.com | Additional notes | IVA98
   ```
3. **Your n8n workflow triggers** automatically!

### **Changes Form Submission:**
1. **Files upload** → Your "Changes Required" Google Drive folder
2. **Row added** to "Form Changes Required" sheet:
   ```
   31/07/2025 20:38:42 | john@example.com | ORD123 | Need revisions | 05/08/2025 | https://drive.google.com/open?id=XYZ789
   ```

### **Worker Form Submission:**
1. **Files upload** → Your "Worker" Google Drive folder  
2. **Row added** to "Form Worker" sheet:
   ```
   31/07/2025 20:38:42 | worker@example.com | ORD123 | Work completed | https://drive.google.com/open?id=DEF456
   ```

## 🧪 Testing

1. **Deploy your updated code**
2. **Submit a test form** with the access code 'IVA98'
3. **Check Google Drive** - files should appear in the correct folder
4. **Check Google Sheet** - new row should appear with file URLs
5. **Check n8n** - your existing workflow should trigger!

## 🎉 Benefits

- ✅ **No webhook complexity** - Direct Google integration
- ✅ **Your n8n unchanged** - Same trigger, same data structure
- ✅ **Files organized** - Separate folders for each form type
- ✅ **Access code 'IVA98'** - Default and auto-validated
- ✅ **File URLs ready** - Direct Google Drive links

Your existing n8n workflow will work exactly the same, just with better organized data! 🚀"