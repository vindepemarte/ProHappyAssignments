import React, { Suspense, lazy, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Layout, LoadingSpinner } from '../components';
import { useComponentPreloader } from '../utils/componentPreloader';

// Lazy load form components for better performance
const AssignmentForm = lazy(() => import('../components/AssignmentForm'));
const ChangesForm = lazy(() => import('../components/ChangesForm'));
const WorkerForm = lazy(() => import('../components/WorkerForm'));

const FormsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { preloadFormComponent, preloadAllFormComponents } = useComponentPreloader();

  // Preload all form components when the page loads
  useEffect(() => {
    preloadAllFormComponents();
  }, [preloadAllFormComponents]);

  const handleTabChange = (formType: 'assignments' | 'changes' | 'worker') => {
    dispatch({ type: 'SET_CURRENT_FORM', payload: formType });
  };

  const handleTabHover = (formType: 'assignments' | 'changes' | 'worker') => {
    preloadFormComponent(formType);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)]">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            Submit Your Request
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
            Choose your service type and fill out the secure form
          </p>
        </div>
        
        {/* Form Tabs */}
        <div className="card bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="border-b border-gray-200">
            <nav className="flex flex-col sm:flex-row" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('assignments')}
                onMouseEnter={() => handleTabHover('assignments')}
                className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[48px] flex items-center justify-center sm:justify-start active:bg-gray-50 flex-1 sm:flex-none ${
                  state.currentForm === 'assignments'
                    ? 'border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">📝</span>
                Assignments
              </button>
              <button
                onClick={() => handleTabChange('changes')}
                onMouseEnter={() => handleTabHover('changes')}
                className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[48px] flex items-center justify-center sm:justify-start active:bg-gray-50 flex-1 sm:flex-none ${
                  state.currentForm === 'changes'
                    ? 'border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">🔄</span>
                Changes
              </button>
              <button
                onClick={() => handleTabChange('worker')}
                onMouseEnter={() => handleTabHover('worker')}
                className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[48px] flex items-center justify-center sm:justify-start active:bg-gray-50 flex-1 sm:flex-none ${
                  state.currentForm === 'worker'
                    ? 'border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">👨‍💼</span>
                Worker
              </button>
            </nav>
          </div>
          
          {/* Form Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="md" color="primary" className="mb-3" />
                  <p className="text-gray-600 text-sm">Loading form...</p>
                </div>
              </div>
            }>
              {state.currentForm === 'assignments' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Assignment Request Form
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Submit your assignment requirements securely
                    </p>
                  </div>
                  <AssignmentForm />
                </div>
              )}
              
              {state.currentForm === 'changes' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Request Changes Form
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Request modifications to your existing order
                    </p>
                  </div>
                  <ChangesForm />
                </div>
              )}
              
              {state.currentForm === 'worker' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Worker Submission Form
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Submit completed work for client review
                    </p>
                  </div>
                  <WorkerForm />
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormsPage;