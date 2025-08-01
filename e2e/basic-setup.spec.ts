import { test, expect } from '@playwright/test'

test.describe('Basic E2E Setup', () => {
  test('should verify Playwright is working', async ({ page }) => {
    // Create a simple HTML page for testing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ProHappyAssignments Test</title>
        </head>
        <body>
          <h1>ProHappyAssignments</h1>
          <button id="start-project">Start Your Project</button>
          <div id="forms" style="display: none;">
            <div role="tab" aria-selected="true">Assignments</div>
            <div role="tab" aria-selected="false">Request Changes</div>
            <div role="tab" aria-selected="false">Worker</div>
          </div>
          <script>
            document.getElementById('start-project').addEventListener('click', function() {
              document.getElementById('forms').style.display = 'block';
            });
          </script>
        </body>
      </html>
    `
    
    // Navigate to data URL with HTML content
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`)
    
    // Test basic functionality
    await expect(page).toHaveTitle(/ProHappyAssignments/)
    await expect(page.getByText('ProHappyAssignments')).toBeVisible()
    
    // Test button interaction
    await page.click('#start-project')
    await expect(page.getByRole('tab', { name: 'Assignments' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Request Changes' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Worker' })).toBeVisible()
  })

  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mobile Test</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            button { min-height: 44px; padding: 10px 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Mobile Test</h1>
          <button id="mobile-button">Touch Target</button>
        </body>
      </html>
    `
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`)
    
    // Check mobile-friendly elements
    const button = page.locator('#mobile-button')
    const boundingBox = await button.boundingBox()
    
    // Button should meet minimum touch target size
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })

  test('should support keyboard navigation', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Keyboard Test</title>
        </head>
        <body>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
          <input id="input1" placeholder="Input field" />
        </body>
      </html>
    `
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`)
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('#btn1')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('#btn2')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('#input1')).toBeFocused()
  })

  test('should handle form validation', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Form Test</title>
        </head>
        <body>
          <form id="test-form">
            <label for="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <button type="submit">Submit</button>
            <div id="error-message" style="display: none; color: red;"></div>
          </form>
          <script>
            document.getElementById('test-form').addEventListener('submit', function(e) {
              e.preventDefault();
              const email = document.getElementById('email').value;
              const errorDiv = document.getElementById('error-message');
              
              if (!email) {
                errorDiv.textContent = 'Email is required';
                errorDiv.style.display = 'block';
              } else if (!email.includes('@')) {
                errorDiv.textContent = 'Valid email is required';
                errorDiv.style.display = 'block';
              } else {
                errorDiv.style.display = 'none';
                alert('Form submitted successfully!');
              }
            });
          </script>
        </body>
      </html>
    `
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`)
    
    // Test form validation
    await page.click('button[type="submit"]')
    await expect(page.getByText('Email is required')).toBeVisible()
    
    // Test invalid email
    await page.fill('#email', 'invalid-email')
    await page.click('button[type="submit"]')
    await expect(page.getByText('Valid email is required')).toBeVisible()
    
    // Test valid email
    await page.fill('#email', 'test@example.com')
    
    // Handle the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Form submitted successfully!')
      await dialog.accept()
    })
    
    await page.click('button[type="submit"]')
  })

  test('should handle accessibility features', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accessibility Test</title>
        </head>
        <body>
          <h1>Main Heading</h1>
          <h2>Sub Heading</h2>
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwNzNlNiIvPjwvc3ZnPg==" alt="Blue square" />
          <label for="test-input">Test Input:</label>
          <input id="test-input" name="test" />
          <button aria-label="Close dialog">×</button>
        </body>
      </html>
    `
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`)
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h2')).toBeVisible()
    
    // Check alt text
    const img = page.locator('img')
    await expect(img).toHaveAttribute('alt', 'Blue square')
    
    // Check form labels
    const input = page.locator('#test-input')
    const label = page.locator('label[for="test-input"]')
    await expect(label).toBeVisible()
    
    // Check ARIA labels
    const button = page.locator('button[aria-label="Close dialog"]')
    await expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })
})