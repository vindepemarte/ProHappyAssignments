# Webhook Configuration Guide

This document provides detailed information about configuring webhooks for the ProHappyAssignments website to integrate with n8n workflows.

## Overview

The application sends form data to three different webhook endpoints:

1. **Assignment Webhook** - Handles new assignment requests
2. **Changes Webhook** - Handles change requests for existing orders
3. **Worker Webhook** - Handles worker submissions

## Environment Variables

Configure these environment variables in your deployment:

```env
# Required webhook URLs
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker

# Optional configuration
VITE_FILE_UPLOAD_MAX_SIZE=10485760  # 10MB in bytes
VITE_ENVIRONMENT=production
```

## Webhook Payload Structures

### Assignment Form Webhook

**Endpoint**: `VITE_ASSIGNMENT_WEBHOOK_URL`  
**Method**: POST  
**Content-Type**: application/json

```json
{
  "formType": "assignment",
  "timestamp": "2025-01-31T12:00:00.000Z",
  "data": {
    "accessCode": "ABC12",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "moduleName": "Computer Science 101",
    "wordCount": 1500,
    "orderDeadline": "2025-02-15",
    "guidance": "Please focus on algorithms and data structures",
    "files": [
      {
        "name": "assignment_brief.pdf",
        "size": 245760,
        "type": "application/pdf",
        "base64": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo..."
      }
    ]
  },
  "metadata": {
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    "timestamp": "2025-01-31T12:00:00.000Z",
    "formVersion": "1.0.0"
  }
}
```

### Changes Form Webhook

**Endpoint**: `VITE_CHANGES_WEBHOOK_URL`  
**Method**: POST  
**Content-Type**: application/json

```json
{
  "formType": "changes",
  "timestamp": "2025-01-31T12:00:00.000Z",
  "data": {
    "referenceCode": "XYZ89",
    "email": "john.doe@example.com",
    "orderReferenceNumber": "ORD-2025-001",
    "notes": "Please extend the deadline by 3 days and add more focus on machine learning",
    "deadlineChanges": "2025-02-18",
    "files": [
      {
        "name": "additional_requirements.docx",
        "size": 156432,
        "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "base64": "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQC..."
      }
    ]
  },
  "metadata": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "timestamp": "2025-01-31T12:00:00.000Z",
    "formVersion": "1.0.0"
  }
}
```

### Worker Form Webhook

**Endpoint**: `VITE_WORKER_WEBHOOK_URL`  
**Method**: POST  
**Content-Type**: application/json

```json
{
  "formType": "worker",
  "timestamp": "2025-01-31T12:00:00.000Z",
  "data": {
    "referenceCode": "WRK45",
    "email": "worker@example.com",
    "orderReferenceNumber": "ORD-2025-001",
    "notesForClient": "Assignment completed as requested. Please find the final document attached.",
    "files": [
      {
        "name": "completed_assignment.docx",
        "size": 892456,
        "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "base64": "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQC..."
      },
      {
        "name": "references.pdf",
        "size": 234567,
        "type": "application/pdf",
        "base64": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo..."
      }
    ]
  },
  "metadata": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "timestamp": "2025-01-31T12:00:00.000Z",
    "formVersion": "1.0.0"
  }
}
```

## File Handling

### File Size Limits

- Maximum file size per file: 10MB (configurable via `VITE_FILE_UPLOAD_MAX_SIZE`)
- Maximum total upload size: 50MB per form submission
- Supported file types: PDF, DOC, DOCX, TXT, JPG, PNG, GIF

### File Encoding

Files are encoded as base64 strings in the webhook payload. For large files, consider:

1. **Direct Upload**: Upload files to cloud storage and send URLs instead
2. **Chunked Upload**: Split large files into smaller chunks
3. **Separate Endpoint**: Use a dedicated file upload endpoint

### Example n8n File Processing

