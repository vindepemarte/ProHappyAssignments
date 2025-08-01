import { test, expect } from '@playwright/test'

test.describe('E2E Setup', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ProHappyAssignments/i)
  })

  test('should navigate to forms page', async ({ page }) => {
    await page.goto('/')
    
    // Look for the "Start Your Project" button
    const startButton = page.getByRole('button', { name: /start your project/i })
    await expect(startButton).toBeVisible()
    
    // Click the button
    await startButton.click()
    
    // Should navigate to forms page
    await expect(page).toHaveURL('/forms')
  })

  test('should display form tabs', async ({ page }) => {
    await page.goto('/forms')
    
    // Check that all three tabs are present
    await expect(page.getByRole('tab', { name: /assignments/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /request changes/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /worker/i })).toBeVisible()
  })
})