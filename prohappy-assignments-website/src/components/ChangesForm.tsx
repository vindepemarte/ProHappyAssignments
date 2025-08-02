import React, { useState } from 'react';
import { useFormValidation } from '../hooks';
import { changesSchema } from '../utils/validation';
import { FormField, LazyFileUpload as FileUpload, LazySuccessModal as SuccessModal, DataCollectionNotice, NetworkErrorHandler, FormErrorSummary, LoadingSpinner } from './';
import { submitChangesForm } from '../services';
import type { ChangesFormData } from '../types';

// Mock reference codes for validation (in real app, this would be API call)
const VALID_REFERENCE_CODES = ['REF12', 'CHG34', 'ORD56', 'REQ78', 'MOD90'];

export const ChangesForm: React.FC = () => {
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
  } = useFormValidation(changesSchema, {
    referenceCode: '',
    email: '',
    orderReferenceNumber: '',
    notes: '',
    deadlineChanges: '',
    uploadFiles: [],
    dataProcessingConsent: false,
    termsAcceptance: false,
  });

  const watchedFiles = watch('uploadFiles') || [];
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

    if (VALID_REFERENCE_CODES.includes(code.toUpperCase())) {
      setIsCodeValidated(true);
      setCodeError('');
      // Auto-populate order reference number when code is validated
      setValue('orderReferenceNumber', code.toUpperCase(), { shouldValidate: true });
    } else {
      setCodeError('Invalid reference code. Please check your code and try again.');
      setIsCodeValidated(false);
    }

    setIsValidatingCode(false);
  };

  const onSubmit = async (data: ChangesFormData) => {
    if (!isCodeValidated) {
      setCodeError('Please validate your reference code first');
      return;
    }

    setSubmissionError('');
    setIsNetworkError(false);

    try {
      const result = await submitChangesForm(data);

      if (result.success) {
        setSubmissionResult({
          title: 'Change Request Submitted Successfully!',
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
    setValue('uploadFiles', files, { shouldValidate: true });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSubmissionResult(null);
    // Reset form after successful submission
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="card-colorful p-6 border-l-4 border-accent-red shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-red to-accent-yellow rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <p className="text-accent-navy font-semibold">
            Enter your 5-character order reference code to request changes 🔄
          </p>
        </div>
      </div>

      {/* Reference Code Validation Section */}
      <div className="card p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-red to-accent-yellow rounded-full flex items-center justify-center">
            🔍
          </div>
          <h3 className="text-2xl font-bold text-accent-navy">Order Reference Verification</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              label="Order Reference Code"
              name="referenceCode"
              type="text"
              placeholder="Enter 5-character reference code"
              error={errors.referenceCode}
              required
            >
              <input
                {...register('referenceCode')}
                type="text"
                placeholder="Enter 5-character reference code"
                maxLength={5}
                inputMode="text"
                autoComplete="off"
                className={`form-input uppercase text-center font-mono tracking-widest text-xl font-bold ${errors.referenceCode || codeError
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
            </FormField>

            {codeError && (
              <p className="mt-1 text-sm text-red-600">{codeError}</p>
            )}

            {isCodeValidated && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Reference code verified successfully
              </p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={validateReferenceCode}
              disabled={!referenceCode || referenceCode.length !== 5 || isValidatingCode || isCodeValidated}
              className="px-6 py-3 bg-[#1d0fdb] text-white rounded-lg hover:bg-[#2f3b65] focus:outline-none focus:ring-2 focus:ring-[#1d0fdb] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-base font-medium active:bg-[#3a2a5c] whitespace-nowrap"
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
      {/* Changes Form - Only shown when code is validated */}
      {isCodeValidated && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Step 2:</strong> Fill out the change request details below.
            </p>
          </div>

          <FormField
            label="Email Address"
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
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[44px] text-base ${errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb] bg-white hover:border-gray-400'
                }`}
            />
          </FormField>

          <FormField
            label="Order Reference Number"
            name="orderReferenceNumber"
            type="text"
            placeholder="Order reference number"
            error={errors.orderReferenceNumber}
            required
          >
            <input
              {...register('orderReferenceNumber')}
              type="text"
              placeholder="Order reference number"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 bg-gray-50 min-h-[44px] text-base ${errors.orderReferenceNumber
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
                }`}
              readOnly
            />
            <p className="mt-1 text-sm text-gray-600">
              This field is automatically populated based on your verified reference code.
            </p>
          </FormField>

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            placeholder="Describe the changes you need for your order"
            error={errors.notes}
            required
          >
            <textarea
              {...register('notes')}
              placeholder="Describe the changes you need for your order"
              maxLength={1000}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[120px] resize-vertical text-base ${errors.notes
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb] bg-white hover:border-gray-400'
                }`}
              rows={5}
            />
          </FormField>

          <FormField
            label="Deadline Changes"
            name="deadlineChanges"
            type="textarea"
            placeholder="Specify any deadline changes needed (optional)"
            error={errors.deadlineChanges}
          >
            <textarea
              {...register('deadlineChanges')}
              placeholder="Specify any deadline changes needed (optional)"
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[80px] resize-vertical text-base ${errors.deadlineChanges
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb] bg-white hover:border-gray-400'
                }`}
              rows={3}
            />
          </FormField>

          <FileUpload
            label="Upload Additional Files"
            name="uploadFiles"
            files={watchedFiles}
            onChange={handleFileChange}
            error={errors.uploadFiles}
            multiple={true}
            maxFiles={5}
            maxSizeInMB={10}
            showProgress={true}
            enableCamera={true}
            mobileOptimized={true}
            description="Upload any additional files related to your change request (optional)"
          />

          {/* Data Collection Notice */}
          <DataCollectionNotice formType="changes" className="mb-6" />

          {/* Consent Checkboxes */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Consents</h4>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  {...register('dataProcessingConsent')}
                  type="checkbox"
                  id="dataProcessingConsent"
                  className="mt-1 h-5 w-5 text-[#1d0fdb] focus:ring-[#1d0fdb] border-gray-300 rounded cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="dataProcessingConsent" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                    I consent to the processing of my personal data as described in the data collection notice above.
                    This includes storing and using my information to process the requested changes.
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {errors.dataProcessingConsent && (
                    <p className="mt-1 text-sm text-red-600">{errors.dataProcessingConsent.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  {...register('termsAcceptance')}
                  type="checkbox"
                  id="termsAcceptance"
                  className="mt-1 h-5 w-5 text-[#1d0fdb] focus:ring-[#1d0fdb] border-gray-300 rounded cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="termsAcceptance" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                    I have read and agree to the Terms and Conditions and Privacy Policy.
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {errors.termsAcceptance && (
                    <p className="mt-1 text-sm text-red-600">{errors.termsAcceptance.message}</p>
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

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="w-full bg-[#1d0fdb] text-white py-4 px-6 rounded-lg hover:bg-[#2f3b65] focus:outline-none focus:ring-2 focus:ring-[#1d0fdb] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base font-semibold active:bg-[#3a2a5c] relative"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" color="white" className="mr-3" />
                <span className="animate-pulse">Submitting Change Request...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Submit Change Request
              </span>
            )}
          </button>
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
            Please enter and validate your 5-character order reference code to unlock the change request form.
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

export default ChangesForm;