import { test, expect } from '@playwright/test'
import { TestHelpers } from './helpers'

test.describe('Assignment Form E2E Tests', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await helpers.mockWebhookResponse(true)
  })

  test.afterEach(async () => {
    await helpers.cleanup()
  })

  test('should complete full assignment submission flow', async ({ page }) => {
    // Navigate to forms page
    await helpers.navigateToForms()
    
    // Should default to assignments tab
    await expect(page.getByRole('tab', { name: /assignments/i })).toHaveAttribute('aria-selected', 'true')
    
    // Should show access code validation section
    await expect(page.getByText('Access Code Verification')).toBeVisible()
    
    // Enter valid access code
    await helpers.fillAccessCode('ABC12')
    
    // Form should unlock
    await expect(page.getByLabelText(/full name/i)).toBeVisible()
    await expect(page.getByLabelText(/email/i)).toBeVisible()
    await expect(page.getByLabelText(/module name/i)).toBeVisible()
    
    // Fill out the form
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@university.edu')
    await page.fill('input[name="moduleName"]', 'Computer Science 101')
    await page.fill('input[name="wordCount"]', '1500')
    await page.fill('input[name="orderDeadline"]', '2025-02-15')
    await page.fill('textarea[name="guidance"]', 'Please focus on algorithms and data structures')
    
    // Upload a test file
    const testFilePath = await helpers.createTestFile('assignment.pdf', 'Test assignment content')
    await helpers.uploadFile('input[type="file"]', testFilePath)
    
    // Should show uploaded file
    await expect(page.getByText('assignment.pdf')).toBeVisible()
    
    // Accept terms and data processing consent
    await page.check('input[name="termsAcceptance"]')
    await page.check('input[name="dataProcessingConsent"]')
    
    // Submit the form
    await helpers.submitForm()
    
    // Should show success message
    await helpers.waitForSuccessMessage()
    await expect(page.getByText(/assignment submitted successfully/i)).toBeVisible()
    await expect(page.getByText(/you will receive an email/i)).toBeVisible()
  })

  test('should validate access code correctly', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Test empty code
    await page.click('button:has-text("Validate Code")')
    await expect(page.getByText(/access code must be exactly 5 characters/i)).toBeVisible()
    
    // Test short code
    await page.fill('input[placeholder*="code"]', '123')
    await page.click('button:has-text("Validate Code")')
    await expect(page.getByText(/access code must be exactly 5 characters/i)).toBeVisible()
    
    // Test invalid code
    await page.fill('input[placeholder*="code"]', 'WRONG')
    await page.click('button:has-text("Validate Code")')
    await expect(page.getByText(/invalid access code/i)).toBeVisible()
    
    // Test valid code
    await page.fill('input[placeholder*="code"]', 'ABC12')
    await page.click('button:has-text("Validate Code")')
    await expect(page.getByLabelText(/full name/i)).toBeVisible()
  })

  test('should validate required form fields', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Try to submit without filling required fields
    await helpers.submitForm()
    
    // Should show validation errors
    await expect(page.getByText(/full name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/module name is required/i)).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Fill invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="fullName"]', 'John Doe') // Fill another field to trigger validation
    
    // Should show email validation error
    await expect(page.getByText(/valid email is required/i)).toBeVisible()
  })

  test('should handle file upload validation', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Create an oversized file (mock)
    const largeFilePath = await helpers.createTestFile('large.pdf', 'x'.repeat(15 * 1024 * 1024)) // 15MB
    
    // Try to upload oversized file
    await helpers.uploadFile('input[type="file"]', largeFilePath)
    
    // Should show file size error
    await expect(page.getByText(/file size exceeds.*limit/i)).toBeVisible()
  })

  test('should handle submission errors gracefully', async ({ page }) => {
    // Mock webhook failure
    await helpers.mockWebhookResponse(false)
    
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Fill minimum required fields
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="moduleName"]', 'CS 101')
    await page.fill('input[name="wordCount"]', '1000')
    await page.fill('input[name="orderDeadline"]', '2025-02-15')
    
    await page.check('input[name="termsAcceptance"]')
    await page.check('input[name="dataProcessingConsent"]')
    
    await helpers.submitForm()
    
    // Should show error message
    await expect(page.getByText(/server error/i)).toBeVisible()
    
    // Should show retry button
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
  })

  test('should show loading states during submission', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Fill form
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="moduleName"]', 'CS 101')
    await page.fill('input[name="wordCount"]', '1000')
    await page.fill('input[name="orderDeadline"]', '2025-02-15')
    
    await page.check('input[name="termsAcceptance"]')
    await page.check('input[name="dataProcessingConsent"]')
    
    // Start submission
    const submitButton = page.getByRole('button', { name: /submit assignment/i })
    await submitButton.click()
    
    // Should show loading state
    await expect(page.getByText(/submitting/i)).toBeVisible()
    await expect(submitButton).toBeDisabled()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await helpers.navigateToForms()
    
    // Check mobile-specific elements
    await helpers.checkMobileResponsiveness()
    
    // Form should still be functional
    await helpers.fillAccessCode('ABC12')
    await expect(page.getByLabelText(/full name/i)).toBeVisible()
    
    // Mobile form fields should be touch-friendly
    const nameInput = page.getByLabelText(/full name/i)
    const boundingBox = await nameInput.boundingBox()
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44) // Minimum touch target size
  })

  test('should meet accessibility standards', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Run accessibility checks
    await helpers.checkAccessibility()
    
    // Test keyboard navigation
    await helpers.testKeyboardNavigation()
    
    // Check form labels and ARIA attributes
    await helpers.fillAccessCode('ABC12')
    
    const formFields = await page.locator('input, textarea, select').all()
    for (const field of formFields) {
      const id = await field.getAttribute('id')
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      }
    }
  })

  test('should handle multiple file uploads', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Create multiple test files
    const file1Path = await helpers.createTestFile('document1.pdf', 'Content 1')
    const file2Path = await helpers.createTestFile('document2.pdf', 'Content 2')
    
    // Upload multiple files
    await page.setInputFiles('input[type="file"]', [file1Path, file2Path])
    
    // Should show both files
    await expect(page.getByText('document1.pdf')).toBeVisible()
    await expect(page.getByText('document2.pdf')).toBeVisible()
    
    // Should show file count
    await expect(page.getByText(/selected files \(2\)/i)).toBeVisible()
  })

  test('should allow file removal', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Upload a file
    const testFilePath = await helpers.createTestFile('test.pdf', 'Test content')
    await helpers.uploadFile('input[type="file"]', testFilePath)
    
    // Should show uploaded file
    await expect(page.getByText('test.pdf')).toBeVisible()
    
    // Remove the file
    await page.click('button[aria-label*="Remove test.pdf"]')
    
    // File should be removed
    await expect(page.getByText('test.pdf')).not.toBeVisible()
    await expect(page.getByText(/selected files/i)).not.toBeVisible()
  })

  test('should preserve form data during validation', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('ABC12')
    
    // Fill some form data
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="moduleName"]', 'CS 101')
    
    // Try to submit with missing required fields
    await helpers.submitForm()
    
    // Form data should be preserved
    await expect(page.getByDisplayValue('John Doe')).toBeVisible()
    await expect(page.getByDisplayValue('john@example.com')).toBeVisible()
    await expect(page.getByDisplayValue('CS 101')).toBeVisible()
  })
})