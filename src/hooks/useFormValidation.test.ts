import { renderHook, act } from '@/test/utils'
import { z } from 'zod'
import { useFormValidation } from './useFormValidation'

describe('useFormValidation', () => {
  const testSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
  })

  it('initializes with default values', () => {
    const defaultValues = { name: 'John', email: 'john@example.com', age: 25 }
    
    const { result } = renderHook(() => 
      useFormValidation(testSchema, defaultValues)
    )

    expect(result.current.getValues()).toEqual(defaultValues)
  })

  it('validates form fields correctly', async () => {
    const { result } = renderHook(() => useFormValidation(testSchema))

    // Test invalid data
    await act(async () => {
      result.current.setValue('name', 'A') // Too short
      result.current.setValue('email', 'invalid-email') // Invalid format
      result.current.setValue('age', 16) // Too young
    })

    await act(async () => {
      await result.current.trigger()
    })

    const errors = result.current.formState.errors

    expect(errors.name?.message).toBe('Name must be at least 2 characters')
    expect(errors.email?.message).toBe('Invalid email format')
    expect(errors.age?.message).toBe('Must be at least 18 years old')
  })

  it('passes validation with valid data', async () => {
    const { result } = renderHook(() => useFormValidation(testSchema))

    await act(async () => {
      result.current.setValue('name', 'John Doe')
      result.current.setValue('email', 'john@example.com')
      result.current.setValue('age', 25)
    })

    await act(async () => {
      await result.current.trigger()
    })

    expect(result.current.formState.isValid).toBe(true)
    expect(Object.keys(result.current.formState.errors)).toHaveLength(0)
  })

  it('enables real-time validation', () => {
    const { result } = renderHook(() => useFormValidation(testSchema))

    // Check that validation mode is set correctly
    expect(result.current.formState.mode).toBe('onChange')
  })

  it('handles form submission', async () => {
    const { result } = renderHook(() => useFormValidation(testSchema))
    const mockSubmit = vi.fn()

    await act(async () => {
      result.current.setValue('name', 'John Doe')
      result.current.setValue('email', 'john@example.com')
      result.current.setValue('age', 25)
    })

    await act(async () => {
      await result.current.handleSubmit(mockSubmit)()
    })

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    })
  })

  it('prevents submission with invalid data', async () => {
    const { result } = renderHook(() => useFormValidation(testSchema))
    const mockSubmit = vi.fn()

    await act(async () => {
      result.current.setValue('name', 'A') // Invalid
      result.current.setValue('email', 'invalid') // Invalid
      result.current.setValue('age', 16) // Invalid
    })

    await act(async () => {
      await result.current.handleSubmit(mockSubmit)()
    })

    expect(mockSubmit).not.toHaveBeenCalled()
    expect(result.current.formState.isValid).toBe(false)
  })

  it('works with complex schemas', () => {
    const complexSchema = z.object({
      user: z.object({
        profile: z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
        }),
        preferences: z.array(z.string()),
      }),
      settings: z.record(z.boolean()),
    })

    const { result } = renderHook(() => useFormValidation(complexSchema))

    expect(result.current).toBeDefined()
    expect(typeof result.current.setValue).toBe('function')
    expect(typeof result.current.getValues).toBe('function')
  })

  it('handles optional fields correctly', () => {
    const schemaWithOptional = z.object({
      required: z.string().min(1, 'Required field'),
      optional: z.string().optional(),
    })

    const { result } = renderHook(() => 
      useFormValidation(schemaWithOptional, { required: 'test' })
    )

    expect(result.current.getValues()).toEqual({
      required: 'test',
      optional: undefined,
    })
  })
})