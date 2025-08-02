import React, { useState } from 'react';
import { useFormValidation } from '../hooks';
import { workerSchema } from '../utils/validation';
import { FormField, LazyFileUpload as FileUpload, LazySuccessModal as SuccessModal, DataCollectionNotice, FormErrorSummary, LoadingSpinner } from './';
import { submitWorkerForm } from '../services';
import type { WorkerFormData } from '../types';

// Accept any 5-character reference code (validation happens in n8n workflow)

export const WorkerForm: React.FC = () => {
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
  } = useFormValidation(workerSchema, {
    referenceCode: '',
    email: '',
    orderReferenceNumber: '',
    notesForClient: '',
    uploadSection: [],
    dataProcessingConsent: false,
    termsAcceptance: false,
  });

  const watchedFiles = watch('uploadSection') || [];
  const referenceCode = watch('referenceCode');

  // Validate reference code
  const validateReferenceCode = async () => {
    const code = getValues('referenceCode');
    
    if (!code || code.length !== 5) {
      setCodeError('Reference code must be exactly 5 characters');
      return;
    }

    setIsValidatingCode(true);
    setCodeError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Accept any 5-character code (validation happens in n8n workflow)
    setIsCodeValidated(true);
    setCodeError('');
    // Auto-populate order reference number with the validated code
    setValue('orderReferenceNumber', code.toUpperCase(), { shouldValidate: true });

    setIsValidatingCode(false);
  };

  const onSubmit = async (data: WorkerFormData) => {
    if (!isCodeValidated) {
      setCodeError('Please validate your reference code first');
      return;
    }

    setSubmissionError('');
    setIsNetworkError(false);

    try {
      const result = await submitWorkerForm(data);
      
      if (result.success) {
        setSubmissionResult({
          title: 'Work Submitted Successfully!',
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
    setValue('uploadSection', files, { shouldValidate: true });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSubmissionResult(null);
    // Reset form after successful submission
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="card-colorful p-6 border-l-4 border-accent-purple shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-purple to-primary rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <p className="text-accent-navy font-semibold">
            Enter your 5-character order reference code to submit your work 👨‍💼
          </p>
        </div>
      </div>

      {/* Reference Code Validation Section */}
      <div className="card p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-purple to-primary rounded-full flex items-center justify-center">
            🔍
          </div>
          <h3 className="text-2xl font-bold text-accent-navy">Order Reference Verification</h3>
        </div>
        
        <div className="space-y-4">
          <FormField
            label="Order Reference Code"
            name="referenceCode"
            type="text"
            placeholder="Enter 5-character code"
            error={errors.referenceCode}
            required
          >
            <div className="flex items-center gap-2">
              <input
                {...register('referenceCode')}
                type="text"
                placeholder="Enter 5-character code"
                maxLength={5}
                inputMode="text"
                autoComplete="off"
                className={`form-input uppercase text-center font-mono tracking-widest text-xl font-bold flex-1 ${
                  errors.referenceCode || codeError
                    ? 'border-error focus:border-error focus:ring-error/20 bg-error/5'
                    : isCodeValidated
                    ? 'border-success focus:border-success focus:ring-success/20 bg-success/5'
                    : ''
                }`}
                disabled={isCodeValidated}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('referenceCode').onChange(e);
                  if (isCodeValidated) {
                    setIsCodeValidated(false);
                  }
                  if (codeError) {
                    setCodeError('');
                  }
                }}
              />
              <button
                type="button"
                onClick={validateReferenceCode}
                disabled={!referenceCode || referenceCode.length !== 5 || isValidatingCode || isCodeValidated}
                className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                title={isCodeValidated ? "Verified" : "Validate Code"}
              >
                {isValidatingCode ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : isCodeValidated ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          </FormField>
          
          {codeError && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error font-medium flex items-center">
                ❌ {codeError}
              </p>
            </div>
          )}
          
          {isCodeValidated && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-success font-medium flex items-center">
                ✅ Reference code verified successfully! 🎉
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Worker Form - Only shown when code is validated */}
      {isCodeValidated && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card-colorful p-6 border-l-4 border-success shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <p className="text-accent-navy font-semibold">
                Great! Now fill out the worker submission details below 📋
              </p>
            </div>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📧 Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email}
              required
            >
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email address"
                inputMode="email"
                autoComplete="email"
                className="form-input"
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="📋 Order Reference Number"
              name="orderReferenceNumber"
              type="text"
              error={errors.orderReferenceNumber}
              required
            >
              <input
                {...register('orderReferenceNumber')}
                type="text"
                className="form-input bg-gray-50"
                readOnly
              />
              <p className="mt-2 text-sm text-accent-navy/70">
                This field is automatically populated with your validated reference code ✨
              </p>
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FormField
              label="💬 Notes for Client"
              name="notesForClient"
              type="textarea"
              placeholder="Enter notes or messages for the client"
              error={errors.notesForClient}
              required
            >
              <textarea
                {...register('notesForClient')}
                placeholder="Enter notes or messages for the client"
                maxLength={1000}
                className="form-input min-h-[120px] resize-vertical"
                rows={4}
              />
            </FormField>
          </div>

          <div className="card p-6 shadow-lg">
            <FileUpload
              label="📎 Upload Completed Work"
              name="uploadSection"
              files={watchedFiles}
              onChange={handleFileChange}
              error={errors.uploadSection}
              multiple={true}
              maxFiles={10}
              maxSizeInMB={100}
              required={true}
              showProgress={true}
              enableCamera={true}
              mobileOptimized={true}
              description="Upload your completed assignment files and any supporting documents ✨"
            />
          </div>

          {/* Data Collection Notice */}
          <DataCollectionNotice formType="worker" className="mb-6" />

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
                    This includes storing and using my information to deliver completed work to clients.
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

          {/* Submission Error Display */}
          {submissionError && (
            isNetworkError ? (
              <NetworkErrorHandler
                error={submissionError}
                onRetry={handleRetry}
                retryCount={retryCount}
                maxRetries={3}
                className="mb-4"
              />
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-red-800 font-medium">Submission Failed</p>
                    <p className="text-sm text-red-700 mt-1">{submissionError}</p>
                  </div>
                </div>
              </div>
            )
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
                  <span className="animate-pulse">🚀 Submitting Work...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">📤</span>
                  Submit Completed Work
                  <span className="ml-2">✨</span>
                </span>
              )}
            </button>
            <p className="mt-3 text-sm text-accent-navy/70">
              Your work will be delivered securely to the client 🔒
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
            Please enter and validate your 5-character order reference code to unlock the worker form.
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

export default WorkerForm;