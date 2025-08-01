import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { FormField } from './FormField'

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Field',
    name: 'testField',
    type: 'text' as const,
    register: vi.fn(),
    error: undefined,
  }

  it('renders label and input correctly', () => {
    render(<FormField {...defaultProps} />)
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'This field is required'
    render(<FormField {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  it('renders different input types correctly', () => {
    const { rerender } = render(<FormField {...defaultProps} type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<FormField {...defaultProps} type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')

    rerender(<FormField {...defaultProps} type="date" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'date')
  })

  it('renders textarea when type is textarea', () => {
    render(<FormField {...defaultProps} type="textarea" />)
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('applies required styling when required prop is true', () => {
    render(<FormField {...defaultProps} required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    const placeholder = 'Enter your text here'
    render(<FormField {...defaultProps} placeholder={placeholder} />)
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  })

  it('handles user input correctly', async () => {
    const user = userEvent.setup()
    render(<FormField {...defaultProps} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test input')
    
    expect(input).toHaveValue('test input')
  })

  it('applies disabled state correctly', () => {
    render(<FormField {...defaultProps} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})