```javascript
// n8n JavaScript node to process files
const files = $json.data.files || [];
const processedFiles = [];

for (const file of files) {
  if (file.base64) {
    // Decode base64 file
    const buffer = Buffer.from(file.base64.split(',')[1], 'base64');
    
    // Save to storage or process as needed
    processedFiles.push({
      name: file.name,
      size: file.size,
      type: file.type,
      buffer: buffer
    });
  }
}

return { processedFiles };
```

## n8n Workflow Configuration

### Basic Webhook Node Setup

1. **Add Webhook Node**
   - Set HTTP Method to POST
   - Configure the webhook URL path
   - Set Response Mode to "Respond to Webhook"

2. **Configure Response**
   ```json
   {
     "success": true,
     "message": "Form submitted successfully",
     "orderId": "{{ $json.orderId }}"
   }
   ```

3. **Error Handling**
   ```json
   {
     "success": false,
     "message": "Failed to process form submission",
     "error": "{{ $json.error }}"
   }
   ```

### Advanced Workflow Example

```json
{
  "nodes": [
    {
      "name": "Assignment Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "assignment",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validate Data",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Validate required fields\nconst data = $json.data;\nif (!data.email || !data.fullName) {\n  throw new Error('Missing required fields');\n}\nreturn $json;"
      }
    },
    {
      "name": "Save to Database",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "insert",
        "table": "assignments",
        "columns": "email,full_name,module_name,word_count,deadline,guidance"
      }
    },
    {
      "name": "Send Email Notification",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{ $json.data.email }}",
        "subject": "Assignment Received - {{ $json.data.moduleName }}",
        "text": "Thank you for your assignment submission. We will contact you soon."
      }
    },
    {
      "name": "Respond Success",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{\n  \"success\": true,\n  \"message\": \"Assignment submitted successfully\",\n  \"orderId\": \"{{ $json.id }}\"\n}"
      }
    }
  ]
}
```

## Security Considerations

### Webhook Security

1. **HTTPS Only**: Always use HTTPS for webhook URLs
2. **Authentication**: Consider adding API keys or tokens
3. **Rate Limiting**: Implement rate limiting on your n8n instance
4. **Input Validation**: Validate all incoming data in your workflows

### CORS Configuration

If your n8n instance requires CORS configuration:

```javascript
// n8n CORS headers
{
  "Access-Control-Allow-Origin": "https://your-domain.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

## Testing Webhooks

### Local Testing

1. **Use ngrok for local n8n testing**:
   ```bash
   ngrok http 5678  # Default n8n port
   ```

2. **Update environment variables**:
   ```env
   VITE_ASSIGNMENT_WEBHOOK_URL=https://abc123.ngrok.io/webhook/assignment
   ```

### Production Testing

1. **Test webhook endpoints directly**:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/assignment \
     -H "Content-Type: application/json" \
     -d '{"formType":"assignment","data":{"email":"test@example.com"}}'
   ```

2. **Monitor webhook delivery**:
   - Check n8n execution logs
   - Monitor response times
   - Verify error handling

## Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Verify webhook URL is correct and accessible
   - Check n8n workflow is active
   - Verify CORS settings if applicable

2. **File upload failures**
   - Check file size limits
   - Verify base64 encoding is correct
   - Monitor memory usage for large files

3. **Timeout errors**
   - Increase webhook timeout settings
   - Optimize n8n workflow performance
   - Consider async processing for heavy operations

### Debugging Tips

1. **Enable verbose logging** in the application
2. **Use n8n's execution log** to trace webhook calls
3. **Test with minimal payloads** first
4. **Monitor network requests** in browser dev tools

## Best Practices

1. **Idempotency**: Design workflows to handle duplicate submissions
2. **Error Recovery**: Implement retry logic for failed operations
3. **Data Validation**: Always validate incoming webhook data
4. **Monitoring**: Set up alerts for webhook failures
5. **Documentation**: Keep webhook schemas up to date
6. **Testing**: Regularly test webhook endpoints
7. **Security**: Use HTTPS and implement proper authentication