import type { UseFormReturn, FieldError } from 'react-hook-form';

// Helper function to get error message from React Hook Form
export const getErrorMessage = (error: FieldError | undefined): string | undefined => {
  return error?.message;
};

// Helper function to check if a field has an error
export const hasError = (error: FieldError | undefined): boolean => {
  return !!error;
};

// Helper function to get input classes based on error state
export const getInputClasses = (
  error: FieldError | undefined,
  baseClasses: string = 'w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[44px] text-base'
): string => {
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50';
  const normalClasses = 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb] bg-white hover:border-gray-400';
  
  return `${baseClasses} ${hasError(error) ? errorClasses : normalClasses}`;
};

// Helper function to get label classes based on error state
export const getLabelClasses = (
  error: FieldError | undefined,
  baseClasses: string = 'block text-sm font-medium mb-1'
): string => {
  const errorClasses = 'text-red-700';
  const normalClasses = 'text-gray-700';
  
  return `${baseClasses} ${hasError(error) ? errorClasses : normalClasses}`;
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to validate file type
export const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
  ];
  
  return allowedTypes.includes(file.type);
};

// Helper function to validate file size
export const isValidFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Helper function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Helper function to truncate filename for display
export const truncateFilename = (filename: string, maxLength: number = 30): string => {
  if (filename.length <= maxLength) return filename;
  
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4) + '...';
  
  return `${truncatedName}.${extension}`;
};

// Helper function to reset form with default values
export const resetFormWithDefaults = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  defaultValues: Partial<T>
): void => {
  form.reset(defaultValues as T);
};

// Helper function to handle form submission errors
export const handleFormError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Helper function to debounce validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};