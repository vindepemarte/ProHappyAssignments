import React, { ReactElement } from 'react'
import { render, RenderOptions, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AppProvider } from '../contexts/AppContext'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockFile = (
  name: string = 'test.pdf',
  size: number = 1024,
  type: string = 'application/pdf'
): File => {
  const file = new File(['test content'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export const createMockFormData = () => ({
  assignment: {
    accessCode: '12345',
    fullName: 'John Doe',
    email: 'john@example.com',
    moduleName: 'Computer Science 101',
    wordCount: 1500,
    orderDeadline: '2025-02-15',
    guidance: 'Please focus on algorithms',
    assignmentFiles: [createMockFile()]
  },
  changes: {
    referenceCode: 'ABC12',
    email: 'john@example.com',
    orderReferenceNumber: 'ORD123',
    notes: 'Need to change deadline',
    deadlineChanges: '2025-02-20',
    uploadFiles: [createMockFile()]
  },
  worker: {
    referenceCode: 'WRK12',
    email: 'worker@example.com',
    orderReferenceNumber: 'ORD123',
    notesForClient: 'Assignment completed',
    uploadSection: [createMockFile('completed-work.pdf')]
  }
})

// Mock webhook responses
export const mockWebhookResponses = {
  success: {
    success: true,
    message: 'Form submitted successfully',
    orderId: 'ORD123'
  },
  error: {
    success: false,
    message: 'Failed to submit form'
  },
  networkError: new Error('Network Error')
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Helper to simulate user interactions
export const userInteractions = {
  fillForm: async (user: any, formData: any) => {
    for (const [field, value] of Object.entries(formData)) {
      const input = screen.getByLabelText(new RegExp(field, 'i'))
      if (input.type === 'file') {
        await user.upload(input, value)
      } else {
        await user.type(input, String(value))
      }
    }
  },
  
  selectTab: async (user: any, tabName: string) => {
    const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') })
    await user.click(tab)
  },
  
  submitForm: async (user: any) => {
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
  }
}