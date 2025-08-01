import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { AssignmentForm } from './AssignmentForm'
import { submitAssignmentForm } from '../services'
import { mockWebhookResponses } from '@/test/utils'

// Mock the webhook service
vi.mock('../services', () => ({
  submitAssignmentForm: vi.fn(),
}))

const mockSubmitAssignmentForm = vi.mocked(submitAssignmentForm)

describe('AssignmentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders access code validation section initially', () => {
    render(<AssignmentForm />)
    
    expect(screen.getByText('Access Code Verification')).toBeInTheDocument()
    expect(screen.getByLabelText(/access code/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /validate code/i })).toBeInTheDocument()
  })

  it('shows error for invalid access code length', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, '123')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Access code must be exactly 5 characters')).toBeInTheDocument()
    })
  })

  it('shows error for invalid access code', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'WRONG')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid access code/)).toBeInTheDocument()
    })
  })

  it('unlocks form with valid access code', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/module name/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during code validation', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    // Should show loading state briefly
    expect(screen.getByText(/validating/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText(/validating/i)).not.toBeInTheDocument()
    })
  })

  it('validates required form fields', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    // First unlock the form
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit assignment/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/module name is required/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    mockSubmitAssignmentForm.mockResolvedValueOnce(mockWebhookResponses.success)
    
    render(<AssignmentForm />)
    
    // Unlock form
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
    
    // Fill form fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/module name/i), 'Computer Science 101')
    await user.type(screen.getByLabelText(/word count/i), '1500')
    
    const dateInput = screen.getByLabelText(/order deadline/i)
    await user.type(dateInput, '2025-02-15')
    
    // Accept terms and data processing
    const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
    const dataCheckbox = screen.getByLabelText(/data processing/i)
    
    await user.click(termsCheckbox)
    await user.click(dataCheckbox)
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit assignment/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSubmitAssignmentForm).toHaveBeenCalledWith(
        expect.objectContaining({
          accessCode: 'ABC12',
          fullName: 'John Doe',
          email: 'john@example.com',
          moduleName: 'Computer Science 101',
          wordCount: 1500,
        })
      )
    })
    
    // Should show success modal
    await waitFor(() => {
      expect(screen.getByText(/assignment submitted successfully/i)).toBeInTheDocument()
    })
  })

  it('handles submission errors', async () => {
    const user = userEvent.setup()
    mockSubmitAssignmentForm.mockResolvedValueOnce(mockWebhookResponses.error)
    
    render(<AssignmentForm />)
    
    // Unlock and fill form
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
    
    // Fill minimum required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/module name/i), 'Computer Science 101')
    await user.type(screen.getByLabelText(/word count/i), '1500')
    
    const dateInput = screen.getByLabelText(/order deadline/i)
    await user.type(dateInput, '2025-02-15')
    
    const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
    const dataCheckbox = screen.getByLabelText(/data processing/i)
    
    await user.click(termsCheckbox)
    await user.click(dataCheckbox)
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit assignment/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to submit form/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    // Create a promise that we can control
    let resolveSubmission: (value: any) => void
    const submissionPromise = new Promise(resolve => {
      resolveSubmission = resolve
    })
    mockSubmitAssignmentForm.mockReturnValueOnce(submissionPromise)
    
    render(<AssignmentForm />)
    
    // Unlock and fill form
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
    
    // Fill minimum required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/module name/i), 'Computer Science 101')
    await user.type(screen.getByLabelText(/word count/i), '1500')
    
    const dateInput = screen.getByLabelText(/order deadline/i)
    await user.type(dateInput, '2025-02-15')
    
    const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
    const dataCheckbox = screen.getByLabelText(/data processing/i)
    
    await user.click(termsCheckbox)
    await user.click(dataCheckbox)
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit assignment/i })
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Resolve the promise
    resolveSubmission!(mockWebhookResponses.success)
    
    await waitFor(() => {
      expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument()
    })
  })

  it('handles network errors with retry option', async () => {
    const user = userEvent.setup()
    mockSubmitAssignmentForm.mockRejectedValueOnce(mockWebhookResponses.networkError)
    
    render(<AssignmentForm />)
    
    // Unlock and fill form (abbreviated for brevity)
    const codeInput = screen.getByLabelText(/access code/i)
    const validateButton = screen.getByRole('button', { name: /validate code/i })
    
    await user.type(codeInput, 'ABC12')
    await user.click(validateButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
    
    // Fill minimum required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/module name/i), 'Computer Science 101')
    await user.type(screen.getByLabelText(/word count/i), '1500')
    
    const dateInput = screen.getByLabelText(/order deadline/i)
    await user.type(dateInput, '2025-02-15')
    
    const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
    const dataCheckbox = screen.getByLabelText(/data processing/i)
    
    await user.click(termsCheckbox)
    await user.click(dataCheckbox)
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit assignment/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })

  it('prevents submission without code validation', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    // Try to submit without validating code (this shouldn't be possible in UI)
    // But we can test the logic by directly calling submit
    const form = screen.getByRole('form') // Assuming form has role="form"
    
    // This test would need to be adjusted based on actual component structure
    expect(screen.queryByRole('button', { name: /submit assignment/i })).not.toBeInTheDocument()
  })
})