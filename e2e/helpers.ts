import { Page, expect } from '@playwright/test'

export class TestHelpers {
  constructor(private page: Page) {}

  async navigateToForms() {
    await this.page.goto('/')
    await this.page.click('text=Start Your Project')
    await expect(this.page).toHaveURL('/forms')
  }

  async selectFormTab(tabName: 'Assignments' | 'Request Changes' | 'Worker') {
    await this.page.click(`[role="tab"]:has-text("${tabName}")`)
    await this.page.waitForTimeout(500) // Wait for tab transition
  }

  async fillAccessCode(code: string) {
    await this.page.fill('input[placeholder*="code" i]', code)
    await this.page.press('input[placeholder*="code" i]', 'Enter')
    await this.page.waitForTimeout(1000) // Wait for form unlock
  }

  async uploadFile(selector: string, filePath: string) {
    const fileInput = this.page.locator(selector)
    await fileInput.setInputFiles(filePath)
  }

  async createTestFile(fileName: string = 'test.pdf', content: string = 'Test file content'): Promise<string> {
    // Create a temporary file for testing
    const fs = require('fs')
    const path = require('path')
    const tempDir = path.join(process.cwd(), 'temp')
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, content)
    return filePath
  }

  async checkFormValidation(fieldSelector: string, expectedError: string) {
    await this.page.click('button[type="submit"]')
    const errorElement = this.page.locator(`text="${expectedError}"`).first()
    await expect(errorElement).toBeVisible()
  }

  async submitForm() {
    await this.page.click('button[type="submit"]')
  }

  async waitForSuccessMessage() {
    await expect(this.page.locator('text=success')).toBeVisible({ timeout: 10000 })
  }

  async checkMobileResponsiveness() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.page.waitForTimeout(500)
    
    // Check if mobile navigation is working
    const mobileMenu = this.page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
    }
  }

  async checkAccessibility() {
    // Basic accessibility checks
    await expect(this.page.locator('h1')).toBeVisible()
    
    // Check for proper heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all()
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for alt text on images
    const images = await this.page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
    
    // Check for form labels
    const inputs = await this.page.locator('input, textarea, select').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        const label = this.page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      }
    }
  }

  async testKeyboardNavigation() {
    // Test tab navigation
    await this.page.keyboard.press('Tab')
    const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName)
    expect(['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT']).toContain(focusedElement)
  }

  async mockWebhookResponse(success: boolean = true) {
    await this.page.route('**/webhook/**', route => {
      route.fulfill({
        status: success ? 200 : 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success,
          message: success ? 'Form submitted successfully' : 'Server error',
          orderId: success ? 'ORD123' : undefined
        })
      })
    })
  }

  async cleanup() {
    // Clean up temporary files
    const fs = require('fs')
    const path = require('path')
    const tempDir = path.join(process.cwd(), 'temp')
    
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  }
}