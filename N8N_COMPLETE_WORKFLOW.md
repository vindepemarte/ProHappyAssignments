# 🎯 Complete n8n Workflow Guide - JSON + Form Fields + Individual Files

## 📋 What You'll Receive in n8n Now

Your webhook will receive **multipart/form-data** with:

### 1. **data.json** (Complete Structured Data)
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
    "guidance": "Additional requirements"
  },
  "files": [...],
  "metadata": {...}
}
```

### 2. **Regular Form Fields** (Easy Direct Access)
- `formType`: "assignment"
- `timestamp`: "2025-02-08T12:30:00.000Z"
- `accessCode`: "ABC123"
- `fullName`: "John Doe"
- `email`: "john@example.com"
- `moduleName`: "CS101"
- `wordCount`: "5000"
- `orderDeadline`: "2025-02-15"
- `guidance`: "Additional requirements"
- `fileCount`: "2"
- `metadata`: JSON string with browser info

### 3. **Individual Files** (Binary Data)
- `file_0`: First uploaded file
- `file_1`: Second uploaded file
- etc.

## 🔧 n8n Workflow Setup Options

### Option A: Simple Direct Access (Recommended for Most Cases)

#### 1. **Webhook Node**
- **HTTP Method**: `POST`
- **Path**: `client`
- **Authentication**: `None`
- **Response**: `Immediately`
- **Options**: ✅ Enable "Binary Data"

#### 2. **Extract Form Data Node** (Set Node)
```javascript
// Direct access to form fields - no parsing needed!
{
  "formType": "{{ $json.body.formType }}",
  "userEmail": "{{ $json.body.email }}",
  "userName": "{{ $json.body.fullName }}",
  "accessCode": "{{ $json.body.accessCode }}",
  "moduleName": "{{ $json.body.moduleName }}",
  "wordCount": "{{ $json.body.wordCount }}",
  "deadline": "{{ $json.body.orderDeadline }}",
  "guidance": "{{ $json.body.guidance }}",
  "fileCount": "{{ $json.body.fileCount }}",
  "timestamp": "{{ $json.body.timestamp }}"
}
```

#### 3. **Process Files Node** (Code Node)
```javascript
// Get file count and create file list
const fileCount = parseInt($json.fileCount || '0');
const files = [];

for (let i = 0; i < fileCount; i++) {
  const fileKey = `file_${i}`;
  if ($input.first().binary[fileKey]) {
    files.push({
      fieldName: fileKey,
      fileName: $input.first().binary[fileKey].fileName,
      mimeType: $input.first().binary[fileKey].mimeType,
      size: $input.first().binary[fileKey].data.length
    });
  }
}

return {
  json: {
    ...$json, // Keep all form data
    files: files
  },
  binary: $input.first().binary // Pass through all files
};
```

#### 4. **Split Files for Upload** (Split In Batches)
- **Input Data**: `{{ $json.files }}`
- **Batch Size**: `1`

#### 5. **Upload to Google Drive**
- **Operation**: `Upload`
- **File Name**: `{{ $json.fileName }}`
- **Binary Data**: `{{ $json.fieldName }}`
- **Parent Folder**: Your folder ID

### Option B: JSON File Processing (For Complex Logic)

#### 1. **Webhook Node** (Same as above)

#### 2. **Parse JSON Data Node** (Code Node)
```javascript
// Extract and parse the JSON file
const binary = $input.first().binary;
let jsonData = null;

if (binary['data.json']) {
  const jsonContent = binary['data.json'].data.toString('utf8');
  jsonData = JSON.parse(jsonContent);
}

// Also get direct form fields as backup
const formFields = $input.first().json.body;

return {
  json: {
    // Structured data from JSON file
    structuredData: jsonData,
    // Direct form fields
    formFields: formFields,
    // Combined for easy access
    formType: jsonData?.formType || formFields.formType,
    userEmail: jsonData?.formData?.email || formFields.email,
    userName: jsonData?.formData?.fullName || formFields.fullName,
    fileCount: jsonData?.files?.length || parseInt(formFields.fileCount || '0')
  },
  binary: binary
};
```

## 🎉 Benefits of This Approach

### ✅ **Multiple Access Methods**
- **Direct field access**: `{{ $json.body.email }}` - Super simple!
- **JSON structure**: Full data structure for complex processing
- **Individual files**: Each file accessible separately

### ✅ **Flexibility**
- Use direct fields for simple workflows
- Use JSON data for complex logic
- Mix and match as needed

### ✅ **Easy File Handling**
- Files are separate binary items
- Direct upload to Google Drive
- No parsing or conversion needed

## 🧪 Example: Complete Assignment Processing Workflow

### 1. **Webhook** → Receives all data

### 2. **Extract Data** (Set Node)
```javascript
{
  "studentEmail": "{{ $json.body.email }}",
  "studentName": "{{ $json.body.fullName }}",
  "accessCode": "{{ $json.body.accessCode }}",
  "module": "{{ $json.body.moduleName }}",
  "wordCount": "{{ $json.body.wordCount }}",
  "deadline": "{{ $json.body.orderDeadline }}",
  "guidance": "{{ $json.body.guidance }}",
  "fileCount": "{{ $json.body.fileCount }}",
  "submissionTime": "{{ $json.body.timestamp }}"
}
```

### 3. **Create Drive Folder** (Google Drive)
- **Operation**: `Create Folder`
- **Name**: `{{ $json.accessCode }} - {{ $json.studentName }}`

### 4. **Process Files** (Code Node)
```javascript
const fileCount = parseInt($json.fileCount || '0');
const files = [];

for (let i = 0; i < fileCount; i++) {
  const fileKey = `file_${i}`;
  if ($input.first().binary[fileKey]) {
    files.push({
      fieldName: fileKey,
      fileName: $input.first().binary[fileKey].fileName,
      driveFolder: $('Create Drive Folder').item.json.id
    });
  }
}

return files.map(file => ({
  json: file,
  binary: { [file.fieldName]: $input.first().binary[file.fieldName] }
}));
```

### 5. **Upload Files** (Split In Batches → Google Drive)
- **Batch Size**: `1`
- **Operation**: `Upload`
- **File Name**: `{{ $json.fileName }}`
- **Binary Data**: `{{ $json.fieldName }}`
- **Parent Folder**: `{{ $json.driveFolder }}`

### 6. **Send Confirmation Email** (Email Node)
```javascript
{
  "to": "{{ $('Extract Data').item.json.studentEmail }}",
  "subject": "{{ $('Extract Data').item.json.accessCode }} - Assignment Received",
  "body": `Dear {{ $('Extract Data').item.json.studentName }},

Your assignment has been successfully submitted!

Details:
- Access Code: {{ $('Extract Data').item.json.accessCode }}
- Module: {{ $('Extract Data').item.json.module }}
- Word Count: {{ $('Extract Data').item.json.wordCount }}
- Deadline: {{ $('Extract Data').item.json.deadline }}
- Files Uploaded: {{ $('Extract Data').item.json.fileCount }}

We'll process your assignment and get back to you soon!

Best regards,
ProHappy Assignments Team`
}
```

## 🚀 This Gives You Everything You Need!

- ✅ **Direct field access** - No parsing required
- ✅ **Structured JSON data** - For complex processing
- ✅ **Individual files** - Easy to handle separately
- ✅ **Simple workflows** - Use direct fields
- ✅ **Complex workflows** - Use JSON structure
- ✅ **File processing** - Each file handled individually

Perfect for any n8n workflow complexity! 🎯"