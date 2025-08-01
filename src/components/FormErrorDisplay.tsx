import React from 'react';
import type { FieldError, FieldErrors } from 'react-hook-form';

interface FormErrorDisplayProps {
  error?: FieldError;
  className?: string;
}

interface FormErrorSummaryProps {
  errors: FieldErrors<any>;
  className?: string;
  title?: string;
  showFieldNames?: boolean;
}

// Individual field error display
export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  error,
  className = '',
}) => {
  if (!error) return null;

  const getErrorIcon = (errorType?: string) => {
    switch (errorType) {
      case 'required':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'pattern':
      case 'validate':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'min':
      case 'max':
      case 'minLength':
      case 'maxLength':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-start space-x-2 text-red-600 text-sm mt-1 ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        {getErrorIcon(error.type)}
      </div>
      <span className="flex-1">{error.message}</span>
    </div>
  );
};

// Form error summary component
export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className = '',
  title = 'Please fix the following errors:',
  showFieldNames = true,
}) => {
  const errorEntries = Object.entries(errors).filter(([, error]) => error) as [string, FieldError][];

  if (errorEntries.length === 0) return null;

  const getFieldDisplayName = (fieldName: string): string => {
    // Convert camelCase to readable format
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            {title}
          </h3>
          
          <ul className="space-y-1 text-sm text-red-700">
            {errorEntries.map(([fieldName, error]) => (
              <li key={fieldName} className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>
                  {showFieldNames && (
                    <strong className="font-medium">
                      {getFieldDisplayName(fieldName)}:
                    </strong>
                  )}{' '}
                  {error?.message || 'Invalid input'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormErrorDisplay;