import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.mock('../config/env', () => ({
  env: {
    VITE_ASSIGNMENT_WEBHOOK_URL: 'http://localhost:3001/webhook/assignment',
    VITE_CHANGES_WEBHOOK_URL: 'http://localhost:3001/webhook/changes',
    VITE_WORKER_WEBHOOK_URL: 'http://localhost:3001/webhook/worker',
    VITE_FILE_UPLOAD_MAX_SIZE: '10485760', // 10MB
    VITE_ENVIRONMENT: 'test',
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock File and FileList for file upload tests
global.File = class MockFile {
  name: string
  size: number
  type: string
  lastModified: number

  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    this.name = name
    this.size = bits.reduce((acc, bit) => acc + (typeof bit === 'string' ? bit.length : bit.size || 0), 0)
    this.type = options?.type || ''
    this.lastModified = options?.lastModified || Date.now()
  }
} as any

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()