import { test, expect } from '@playwright/test'
import { TestHelpers } from './helpers'

test.describe('Changes Form E2E Tests', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await helpers.mockWebhookResponse(true)
  })

  test.afterEach(async () => {
    await helpers.cleanup()
  })

  test('should complete full changes request flow', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Switch to Changes tab
    await helpers.selectFormTab('Request Changes')
    
    // Should show reference code validation
    await expect(page.getByText(/reference code/i)).toBeVisible()
    
    // Enter valid reference code
    await helpers.fillAccessCode('CHG12')
    
    // Form should unlock
    await expect(page.getByLabelText(/email/i)).toBeVisible()
    await expect(page.getByLabelText(/order reference/i)).toBeVisible()
    await expect(page.getByLabelText(/notes/i)).toBeVisible()
    
    // Fill out the form
    await page.fill('input[name="email"]', 'client@example.com')
    await page.fill('input[name="orderReferenceNumber"]', 'ORD-12345')
    await page.fill('textarea[name="notes"]', 'Please extend the deadline by 3 days')
    await page.fill('input[name="deadlineChanges"]', '2025-02-18')
    
    // Upload additional files
    const testFilePath = await helpers.createTestFile('additional-requirements.pdf', 'Additional requirements')
    await helpers.uploadFile('input[type="file"]', testFilePath)
    
    // Should show uploaded file
    await expect(page.getByText('additional-requirements.pdf')).toBeVisible()
    
    // Submit the form
    await helpers.submitForm()
    
    // Should show success message
    await helpers.waitForSuccessMessage()
    await expect(page.getByText(/change request submitted successfully/i)).toBeVisible()
  })

  test('should validate reference code', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.selectFormTab('Request Changes')
    
    // Test invalid reference code
    await page.fill('input[placeholder*="code"]', 'WRONG')
    await page.click('button:has-text("Validate")')
    await expect(page.getByText(/invalid.*code/i)).toBeVisible()
    
    // Test valid reference code
    await page.fill('input[placeholder*="code"]', 'CHG12')
    await page.click('button:has-text("Validate")')
    await expect(page.getByLabelText(/email/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.selectFormTab('Request Changes')
    await helpers.fillAccessCode('CHG12')
    
    // Try to submit without required fields
    await helpers.submitForm()
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/notes.*required/i)).toBeVisible()
  })

  test('should handle mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await helpers.navigateToForms()
    await helpers.selectFormTab('Request Changes')
    
    // Check mobile layout
    await helpers.checkMobileResponsiveness()
    
    // Form should be functional on mobile
    await helpers.fillAccessCode('CHG12')
    await expect(page.getByLabelText(/email/i)).toBeVisible()
  })
})