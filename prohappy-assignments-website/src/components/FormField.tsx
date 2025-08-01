import React from 'react';
import type { FieldError } from 'react-hook-form';
import { getInputClasses, getLabelClasses, getErrorMessage } from '../utils/formHelpers';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'tel' | 'url' | 'search';
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search';
  autoComplete?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required = false,
  children,
  className = '',
  inputMode,
  autoComplete,
  maxLength,
  min,
  max,
  step,
}) => {
  // Determine appropriate inputMode based on type if not explicitly provided
  const getInputMode = (): string | undefined => {
    if (inputMode) return inputMode;
    
    switch (type) {
      case 'email':
        return 'email';
      case 'number':
        return 'numeric';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      case 'search':
        return 'search';
      default:
        return 'text';
    }
  };

  // Determine appropriate autoComplete based on name and type
  const getAutoComplete = (): string | undefined => {
    if (autoComplete) return autoComplete;
    
    const nameMap: Record<string, string> = {
      'fullName': 'name',
      'firstName': 'given-name',
      'lastName': 'family-name',
      'email': 'email',
      'phone': 'tel',
      'tel': 'tel',
      'address': 'street-address',
      'city': 'address-level2',
      'state': 'address-level1',
      'zip': 'postal-code',
      'country': 'country',
      'organization': 'organization',
      'jobTitle': 'organization-title',
    };
    
    return nameMap[name] || 'off';
  };
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-error ml-1" aria-label="required">*</span>}
      </label>
      
      {children || (
        <>
          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              placeholder={placeholder}
              className="form-input min-h-[120px] resize-vertical"
              rows={4}
              autoComplete={getAutoComplete()}
              maxLength={maxLength}
            />
          ) : (
            <input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              className="form-input"
              inputMode={getInputMode()}
              autoComplete={getAutoComplete()}
              maxLength={maxLength}
              min={min}
              max={max}
              step={step}
            />
          )}
        </>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="form-error flex items-start" role="alert">
            <span className="mr-2">❌</span>
            {getErrorMessage(error)}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormField;