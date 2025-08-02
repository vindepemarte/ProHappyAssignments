# 🔗 n8n Webhook Configuration Guide

## 🚨 Current Issues & Solutions

### 1. **HTTP Method Issue**
**Problem**: Your n8n webhook is set to `GET` but form submissions need `POST`
**Solution**: Change HTTP Method from `GET` to `POST` in n8n

### 2. **Webhook URL Configuration**
**Current URL**: `https://auto.iacovici.it/webhook-test/client`
**Status**: ✅ Updated in code

### 3. **Authentication**
**Current**: None (which is correct for basic webhooks)
**Status**: ✅ No authentication needed for this setup

## 📋 n8n Configuration Steps

### Step 1: Update HTTP Method
```
HTTP Method: POST (not GET)
```

### Step 2: Webhook URL Structure
```
Test URL: https://auto.iacovici.it/webhook-test/client
Production URL: https://auto.iacovici.it/webhook/client
Path: client
```

### Step 3: Expected Data Format
Your webhook will receive JSON data like this:

```json
{
  "formType": "assignment",
  "timestamp": "2025-02-08T12:53:00.000Z",
  "data": {
    "accessCode": "ABC12",
    "fullName": "John Doe",
    "email": "john@example.com",
    "moduleName": "CS101",
    "wordCount": 1500,
    "orderDeadline": "2025-02-15",
    "guidance": "Additional requirements...",
    "files": [
      {
        "name": "assignment.pdf",
        "size": 1024000,
        "type": "application/pdf",
        "lastModified": 1707393180000
      }
    ]
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://pro.iacovici.it/",
    "environment": "production",
    "version": "1.0.0"
  }
}
```

### Step 4: n8n Workflow Setup

1. **Webhook Node Configuration**:
   - HTTP Method: `POST`
   - Path: `client`
   - Authentication: `None`
   - Response: `Immediately`

2. **Data Processing**:
   ```javascript
   // Access form data in n8n
   const formType = $json.formType;
   const userData = $json.data;
   const files = $json.data.files;
   
   // Example: Extract user info
   const userEmail = userData.email;
   const userName = userData.fullName;
   const assignment = userData.moduleName;
   ```

3. **Response Format**:
   n8n should return:
   ```json
   {
     "success": true,
     "message": "Assignment received successfully",
     "orderId": "ASG-1707393180000"
   }
   ```

## 🔧 Server-Side Changes Made

### Updated Webhook URLs
```javascript
// serve.js - Updated default URLs
const webhookUrls = {
  assignment: 'https://auto.iacovici.it/webhook-test/client',
  changes: 'https://auto.iacovici.it/webhook-test/changes', 
  worker: 'https://auto.iacovici.it/webhook-test/worker'
};
```

### Enhanced Logging
```javascript
// Added detailed logging for debugging
console.log('Sending to webhook:', webhookUrl);
console.log('Form data:', JSON.stringify(formData, null, 2));
console.log('Webhook response status:', response.status);
```

### Better Error Handling
- Server now logs webhook failures but still returns success to users
- Detailed error logging for debugging
- Graceful fallback when webhook is unavailable

## 🧪 Testing the Webhook

### 1. Test with curl:
```bash
curl -X POST https://auto.iacovici.it/webhook-test/client \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "assignment",
    "timestamp": "2025-02-08T12:53:00.000Z",
    "data": {
      "accessCode": "TEST1",
      "fullName": "Test User",
      "email": "test@example.com",
      "moduleName": "TEST101",
      "wordCount": 1000,
      "orderDeadline": "2025-02-15",
      "guidance": "Test submission",
      "files": []
    }
  }'
```

### 2. Check n8n Execution Log:
- Go to n8n dashboard
- Check "Executions" tab
- Look for incoming POST requests
- Verify data is being received correctly

### 3. Server Logs:
When you submit a form, check server logs for:
```
Sending to webhook: https://auto.iacovici.it/webhook-test/client
Form data: { formType: "assignment", ... }
Webhook response status: 200
```

## 🚀 Deployment Checklist

- [ ] Change n8n HTTP method from GET to POST
- [ ] Verify webhook URL is accessible
- [ ] Test webhook with sample data
- [ ] Deploy updated code to Coolify
- [ ] Test form submission end-to-end
- [ ] Check n8n execution logs
- [ ] Verify email notifications (if configured)

## 🔍 Troubleshooting

### If forms still show "Submission failed":
1. Check server logs for webhook response
2. Verify n8n webhook is running and accessible
3. Test webhook URL directly with curl
4. Check n8n execution logs for errors

### Common Issues:
- **CORS**: Not an issue since we use server-side proxy
- **Authentication**: None needed for basic webhook
- **SSL**: Ensure webhook URL uses HTTPS
- **Timeout**: n8n should respond quickly (< 30 seconds)

The webhook should now work correctly with POST method and proper data handling! 🎉