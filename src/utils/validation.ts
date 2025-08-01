import { z } from 'zod';

// Assignment Form Schema
export const assignmentSchema = z.object({
  accessCode: z
    .string()
    .length(5, 'Access code must be exactly 5 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Access code must contain only letters and numbers'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  moduleName: z
    .string()
    .min(2, 'Module name must be at least 2 characters')
    .max(200, 'Module name must be less than 200 characters'),
  wordCount: z
    .number({
      required_error: 'Word count is required',
      invalid_type_error: 'Word count must be a number',
    })
    .min(1, 'Word count must be at least 1')
    .max(50000, 'Word count must be less than 50,000'),
  orderDeadline: z
    .string()
    .min(1, 'Order deadline is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Order deadline must be today or in the future'),
  assignmentFiles: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 10 * 1024 * 1024); // 10MB limit
    }, 'Each file must be less than 10MB')
    .refine((files) => {
      if (!files) return true;
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
      ];
      return files.every((file) => allowedTypes.includes(file.type));
    }, 'Only PDF, Word, text, and image files are allowed'),
  guidance: z
    .string()
    .max(1000, 'Guidance must be less than 1000 characters')
    .optional(),
  dataProcessingConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing to submit this form'),
  termsAcceptance: z
    .boolean()
    .refine((val) => val === true, 'You must accept the Terms and Conditions to proceed'),
});

// Changes Form Schema
export const changesSchema = z.object({
  referenceCode: z
    .string()
    .length(5, 'Reference code must be exactly 5 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Reference code must contain only letters and numbers'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  orderReferenceNumber: z
    .string()
    .min(1, 'Order reference number is required')
    .max(50, 'Order reference number must be less than 50 characters'),
  notes: z
    .string()
    .min(1, 'Notes are required')
    .max(1000, 'Notes must be less than 1000 characters'),
  deadlineChanges: z
    .string()
    .max(500, 'Deadline changes must be less than 500 characters')
    .optional(),
  uploadFiles: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 10 * 1024 * 1024); // 10MB limit
    }, 'Each file must be less than 10MB')
    .refine((files) => {
      if (!files) return true;
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
      ];
      return files.every((file) => allowedTypes.includes(file.type));
    }, 'Only PDF, Word, text, and image files are allowed'),
  dataProcessingConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing to submit this form'),
  termsAcceptance: z
    .boolean()
    .refine((val) => val === true, 'You must accept the Terms and Conditions to proceed'),
});

// Worker Form Schema
export const workerSchema = z.object({
  referenceCode: z
    .string()
    .length(5, 'Reference code must be exactly 5 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Reference code must contain only letters and numbers'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  orderReferenceNumber: z
    .string()
    .min(1, 'Order reference number is required')
    .max(50, 'Order reference number must be less than 50 characters'),
  notesForClient: z
    .string()
    .min(1, 'Notes for client are required')
    .max(1000, 'Notes for client must be less than 1000 characters'),
  uploadSection: z
    .array(z.instanceof(File))
    .min(1, 'At least one file must be uploaded')
    .refine((files) => {
      return files.every((file) => file.size <= 10 * 1024 * 1024); // 10MB limit
    }, 'Each file must be less than 10MB')
    .refine((files) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
      ];
      return files.every((file) => allowedTypes.includes(file.type));
    }, 'Only PDF, Word, text, and image files are allowed'),
  dataProcessingConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing to submit this form'),
  termsAcceptance: z
    .boolean()
    .refine((val) => val === true, 'You must accept the Terms and Conditions to proceed'),
});

// Export types for TypeScript
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
export type ChangesFormData = z.infer<typeof changesSchema>;
export type WorkerFormData = z.infer<typeof workerSchema>;