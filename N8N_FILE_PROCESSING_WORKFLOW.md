# 📁 n8n File Processing & Google Drive Upload Workflow

## 🎯 Goal
Convert base64 file data from webhook into actual files and upload to Google Drive.

## 📋 Workflow Steps

### 1. **Webhook Node** (Already Set Up)
Your webhook receives data like:
```json
{
  "data": {
    "files": [
      {
        "name": "Current Account Statement (1).pdf",
        "size": 438673,
        "type": "application/pdf",
        "data": "JVBERi0xLjQKMSAwIG9iago..."
      }
    ]
  }
}
```

### 2. **Split In Batches Node**
- **Purpose**: Process each file individually
- **Configuration**:
  - **Input Data**: `{{ $json.data.files }}`
  - **Batch Size**: `1`

### 3. **Code Node** - Convert Base64 to Binary
- **Purpose**: Convert base64 string to binary file data
- **Language**: JavaScript
- **Code**:

```javascript
// Get file data from the current batch item
const fileData = $input.first().json;

// Convert base64 to binary
const binaryData = Buffer.from(fileData.data, 'base64');

// Create binary data object for n8n
const binaryDataObject = {
  data: binaryData,
  mimeType: fileData.type,
  fileName: fileData.name,
  fileExtension: fileData.name.split('.').pop()
};

// Return the file info and set binary data
return {
  json: {
    fileName: fileData.name,
    fileSize: fileData.size,
    mimeType: fileData.type,
    originalData: fileData
  },
  binary: {
    data: binaryDataObject
  }
};
```

### 4. **Google Drive Node** - Upload File
- **Purpose**: Upload the converted file to Google Drive
- **Configuration**:
  - **Operation**: `Upload`
  - **File Name**: `{{ $json.fileName }}`
  - **Binary Data**: `data` (from previous node)
  - **Parent Folder ID**: Your Google Drive folder ID
  - **Options**:
    - **Convert**: `false` (to keep original format)
    - **OCR**: `false` (unless you want text recognition)

### 5. **Set Node** - Organize Response Data
- **Purpose**: Clean up the response data
- **Configuration**:

```javascript
{
  "uploadedFile": {
    "name": "{{ $json.fileName }}",
    "driveId": "{{ $('Google Drive').item.json.id }}",
    "driveUrl": "{{ $('Google Drive').item.json.webViewLink }}",
    "size": "{{ $json.fileSize }}",
    "mimeType": "{{ $json.mimeType }}"
  }
}
```

## 🔧 Alternative: Single Code Node Solution

If you prefer a single node approach, here's a comprehensive code node:

```javascript
// Get all files from webhook data
const files = $json.data.files || [];
const uploadedFiles = [];

// Process each file
for (const file of files) {
  try {
    // Convert base64 to binary
    const binaryData = Buffer.from(file.data, 'base64');
    
    // Create a temporary file path
    const tempFilePath = `/tmp/${file.name}`;
    
    // Write file to temporary location
    require('fs').writeFileSync(tempFilePath, binaryData);
    
    // Here you would typically use Google Drive API
    // For now, we'll prepare the data structure
    uploadedFiles.push({
      originalName: file.name,
      size: file.size,
      type: file.type,
      tempPath: tempFilePath,
      status: 'ready_for_upload'
    });
    
  } catch (error) {
    uploadedFiles.push({
      originalName: file.name,
      error: error.message,
      status: 'failed'
    });
  }
}

return {
  json: {
    totalFiles: files.length,
    processedFiles: uploadedFiles.length,
    files: uploadedFiles
  }
};
```

## 🔑 Google Drive Setup

### 1. **Create Google Drive Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create credentials (Service Account or OAuth2)
5. Download the credentials JSON

### 2. **Configure n8n Google Drive Node**
1. Add Google Drive node to workflow
2. Create new credentials
3. Upload your credentials JSON
4. Test the connection

### 3. **Get Folder ID** (Optional)
To upload to a specific folder:
1. Open Google Drive in browser
2. Navigate to your target folder
3. Copy the folder ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

## 📊 Complete Workflow JSON

Here's the complete n8n workflow you can import:

```json
{
  "name": "File Upload to Google Drive",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "client",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "name": "SplitInBatches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "// Get file data from the current batch item\nconst fileData = $input.first().json;\n\n// Convert base64 to binary\nconst binaryData = Buffer.from(fileData.data, 'base64');\n\n// Create binary data object for n8n\nconst binaryDataObject = {\n  data: binaryData,\n  mimeType: fileData.type,\n  fileName: fileData.name,\n  fileExtension: fileData.name.split('.').pop()\n};\n\n// Return the file info and set binary data\nreturn {\n  json: {\n    fileName: fileData.name,\n    fileSize: fileData.size,\n    mimeType: fileData.type,\n    originalData: fileData\n  },\n  binary: {\n    data: binaryDataObject\n  }\n};"
      },
      "name": "Convert Base64 to Binary",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "operation": "upload",
        "fileUploads": {
          "fileName": "={{ $json.fileName }}",
          "binaryData": "data"
        },
        "options": {
          "parents": ["YOUR_FOLDER_ID_HERE"]
        }
      },
      "name": "Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "SplitInBatches",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "SplitInBatches": {
      "main": [
        [
          {
            "node": "Convert Base64 to Binary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Convert Base64 to Binary": {
      "main": [
        [
          {
            "node": "Google Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🧪 Testing Steps

1. **Test Base64 Conversion**:
   - Add a Code node after webhook
   - Log the converted binary data
   - Verify file size matches original

2. **Test Google Drive Upload**:
   - Start with a simple text file
   - Check if file appears in Google Drive
   - Verify file can be opened correctly

3. **Test Full Workflow**:
   - Submit a form with multiple files
   - Check all files are uploaded
   - Verify file integrity

## 🔍 Debugging Tips

### Check File Conversion
```javascript
// Add this to your Code node for debugging
console.log('Original file size:', fileData.size);
console.log('Converted buffer size:', binaryData.length);
console.log('File type:', fileData.type);
console.log('File name:', fileData.name);
```

### Verify Base64 Data
```javascript
// Check if base64 data is valid
const isValidBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(fileData.data);
console.log('Valid base64:', isValidBase64);
```

## 🎉 Expected Result

After running this workflow:
1. ✅ Files are converted from base64 to binary
2. ✅ Files are uploaded to Google Drive
3. ✅ You get Google Drive file IDs and URLs
4. ✅ Files maintain their original format and can be opened normally

Your files will be accessible in Google Drive and you can share them, organize them in folders, or process them further as needed!