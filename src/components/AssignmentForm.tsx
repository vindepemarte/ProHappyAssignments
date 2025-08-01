import React, { useState } from 'react';
import { useFormValidation } from '../hooks';
import { assignmentSchema } from '../utils/validation';
import { FormField, LazyFileUpload as FileUpload, LazySuccessModal as SuccessModal, DataCollectionNotice, NetworkErrorHandler, FormErrorSummary, LoadingSpinner } from './';
import { submitAssignmentForm } from '../services';
import type { AssignmentFormData } from '../types';

// Mock access codes for validation (in real app, this would be API call)
const VALID_ACCESS_CODES = ['ABC12', 'XYZ34', 'DEF56', 'GHI78', 'JKL90'];

export const AssignmentForm: React.FC = () => {
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [codeError, setCodeError] = useState<string>('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    title: string;
    message: string;
    orderId?: string;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useFormValidation(assignmentSchema, {
    accessCode: '',
    fullName: '',
    email: '',
    moduleName: '',
    wordCount: 0,
    orderDeadline: '',
    assignmentFiles: [],
    guidance: '',
    dataProcessingConsent: false,
    termsAcceptance: false,
  });

  const watchedFiles = watch('assignmentFiles') || [];
  const accessCode = watch('accessCode');

  // Validate access code
  const validateAccessCode = async () => {
    const code = getValues('accessCode');
    
    if (!code || code.length !== 5) {
      setCodeError('Access code must be exactly 5 characters');
      return;
    }

    setIsValidatingCode(true);
    setCodeError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (VALID_ACCESS_CODES.includes(code.toUpperCase())) {
      setIsCodeValidated(true);
      setCodeError('');
    } else {
      setCodeError('Invalid access code. Please check your code and try again.');
      setIsCodeValidated(false);
    }

    setIsValidatingCode(false);
  };

  const onSubmit = async (data: AssignmentFormData) => {
    if (!isCodeValidated) {
      setCodeError('Please validate your access code first');
      return;
    }

    setSubmissionError('');
    setIsNetworkError(false);

    try {
      const result = await submitAssignmentForm(data);
      
      if (result.success) {
        setSubmissionResult({
          title: 'Assignment Submitted Successfully!',
          message: result.message,
          orderId: result.orderId,
        });
        setShowSuccessModal(true);
        setRetryCount(0); // Reset retry count on success
      } else {
        setSubmissionError(result.message);
        // Check if it's a network-related error
        const isNetworkIssue = result.message.toLowerCase().includes('network') || 
                              result.message.toLowerCase().includes('connection') ||
                              result.message.toLowerCase().includes('timeout');
        setIsNetworkError(isNetworkIssue);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
      setIsNetworkError(true);
    }
  };

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    const formData = getValues();
    await onSubmit(formData);
  };

  const handleFileChange = (files: File[]) => {
    setValue('assignmentFiles', files, { shouldValidate: true });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSubmissionResult(null);
    // Reset form after successful submission
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="card-colorful p-6 border-l-4 border-accent-yellow shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-yellow to-accent-red rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <p className="text-accent-navy font-semibold">
            Enter your 5-character access code to unlock the assignment form ✨
          </p>
        </div>
      </div>

      {/* Access Code Validation Section */}
      <div className="card p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            🔐
          </div>
          <h3 className="text-2xl font-bold text-accent-navy">Access Code Verification</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              label="Access Code"
              name="accessCode"
              type="text"
              placeholder="Enter 5-character code"
              error={errors.accessCode}
              required
            >
              <input
                {...register('accessCode')}
                type="text"
                placeholder="Enter 5-character code"
                maxLength={5}
                inputMode="text"
                autoComplete="off"
                className={`form-input uppercase text-center font-mono tracking-widest text-xl font-bold ${
                  errors.accessCode || codeError
                    ? 'border-error focus:border-error focus:ring-error/20 bg-error/5'
                    : isCodeValidated
                    ? 'border-success focus:border-success focus:ring-success/20 bg-success/5'
                    : ''
                }`}
                disabled={isCodeValidated}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('accessCode').onChange(e);
                  if (isCodeValidated) {
                    setIsCodeValidated(false);
                  }
                  if (codeError) {
                    setCodeError('');
                  }
                }}
              />
            </FormField>
            
            {codeError && (
              <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error font-medium flex items-center">
                  ❌ {codeError}
                </p>
              </div>
            )}
            
            {isCodeValidated && (
              <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-success font-medium flex items-center">
                  ✅ Access code verified successfully! 🎉
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={validateAccessCode}
              disabled={!accessCode || accessCode.length !== 5 || isValidatingCode || isCodeValidated}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
            >
              {isValidatingCode ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  <span className="animate-pulse">Validating...</span>
                </span>
              ) : isCodeValidated ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Validate Code
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Form - Only shown when code is validated */}
      {isCodeValidated && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card-colorful p-6 border-l-4 border-success shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <p className="text-accent-navy font-semibold">
                Great! Now fill out the assignment details below 📝
              </p>
            </div>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="👤 Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              error={errors.fullName}
              required
              autoComplete="name"
              maxLength={100}
            >
              <input
                {...register('fullName')}
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📧 Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email}
              required
              autoComplete="email"
              inputMode="email"
            >
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                inputMode="email"
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📚 Module Name"
              name="moduleName"
              type="text"
              placeholder="Enter module name (e.g., CS101, MATH201)"
              error={errors.moduleName}
              required
              maxLength={50}
            >
              <input
                {...register('moduleName')}
                type="text"
                placeholder="Enter module name (e.g., CS101, MATH201)"
                maxLength={50}
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📊 Word Count"
              name="wordCount"
              type="number"
              placeholder="Enter word count"
              error={errors.wordCount}
              required
              inputMode="numeric"
              min={1}
              max={50000}
              step={1}
            >
              <input
                {...register('wordCount', { valueAsNumber: true })}
                type="number"
                placeholder="Enter word count"
                inputMode="numeric"
                min="1"
                max="50000"
                step="1"
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📅 Order Deadline"
              name="orderDeadline"
              type="date"
              error={errors.orderDeadline}
              required
              min={new Date().toISOString().split('T')[0]}
            >
              <input
                {...register('orderDeadline')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FileUpload
              label="📎 Assignment Files"
              name="assignmentFiles"
              files={watchedFiles}
              onChange={handleFileChange}
              error={errors.assignmentFiles}
              multiple={true}
              maxFiles={5}
              maxSizeInMB={10}
              showProgress={true}
              enableCamera={true}
              mobileOptimized={true}
              description="Upload your assignment files, documents, or reference materials ✨"
            />
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="💡 Additional Guidance"
              name="guidance"
              type="textarea"
              placeholder="Enter any additional guidance or requirements for your assignment"
              error={errors.guidance}
              maxLength={1000}
            >
              <textarea
                {...register('guidance')}
                placeholder="Enter any additional guidance or requirements for your assignment"
                maxLength={1000}
                className="form-input min-h-[120px] resize-vertical"
                rows={4}
              />
            </FormField>
          </div>

          {/* Data Collection Notice */}
          <DataCollectionNotice formType="assignment" className="mb-6" />

          {/* Consent Checkboxes */}
          <div className="card p-8 shadow-lg border-l-4 border-accent-purple">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-purple to-primary rounded-full flex items-center justify-center">
                ✅
              </div>
              <h4 className="text-xl font-bold text-accent-navy">Required Consents</h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-accent-purple/10 to-primary/10 rounded-xl border border-accent-purple/20">
                <input
                  {...register('dataProcessingConsent')}
                  type="checkbox"
                  id="dataProcessingConsent"
                  className="mt-1 h-6 w-6 text-primary focus:ring-primary/30 border-gray-300 rounded-lg cursor-pointer transform scale-110"
                />
                <div className="flex-1">
                  <label htmlFor="dataProcessingConsent" className="text-sm text-accent-navy cursor-pointer leading-relaxed font-medium">
                    🔒 I consent to the processing of my personal data as described in the data collection notice above. 
                    This includes storing and using my information to provide the requested assignment services.
                    <span className="text-error ml-1">*</span>
                  </label>
                  {errors.dataProcessingConsent && (
                    <p className="mt-2 text-sm text-error font-medium">{errors.dataProcessingConsent.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-accent-purple/10 to-primary/10 rounded-xl border border-accent-purple/20">
                <input
                  {...register('termsAcceptance')}
                  type="checkbox"
                  id="termsAcceptance"
                  className="mt-1 h-6 w-6 text-primary focus:ring-primary/30 border-gray-300 rounded-lg cursor-pointer transform scale-110"
                />
                <div className="flex-1">
                  <label htmlFor="termsAcceptance" className="text-sm text-accent-navy cursor-pointer leading-relaxed font-medium">
                    📋 I have read and agree to the Terms and Conditions and Privacy Policy.
                    <span className="text-error ml-1">*</span>
                  </label>
                  {errors.termsAcceptance && (
                    <p className="mt-2 text-sm text-error font-medium">{errors.termsAcceptance.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Validation Error Summary */}
          {Object.keys(errors).length > 0 && (
            <FormErrorSummary 
              errors={errors} 
              className="mb-4"
              title="Please fix the following errors before submitting:"
            />
          )}

          {/* Submission Error Display - Improved UX */}
          {submissionError && (
            <div className="card bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">⚠️</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-orange-800 mb-1">
                    Submission Issue
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    {submissionError}
                  </p>
                  {isNetworkError && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleRetry}
                        disabled={retryCount >= 3}
                        className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
                      >
                        {retryCount >= 3 ? 'Max retries reached' : `Try Again (${retryCount + 1}/3)`}
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        Refresh Page
                      </button>
                    </div>
                  )}
                  {!isNetworkError && (
                    <button
                      onClick={() => setSubmissionError('')}
                      className="text-sm text-orange-600 hover:text-orange-800 underline"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="btn-primary w-full py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" className="mr-3" />
                  <span className="animate-pulse">🚀 Submitting Assignment...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🎯</span>
                  Submit Assignment
                  <span className="ml-2">✨</span>
                </span>
              )}
            </button>
            <p className="mt-3 text-sm text-accent-navy/70">
              Your assignment will be processed securely and professionally 🔒
            </p>
          </div>
        </form>
      )}

      {/* Locked Form Message */}
      {!isCodeValidated && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Locked</h3>
          <p className="text-gray-600">
            Please enter and validate your 5-character access code to unlock the assignment form.
          </p>
        </div>
      )}

      {/* Success Modal */}
      {submissionResult && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title={submissionResult.title}
          message={submissionResult.message}
          orderId={submissionResult.orderId}
        />
      )}
    </div>
  );
};

export default AssignmentForm;