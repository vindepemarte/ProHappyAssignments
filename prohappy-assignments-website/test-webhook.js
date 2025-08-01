#!/usr/bin/env node

/**
 * Simple webhook testing script
 * Tests if the webhook endpoints are accessible and responding correctly
 */

import axios from 'axios';

// Test webhook URLs (replace with your actual URLs)
const webhookUrls = {
  assignment: process.env.VITE_ASSIGNMENT_WEBHOOK_URL || 'https://httpbin.org/post',
  changes: process.env.VITE_CHANGES_WEBHOOK_URL || 'https://httpbin.org/post',
  worker: process.env.VITE_WORKER_WEBHOOK_URL || 'https://httpbin.org/post'
};

// Test payloads
const testPayloads = {
  assignment: {
    formType: 'assignment',
    timestamp: new Date().toISOString(),
    data: {
      accessCode: 'TEST1',
      fullName: 'Test User',
      email: 'test@example.com',
      moduleName: 'Test Module',
      wordCount: 1000,
      orderDeadline: '2025-02-15',
      guidance: 'Test guidance',
      files: []
    },
    metadata: {
      userAgent: 'Test Script',
      timestamp: new Date().toISOString(),
      formVersion: '1.0.0'
    }
  },
  changes: {
    formType: 'changes',
    timestamp: new Date().toISOString(),
    data: {
      referenceCode: 'TEST2',
      email: 'test@example.com',
      orderReferenceNumber: 'ORD-TEST-001',
      notes: 'Test change request',
      deadlineChanges: '2025-02-20',
      files: []
    },
    metadata: {
      userAgent: 'Test Script',
      timestamp: new Date().toISOString(),
      formVersion: '1.0.0'
    }
  },
  worker: {
    formType: 'worker',
    timestamp: new Date().toISOString(),
    data: {
      referenceCode: 'TEST3',
      email: 'worker@example.com',
      orderReferenceNumber: 'ORD-TEST-001',
      notesForClient: 'Test worker submission',
      files: []
    },
    metadata: {
      userAgent: 'Test Script',
      timestamp: new Date().toISOString(),
      formVersion: '1.0.0'
    }
  }
};

async function testWebhook(name, url, payload) {
  console.log(`\n🧪 Testing ${name} webhook...`);
  console.log(`📡 URL: ${url}`);
  
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProHappyAssignments-Test/1.0.0'
      },
      timeout: 10000
    });
    
    console.log(`✅ ${name} webhook test passed`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
    
    return { success: true, status: response.status };
  } catch (error) {
    console.log(`❌ ${name} webhook test failed`);
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      console.log(`🔌 Network Error: ${error.message}`);
    } else {
      console.log(`⚠️  Error: ${error.message}`);
    }
    
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting webhook integration tests...');
  console.log('=' .repeat(50));
  
  const results = {};
  
  for (const [name, url] of Object.entries(webhookUrls)) {
    results[name] = await testWebhook(name, url, testPayloads[name]);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 Test Results Summary:');
  
  let allPassed = true;
  for (const [name, result] of Object.entries(results)) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${name.padEnd(12)}: ${status}`);
    if (!result.success) allPassed = false;
  }
  
  console.log('\n' + '=' .repeat(50));
  if (allPassed) {
    console.log('🎉 All webhook tests passed! Your integration is ready.');
  } else {
    console.log('⚠️  Some webhook tests failed. Please check your configuration.');
    console.log('\n💡 Tips:');
    console.log('  - Verify your webhook URLs are correct');
    console.log('  - Check if your n8n instance is running and accessible');
    console.log('  - Ensure CORS is configured properly on your n8n instance');
    console.log('  - Test with a simple HTTP endpoint first (like httpbin.org)');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
ProHappyAssignments Webhook Tester

Usage: node test-webhook.js [options]

Options:
  -h, --help     Show this help message

Environment Variables:
  VITE_ASSIGNMENT_WEBHOOK_URL  Assignment form webhook URL
  VITE_CHANGES_WEBHOOK_URL     Changes form webhook URL  
  VITE_WORKER_WEBHOOK_URL      Worker form webhook URL

Examples:
  # Test with environment variables
  VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n.com/webhook/assignment node test-webhook.js
  
  # Test with default httpbin.org endpoints
  node test-webhook.js
`);
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});