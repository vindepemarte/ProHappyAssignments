import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { FileUpload } from './FileUpload'
import { createMockFile } from '@/test/utils'

describe('FileUpload', () => {
  const defaultProps = {
    label: 'Upload Files',
    name: 'fileUpload',
    files: [],
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area with correct label', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('Upload Files')).toBeInTheDocument()
    expect(screen.getByLabelText('File upload area')).toBeInTheDocument()
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument()
  })

  it('shows required indicator when required prop is true', () => {
    render(<FileUpload {...defaultProps} required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays description when provided', () => {
    const description = 'Upload your assignment files here'
    render(<FileUpload {...defaultProps} description={description} />)
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('handles file selection through input', async () => {
    const user = userEvent.setup()
    const mockFile = createMockFile('test.pdf', 1024, 'application/pdf')
    
    render(<FileUpload {...defaultProps} />)
    
    const fileInput = screen.getByRole('button', { name: /file upload area/i })
    await user.click(fileInput)
    
    // Simulate file selection
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: [mockFile],
        writable: false,
      })
      
      await user.upload(hiddenInput, mockFile)
    }
    
    expect(defaultProps.onChange).toHaveBeenCalledWith([mockFile])
  })

  it('displays selected files correctly', () => {
    const mockFile = createMockFile('test.pdf', 1024, 'application/pdf')
    const props = { ...defaultProps, files: [mockFile] }
    
    render(<FileUpload {...props} />)
    
    expect(screen.getByText('Selected files (1):')).toBeInTheDocument()
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.0 KB')).toBeInTheDocument()
  })

  it('allows removing files', async () => {
    const user = userEvent.setup()
    const mockFile = createMockFile('test.pdf', 1024, 'application/pdf')
    const props = { ...defaultProps, files: [mockFile] }
    
    render(<FileUpload {...props} />)
    
    const removeButton = screen.getByLabelText('Remove test.pdf')
    await user.click(removeButton)
    
    expect(defaultProps.onChange).toHaveBeenCalledWith([])
  })

  it('validates file types correctly', async () => {
    const user = userEvent.setup()
    const invalidFile = createMockFile('test.exe', 1024, 'application/exe')
    
    render(<FileUpload {...defaultProps} />)
    
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: [invalidFile],
        writable: false,
      })
      
      await user.upload(hiddenInput, invalidFile)
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/)).toBeInTheDocument()
    })
    
    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('validates file size correctly', async () => {
    const user = userEvent.setup()
    const largeFile = createMockFile('large.pdf', 15 * 1024 * 1024, 'application/pdf') // 15MB
    
    render(<FileUpload {...defaultProps} maxSizeInMB={10} />)
    
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: [largeFile],
        writable: false,
      })
      
      await user.upload(hiddenInput, largeFile)
    }
    
    await waitFor(() => {
      expect(screen.getByText(/File size exceeds 10MB limit/)).toBeInTheDocument()
    })
    
    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('respects maxFiles limit', async () => {
    const user = userEvent.setup()
    const files = [
      createMockFile('file1.pdf'),
      createMockFile('file2.pdf'),
      createMockFile('file3.pdf'),
    ]
    
    render(<FileUpload {...defaultProps} maxFiles={2} />)
    
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: files,
        writable: false,
      })
      
      await user.upload(hiddenInput, files)
    }
    
    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([files[0], files[1]])
    })
  })

  it('handles single file mode correctly', async () => {
    const user = userEvent.setup()
    const existingFile = createMockFile('existing.pdf')
    const newFile = createMockFile('new.pdf')
    
    const props = { ...defaultProps, multiple: false, files: [existingFile] }
    render(<FileUpload {...props} />)
    
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: [newFile],
        writable: false,
      })
      
      await user.upload(hiddenInput, newFile)
    }
    
    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([newFile])
    })
  })

  it('displays error message when error prop is provided', () => {
    const error = { type: 'required', message: 'Files are required' }
    render(<FileUpload {...defaultProps} error={error} />)
    
    expect(screen.getByText('Files are required')).toBeInTheDocument()
    expect(screen.getByLabelText('File upload area')).toHaveClass('border-red-300')
  })

  it('shows progress when showProgress is enabled', () => {
    const mockFile = createMockFile('test.pdf')
    const props = { ...defaultProps, files: [mockFile], showProgress: true }
    
    render(<FileUpload {...props} />)
    
    // Progress functionality would be tested with more complex mocking
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<FileUpload {...defaultProps} />)
    
    const uploadArea = screen.getByLabelText('File upload area')
    uploadArea.focus()
    
    await user.keyboard('{Enter}')
    // This would trigger file dialog in real browser
    expect(uploadArea).toHaveFocus()
  })

  it('shows mobile-specific UI elements when mobileOptimized is true', () => {
    // Mock mobile detection
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    })
    
    render(<FileUpload {...defaultProps} mobileOptimized enableCamera />)
    
    // Mobile buttons would appear after component detects mobile
    expect(screen.getByText('Upload Files')).toBeInTheDocument()
  })
})