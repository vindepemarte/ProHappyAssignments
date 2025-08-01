import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { submitAssignmentForm, submitChangesForm, submitWorkerForm } from './webhookService'
import { createMockFormData } from '@/test/utils'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock webhook config
vi.mock('./webhookConfig', () => ({
  webhookConfig: {
    getAssignmentWebhookUrl: () => 'http://localhost:3001/webhook/assignment',
    getChangesWebhookUrl: () => 'http://localhost:3001/webhook/changes',
    getWorkerWebhookUrl: () => 'http://localhost:3001/webhook/worker',
    getTimeout: () => 10000,
    getMaxRetries: () => 2,
    getRetryDelay: () => 1000,
    getEnvironment: () => 'test',
    shouldLogRequests: () => false,
    createN8nPayload: (formType: string, data: any) => ({
      formType,
      timestamp: new Date().toISOString(),
      data,
      metadata: {
        userAgent: 'test',
        environment: 'test',
      },
    }),
  },
}))

describe('WebhookService', () => {
  const mockFormData = createMockFormData()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'group').mockImplementation(() => {})
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('submitAssignmentForm', () => {
    it('successfully submits assignment form', async () => {
      const mockResponse = {
        status: 200,
        data: { orderId: 'ASG-123' },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/webhook/assignment',
        expect.objectContaining({
          formType: 'assignment',
          data: expect.objectContaining({
            fullName: 'John Doe',
            email: 'john@example.com',
            moduleName: 'Computer Science 101',
          }),
        }),
        expect.objectContaining({
          timeout: 10000,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )

      expect(result).toEqual({
        success: true,
        message: 'Assignment submitted successfully! You will receive an email with updates.',
        orderId: 'ASG-123',
      })
    })

    it('handles network errors with retry', async () => {
      const networkError = new Error('Network Error')
      networkError.name = 'AxiosError'
      ;(networkError as any).code = 'ECONNABORTED'
      ;(networkError as any).request = {}

      mockedAxios.post.mockRejectedValue(networkError)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledTimes(3) // Initial + 2 retries
      expect(result).toEqual({
        success: false,
        message: 'Request timed out after multiple attempts. Please try again later.',
      })
    })

    it('handles server errors', async () => {
      const serverError = new Error('Server Error')
      serverError.name = 'AxiosError'
      ;(serverError as any).response = {
        status: 500,
        data: { message: 'Internal server error' },
      }

      mockedAxios.post.mockRejectedValue(serverError)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(result).toEqual({
        success: false,
        message: 'Server error occurred after multiple attempts. Please try again later.',
      })
    })

    it('handles client errors without retry', async () => {
      const clientError = new Error('Bad Request')
      clientError.name = 'AxiosError'
      ;(clientError as any).response = {
        status: 400,
        data: { message: 'Invalid data' },
      }

      mockedAxios.post.mockRejectedValue(clientError)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledTimes(1) // No retries for 4xx errors
      expect(result).toEqual({
        success: false,
        message: 'Submission failed: Invalid data',
      })
    })

    it('serializes files correctly', async () => {
      const mockResponse = { status: 200, data: {} }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await submitAssignmentForm(mockFormData.assignment)

      const callArgs = mockedAxios.post.mock.calls[0]
      const payload = callArgs[1]

      expect(payload.data.files).toEqual([
        expect.objectContaining({
          name: expect.any(String),
          size: expect.any(Number),
          type: expect.any(String),
          lastModified: expect.any(Number),
        }),
      ])
    })
  })

  describe('submitChangesForm', () => {
    it('successfully submits changes form', async () => {
      const mockResponse = {
        status: 200,
        data: { orderId: 'CHG-123' },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await submitChangesForm(mockFormData.changes)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/webhook/changes',
        expect.objectContaining({
          formType: 'changes',
          data: expect.objectContaining({
            email: 'john@example.com',
            referenceCode: 'ABC12',
            notes: 'Need to change deadline',
          }),
        }),
        expect.any(Object)
      )

      expect(result).toEqual({
        success: true,
        message: 'Change request submitted successfully! You will receive an email with updates.',
        orderId: 'CHG-123',
      })
    })

    it('handles errors correctly', async () => {
      const error = new Error('Network Error')
      error.name = 'AxiosError'
      ;(error as any).request = {}

      mockedAxios.post.mockRejectedValue(error)

      const result = await submitChangesForm(mockFormData.changes)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Network error')
    })
  })

  describe('submitWorkerForm', () => {
    it('successfully submits worker form', async () => {
      const mockResponse = {
        status: 200,
        data: { orderId: 'WRK-123' },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await submitWorkerForm(mockFormData.worker)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/webhook/worker',
        expect.objectContaining({
          formType: 'worker',
          data: expect.objectContaining({
            email: 'worker@example.com',
            referenceCode: 'WRK12',
            notesForClient: 'Assignment completed',
          }),
        }),
        expect.any(Object)
      )

      expect(result).toEqual({
        success: true,
        message: 'Work submitted successfully! You will receive an email with updates.',
        orderId: 'WRK-123',
      })
    })

    it('generates fallback order ID when not provided', async () => {
      const mockResponse = {
        status: 200,
        data: {},
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await submitWorkerForm(mockFormData.worker)

      expect(result.success).toBe(true)
      expect(result.orderId).toMatch(/^WRK-\d+$/)
    })
  })

  describe('Error handling', () => {
    it('handles unexpected response status', async () => {
      const mockResponse = {
        status: 299, // Edge case status
        data: {},
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(result.success).toBe(true) // 299 is still in 2xx range
    })

    it('handles generic errors', async () => {
      const genericError = new Error('Something went wrong')
      mockedAxios.post.mockRejectedValue(genericError)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(result).toEqual({
        success: false,
        message: 'An unexpected error occurred after multiple attempts. Please try again.',
      })
    })
  })

  describe('Retry logic', () => {
    it('retries on 5xx errors', async () => {
      const serverError = new Error('Server Error')
      serverError.name = 'AxiosError'
      ;(serverError as any).response = { status: 503 }

      mockedAxios.post.mockRejectedValue(serverError)

      await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('does not retry on 4xx errors', async () => {
      const clientError = new Error('Client Error')
      clientError.name = 'AxiosError'
      ;(clientError as any).response = { status: 404 }

      mockedAxios.post.mockRejectedValue(clientError)

      await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledTimes(1) // No retries
    })

    it('eventually succeeds after retries', async () => {
      const serverError = new Error('Server Error')
      serverError.name = 'AxiosError'
      ;(serverError as any).response = { status: 503 }

      const successResponse = { status: 200, data: { orderId: 'ASG-123' } }

      mockedAxios.post
        .mockRejectedValueOnce(serverError)
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce(successResponse)

      const result = await submitAssignmentForm(mockFormData.assignment)

      expect(mockedAxios.post).toHaveBeenCalledTimes(3)
      expect(result.success).toBe(true)
    })
  })
})