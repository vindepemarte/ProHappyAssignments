import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load heavy components with delay for non-critical ones
const FileUploadComponent = lazy(() => import('./FileUpload'));
const SuccessModalComponent = lazy(() => import('./SuccessModal'));
const TermsModalComponent = lazy(() => 
  // Delay loading of terms modal since it's not immediately needed
  new Promise(resolve => {
    setTimeout(() => resolve(import('./TermsModal')), 100);
  })
);
const PrivacyModalComponent = lazy(() => 
  // Delay loading of privacy modal since it's not immediately needed
  new Promise(resolve => {
    setTimeout(() => resolve(import('./PrivacyModal')), 100);
  })
);

// Wrapper components with loading fallbacks
export const LazyFileUpload: React.FC<React.ComponentProps<typeof FileUploadComponent>> = (props) => (
  <Suspense fallback={
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <LoadingSpinner size="sm" color="primary" className="mb-2" />
      <p className="text-sm text-gray-600">Loading file upload...</p>
    </div>
  }>
    <FileUploadComponent {...props} />
  </Suspense>
);

export const LazySuccessModal: React.FC<React.ComponentProps<typeof SuccessModalComponent>> = (props) => (
  <Suspense fallback={null}>
    <SuccessModalComponent {...props} />
  </Suspense>
);

export const LazyTermsModal: React.FC<React.ComponentProps<typeof TermsModalComponent>> = (props) => (
  <Suspense fallback={null}>
    <TermsModalComponent {...props} />
  </Suspense>
);

export const LazyPrivacyModal: React.FC<React.ComponentProps<typeof PrivacyModalComponent>> = (props) => (
  <Suspense fallback={null}>
    <PrivacyModalComponent {...props} />
  </Suspense>
);