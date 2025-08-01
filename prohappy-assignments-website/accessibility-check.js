#!/usr/bin/env node

/**
 * Basic accessibility check for the built application
 * This script performs basic accessibility validation
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');

function checkAccessibility() {
  console.log('🔍 Running basic accessibility checks...');
  console.log('=' .repeat(50));
  
  try {
    // Read the built HTML file
    const htmlContent = readFileSync(join(distPath, 'index.html'), 'utf-8');
    
    const checks = [
      {
        name: 'HTML lang attribute',
        test: () => htmlContent.includes('lang='),
        description: 'HTML should have a lang attribute for screen readers'
      },
      {
        name: 'Meta viewport',
        test: () => htmlContent.includes('name="viewport"'),
        description: 'Page should have viewport meta tag for mobile accessibility'
      },
      {
        name: 'Title tag',
        test: () => htmlContent.includes('<title>') && !htmlContent.includes('<title></title>'),
        description: 'Page should have a descriptive title'
      },
      {
        name: 'Meta description',
        test: () => htmlContent.includes('name="description"'),
        description: 'Page should have a meta description'
      }
    ];
    
    let passed = 0;
    let total = checks.length;
    
    checks.forEach(check => {
      const result = check.test();
      const status = result ? '✅ PASS' : '❌ FAIL';
      console.log(`${check.name.padEnd(20)}: ${status}`);
      if (!result) {
        console.log(`   💡 ${check.description}`);
      }
      if (result) passed++;
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log(`📊 Accessibility Score: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
    
    if (passed === total) {
      console.log('🎉 Basic accessibility checks passed!');
    } else {
      console.log('⚠️  Some accessibility issues found. Please review and fix.');
    }
    
    console.log('\n💡 Additional recommendations:');
    console.log('  - Run a full accessibility audit with tools like axe-core');
    console.log('  - Test with screen readers');
    console.log('  - Verify keyboard navigation works');
    console.log('  - Check color contrast ratios');
    console.log('  - Test with users who have disabilities');
    
    return passed === total;
    
  } catch (error) {
    console.error('❌ Error reading built files:', error.message);
    console.log('💡 Make sure you have run "npm run build" first');
    return false;
  }
}

// Run the check
const success = checkAccessibility();
process.exit(success ? 0 : 1);