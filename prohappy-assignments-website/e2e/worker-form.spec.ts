import { test, expect } from '@playwright/test'
import { TestHelpers } from './helpers'

test.describe('Worker Form E2E Tests', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await helpers.mockWebhookResponse(true)
  })

  test.afterEach(async () => {
    await helpers.cleanup()
  })

  test('should complete full worker submission flow', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Switch to Worker tab
    await helpers.selectFormTab('Worker')
    
    // Should show reference code validation
    await expect(page.getByText(/order reference/i)).toBeVisible()
    
    // Enter valid reference code
    await helpers.fillAccessCode('WRK12')
    
    // Form should unlock
    await expect(page.getByLabelText(/email/i)).toBeVisible()
    await expect(page.getByLabelText(/notes for client/i)).toBeVisible()
    
    // Fill out the form
    await page.fill('input[name="email"]', 'worker@example.com')
    await page.fill('input[name="orderReferenceNumber"]', 'ORD-12345')
    await page.fill('textarea[name="notesForClient"]', 'Assignment completed as requested. Please review the attached files.')
    
    // Upload completed work files
    const completedWorkPath = await helpers.createTestFile('completed-assignment.pdf', 'Completed assignment content')
    await helpers.uploadFile('input[type="file"]', completedWorkPath)
    
    // Should show uploaded file
    await expect(page.getByText('completed-assignment.pdf')).toBeVisible()
    
    // Submit the form
    await helpers.submitForm()
    
    // Should show success message
    await helpers.waitForSuccessMessage()
    await expect(page.getByText(/work submitted successfully/i)).toBeVisible()
  })

  test('should validate worker reference code', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.selectFormTab('Worker')
    
    // Test invalid reference code
    await page.fill('input[placeholder*="code"]', 'WRONG')
    await page.click('button:has-text("Validate")')
    await expect(page.getByText(/invalid.*code/i)).toBeVisible()
    
    // Test valid reference code
    await page.fill('input[placeholder*="code"]', 'WRK12')
    await page.click('button:has-text("Validate")')
    await expect(page.getByLabelText(/email/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.selectFormTab('Worker')
    await helpers.fillAccessCode('WRK12')
    
    // Try to submit without required fields
    await helpers.submitForm()
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/notes.*required/i)).toBeVisible()
  })

  test('should handle multiple file uploads for completed work', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.selectFormTab('Worker')
    await helpers.fillAccessCode('WRK12')
    
    // Create multiple work files
    const file1Path = await helpers.createTestFile('main-document.pdf', 'Main document')
    const file2Path = await helpers.createTestFile('appendix.pdf', 'Appendix')
    const file3Path = await helpers.createTestFile('references.pdf', 'References')
    
    // Upload multiple files
    await page.setInputFiles('input[type="file"]', [file1Path, file2Path, file3Path])
    
    // Should show all files
    await expect(page.getByText('main-document.pdf')).toBeVisible()
    await expect(page.getByText('appendix.pdf')).toBeVisible()
    await expect(page.getByText('references.pdf')).toBeVisible()
    
    // Should show file count
    await expect(page.getByText(/selected files \(3\)/i)).toBeVisible()
  })

  test('should handle mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await helpers.navigateToForms()
    await helpers.selectFormTab('Worker')
    
    // Check mobile layout
    await helpers.checkMobileResponsiveness()
    
    // Form should be functional on mobile
    await helpers.fillAccessCode('WRK12')
    await expect(page.getByLabelText(/email/i)).toBeVisible()
  })
})