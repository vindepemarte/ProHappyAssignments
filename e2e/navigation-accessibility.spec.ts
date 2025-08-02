import { test, expect } from '@playwright/test'
import { TestHelpers } from './helpers'

test.describe('Navigation and Accessibility E2E Tests', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test.afterEach(async () => {
    await helpers.cleanup()
  })

  test('should navigate between landing page and forms', async ({ page }) => {
    // Start on landing page
    await page.goto('/')
    
    // Should show landing page content
    await expect(page.getByText(/prohappyassignments/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /start your project/i })).toBeVisible()
    
    // Navigate to forms
    await page.click('text=Start Your Project')
    await expect(page).toHaveURL('/forms')
    
    // Should show forms page with tabs
    await expect(page.getByRole('tab', { name: /assignments/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /request changes/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /worker/i })).toBeVisible()
  })

  test('should switch between form tabs correctly', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Should default to Assignments tab
    await expect(page.getByRole('tab', { name: /assignments/i })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/access code verification/i)).toBeVisible()
    
    // Switch to Request Changes tab
    await helpers.selectFormTab('Request Changes')
    await expect(page.getByRole('tab', { name: /request changes/i })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/reference code/i)).toBeVisible()
    
    // Switch to Worker tab
    await helpers.selectFormTab('Worker')
    await expect(page.getByRole('tab', { name: /worker/i })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/order reference/i)).toBeVisible()
    
    // Switch back to Assignments
    await helpers.selectFormTab('Assignments')
    await expect(page.getByRole('tab', { name: /assignments/i })).toHaveAttribute('aria-selected', 'true')
  })

  test('should meet WCAG accessibility standards', async ({ page }) => {
    await page.goto('/')
    
    // Check page structure
    await helpers.checkAccessibility()
    
    // Navigate to forms and check accessibility
    await helpers.navigateToForms()
    await helpers.checkAccessibility()
    
    // Check each form tab for accessibility
    const tabs = ['Assignments', 'Request Changes', 'Worker'] as const
    
    for (const tab of tabs) {
      await helpers.selectFormTab(tab)
      await helpers.checkAccessibility()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation on landing page
    await helpers.testKeyboardNavigation()
    
    // Navigate to forms using keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    await expect(page).toHaveURL('/forms')
    
    // Test keyboard navigation on forms page
    await helpers.testKeyboardNavigation()
    
    // Test tab switching with keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowRight') // Should move to next tab
    await page.keyboard.press('ArrowLeft')  // Should move back
  })

  test('should handle focus management correctly', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Focus should be managed when switching tabs
    await helpers.selectFormTab('Request Changes')
    
    // First focusable element should receive focus
    const firstInput = page.locator('input').first()
    await expect(firstInput).toBeFocused()
  })

  test('should display proper error states with ARIA attributes', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('IVA98')
    
    // Try to submit form without required fields
    await helpers.submitForm()
    
    // Error messages should have proper ARIA attributes
    const errorMessages = page.locator('[role="alert"]')
    await expect(errorMessages.first()).toBeVisible()
    
    // Form fields should have aria-invalid attribute
    const invalidFields = page.locator('[aria-invalid="true"]')
    expect(await invalidFields.count()).toBeGreaterThan(0)
  })

  test('should work with screen reader announcements', async ({ page }) => {
    await helpers.navigateToForms()
    
    // Check for proper ARIA labels and descriptions
    const formElements = page.locator('input, textarea, select, button')
    const elementCount = await formElements.count()
    
    for (let i = 0; i < elementCount; i++) {
      const element = formElements.nth(i)
      const ariaLabel = await element.getAttribute('aria-label')
      const ariaLabelledBy = await element.getAttribute('aria-labelledby')
      const id = await element.getAttribute('id')
      
      // Each form element should have proper labeling
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const labelExists = await label.count() > 0
        
        expect(ariaLabel || ariaLabelledBy || labelExists).toBeTruthy()
      }
    }
  })

  test('should handle mobile navigation correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Check mobile navigation
    await helpers.checkMobileResponsiveness()
    
    // Mobile-specific navigation should work
    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      // Check if mobile menu items are visible
    }
    
    // Navigate to forms on mobile
    await helpers.navigateToForms()
    
    // Form tabs should be mobile-friendly
    const tabs = page.locator('[role="tab"]')
    const tabCount = await tabs.count()
    
    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i)
      const boundingBox = await tab.boundingBox()
      
      // Tabs should have minimum touch target size
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('should handle responsive breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, height: 568, name: 'Mobile Small' },
      { width: 375, height: 667, name: 'Mobile Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop Small' },
      { width: 1440, height: 900, name: 'Desktop Large' },
    ]
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
      
      await page.goto('/')
      
      // Page should be responsive at all breakpoints
      await expect(page.getByText(/prohappyassignments/i)).toBeVisible()
      
      await helpers.navigateToForms()
      
      // Forms should be accessible at all breakpoints
      await expect(page.getByRole('tab', { name: /assignments/i })).toBeVisible()
      
      // Check that content doesn't overflow
      const body = page.locator('body')
      const boundingBox = await body.boundingBox()
      expect(boundingBox?.width).toBeLessThanOrEqual(breakpoint.width)
    }
  })

  test('should handle cookie consent and privacy modals', async ({ page }) => {
    await page.goto('/')
    
    // Should show cookie consent banner
    await expect(page.getByText(/cookie/i)).toBeVisible()
    
    // Should be able to access privacy policy
    const privacyLink = page.getByText(/privacy policy/i)
    if (await privacyLink.isVisible()) {
      await privacyLink.click()
      await expect(page.getByText(/privacy policy/i)).toBeVisible()
      
      // Close modal
      await page.keyboard.press('Escape')
    }
    
    // Should be able to access terms and conditions
    const termsLink = page.getByText(/terms.*conditions/i)
    if (await termsLink.isVisible()) {
      await termsLink.click()
      await expect(page.getByText(/terms.*conditions/i)).toBeVisible()
      
      // Close modal
      await page.keyboard.press('Escape')
    }
  })

  test('should maintain state during navigation', async ({ page }) => {
    await helpers.navigateToForms()
    await helpers.fillAccessCode('IVA98')
    
    // Fill some form data
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    
    // Switch tabs and come back
    await helpers.selectFormTab('Request Changes')
    await helpers.selectFormTab('Assignments')
    
    // Form should still be unlocked and data preserved
    await expect(page.getByLabelText(/full name/i)).toBeVisible()
    await expect(page.getByDisplayValue('John Doe')).toBeVisible()
    await expect(page.getByDisplayValue('john@example.com')).toBeVisible()
  })
})