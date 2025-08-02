# NocoDB Setup Guide

## Overview
This guide will help you set up NocoDB to replace Google Sheets/Drive for form submissions.

## Prerequisites
- NocoDB instance running in Coolify
- Access to NocoDB admin panel

## Step 1: Create Project
1. Login to your NocoDB instance
2. Create a new project called "ProHappy Assignments"
3. Note down the project ID from the URL

## Step 2: Create Tables

### Assignment Submissions Table
Create a table called "assignment_submissions" with these columns:
- `access_code` (SingleLineText)
- `full_name` (SingleLineText)
- `email` (Email)
- `module_name` (SingleLineText)
- `word_count` (Number)
- `order_deadline` (Date)
- `guidance` (LongText)
- `data_processing_consent` (Checkbox)
- `terms_acceptance` (Checkbox)
- `attachments` (Attachment)
- `submitted_at` (DateTime)

### Change Requests Table
Create a table called "change_requests" with these columns:
- `reference_code` (SingleLineText)
- `email` (Email)
- `order_reference_number` (SingleLineText)
- `notes` (LongText)
- `deadline_changes` (LongText)
- `data_processing_consent` (Checkbox)
- `terms_acceptance` (Checkbox)
- `attachments` (Attachment)
- `submitted_at` (DateTime)

### Worker Submissions Table
Create a table called "worker_submissions" with these columns:
- `reference_code` (SingleLineText)
- `email` (Email)
- `order_reference_number` (SingleLineText)
- `notes_for_client` (LongText)
- `data_processing_consent` (Checkbox)
- `terms_acceptance` (Checkbox)
- `attachments` (Attachment)
- `submitted_at` (DateTime)

## Step 3: Get API Token
1. Go to Account Settings → Tokens
2. Create a new API token
3. Copy the token for your .env file

## Step 4: Get Table IDs
1. Open each table in NocoDB
2. Look at the URL: `/dashboard/#/nc/{project_id}/{table_id}`
3. Copy the table IDs for your .env file

**Your current setup:**
- Base URL: `http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io`
- Project ID: `p165c7l1e9c2a3z`
- API Version: v2

## Step 5: Configure Environment Variables
Update your `.env` file:
```env
VITE_NOCODB_BASE_URL=http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io
VITE_NOCODB_API_TOKEN=your_api_token_here
VITE_NOCODB_PROJECT_ID=p165c7l1e9c2a3z
VITE_NOCODB_ASSIGNMENT_TABLE_ID=your_assignment_table_id_here
VITE_NOCODB_CHANGES_TABLE_ID=your_changes_table_id_here
VITE_NOCODB_WORKER_TABLE_ID=your_worker_table_id_here
```

## Step 6: Set Up Webhooks for n8n
1. In each table, go to Settings → Webhooks
2. Create webhook for "After Insert"
3. Set webhook URL to your n8n webhook endpoint
4. Configure n8n to process the webhook data

## Benefits Over Google Sheets
- ✅ No OAuth complexity
- ✅ Better file handling
- ✅ Faster API responses
- ✅ More reliable webhooks
- ✅ Better data validation
- ✅ Same infrastructure as your app

## Testing
Once configured, test each form to ensure:
1. Data is saved to correct table
2. Files are uploaded properly
3. Webhooks trigger to n8n
4. n8n processes the data correctly