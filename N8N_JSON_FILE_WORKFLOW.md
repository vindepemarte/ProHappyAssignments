# 📄 n8n JSON File + FormData Workflow Guide

## 🎯 What's New
We now send form data as a **structured JSON file** (`data.json`) along with the actual uploaded files. This makes it much easier for n8n to process the structured data while still handling files efficiently.

## 📋 What You'll Receive in n8n

Your webhook will receive **multipart/form-data** with:

### 1. **data.json** (JSON File)
Contains all the structured form data:
```json
{
  "formType": "assignment",
  "timestamp": "2025-02-08T12:30:00.000Z",
  "formData": {
    "accessCode": "ABC123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "moduleName": "CS101",
    "wordCount": 5000,
    "orderDeadline": "2025-02-15",
    "guidance": "Additional requirements here"
  },
  "files": [
    {
      "fieldName": "file_0",
      "originalName": "assignment.pdf",
      "size": 1024000,
      "type": "application/pdf",
      "lastModified": 1707393600000
    },
    {
      "fieldName": "file_1", 
      "originalName": "references.docx",
      "size": 512000,
      "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "lastModified": 1707393700000
    }
  ],
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://example.com",
    "environment": "production",
    "version": "1.0.0",
    "fileCount": 2
  }
}
```

### 2. **Actual Files**
- `file_0`: First uploaded file (binary data)
- `file_1`: Second uploaded file (binary data)
- etc.

## 🔧 n8n Workflow Setup

### 1. **Webhook Node Configuration**
- **HTTP Method**: `POST`
- **Path**: `client` (or your preferred path)
- **Authentication**: `None`
- **Response**: `Immediately`
- **Options**: ✅ Enable \"Binary Data\"

### 2. **Extract JSON Data Node** (Code Node)
```javascript
// Get the webhook data
const webhookData = $input.first();
const binary = webhookData.binary;

// Extract and parse the JSON data file
let jsonData = null;
if (binary['data.json']) {
  const jsonContent = binary['data.json'].data.toString('utf8');
  jsonData = JSON.parse(jsonContent);
}

if (!jsonData) {
  throw new Error('No JSON data found in request');
}

// Extract form information
const formType = jsonData.formType;
const timestamp = jsonData.timestamp;
const formData = jsonData.formData;
const fileInfo = jsonData.files;
const metadata = jsonData.metadata;

console.log(`Processing ${formType} form with ${fileInfo.length} files`);

return {
  json: {
    formType,
    timestamp,
    userEmail: formData.email,
    userName: formData.fullName,
    formData,
    fileInfo,
    metadata,
    fileCount: fileInfo.length
  },
  binary: binary // Pass through all binary data
};
```

### 3. **Process Each File Node** (Split In Batches)
- **Input Data**: `{{ $json.fileInfo }}`
- **Batch Size**: `1`

### 4. **Upload to Google Drive Node**
- **Operation**: `Upload`
- **File Name**: `{{ $json.originalName }}`
- **Binary Data**: `{{ $json.fieldName }}` (references the binary data)
- **Parent Folder**: Your Google Drive folder ID

### 5. **Collect Results Node** (Set Node)
```javascript
{
  \"uploadedFile\": {
    \"originalName\": \"{{ $json.originalName }}\",
    \"driveId\": \"{{ $('Google Drive').item.json.id }}\",
    \"driveUrl\": \"{{ $('Google Drive').item.json.webViewLink }}\",
    \"size\": \"{{ $json.size }}\",
    \"mimeType\": \"{{ $json.type }}\",
    \"fieldName\": \"{{ $json.fieldName }}\"
  }
}
```

### 6. **Send Confirmation Email Node** (Email Node)
```javascript
// Use the extracted form data
const formData = $('Extract JSON Data').item.json.formData;
const uploadedFiles = $('Collect Results').all();

const emailBody = `
Dear ${formData.fullName},

Your ${$('Extract JSON Data').item.json.formType} form has been successfully submitted!

Details:
- Access Code: ${formData.accessCode}
- Module: ${formData.moduleName}
- Word Count: ${formData.wordCount}
- Deadline: ${formData.orderDeadline}

Files uploaded: ${uploadedFiles.length}
${uploadedFiles.map(file => `- ${file.json.uploadedFile.originalName}`).join('\\n')}

We'll process your request and get back to you soon!

Best regards,
ProHappy Assignments Team
`;

return {
  to: formData.email,
  subject: `${formData.accessCode} - Assignment Submitted Successfully`,
  body: emailBody
};
```

## 🎉 Benefits of JSON File Approach

### ✅ **Structured Data Processing**
- All form data in one organized JSON file
- Easy to parse and validate
- Clear data structure for processing

### ✅ **File Metadata Available**
- Original filenames preserved
- File sizes and types included
- Easy to map files to form data

### ✅ **Better Error Handling**
- JSON parsing errors are isolated
- File processing can continue even if JSON fails
- Clear separation of concerns

### ✅ **Easier n8n Workflow**
- Single JSON parse operation
- Direct access to all form fields
- Simple file mapping using fieldName

## 🧪 Testing the Workflow

1. **Submit a form** with files from your website
2. **Check n8n execution** - you should see:
   - `data.json` in binary data with all form information
   - Individual files (`file_0`, `file_1`, etc.) in binary data
3. **JSON data should parse cleanly** with all form fields accessible
4. **Files should upload to Google Drive** using the fieldName references

## 📊 Expected n8n Binary Data Structure

```
binary: {
  \"data.json\": {
    fileName: \"data.json\",
    mimeType: \"application/json\",
    data: Buffer // Contains the JSON structure above
  },
  \"file_0\": {
    fileName: \"assignment.pdf\",
    mimeType: \"application/pdf\", 
    data: Buffer // Actual PDF file data
  },
  \"file_1\": {
    fileName: \"references.docx\",
    mimeType: \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",
    data: Buffer // Actual DOCX file data
  }
}
```

## 🚀 This Approach Gives You the Best of Both Worlds!

- **Structured data** in an easy-to-parse JSON file
- **Efficient file handling** with native binary data
- **Clear mapping** between form data and files
- **Simple n8n processing** with standard nodes

The JSON file contains all the context you need, while the files are handled efficiently as binary data. Perfect for automated processing! 🎯"