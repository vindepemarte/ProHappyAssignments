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
      <div className="bg-gray-50 py-8 min-h-[calc(100vh-8rem)]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1d0fdb] text-center mb-8">
            Submit Your Request
          </h1>
          
          {/* Form Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6" aria-label="Tabs">
                <button
                  onClick={() => handleTabChange('assignments')}
                  onMouseEnter={() => handleTabHover('assignments')}
                  className={`py-4 px-4 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[44px] flex items-center justify-center sm:justify-start active:bg-gray-50 ${
                    state.currentForm === 'assignments'
                      ? 'border-[#1d0fdb] text-[#1d0fdb] bg-[#1d0fdb]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => handleTabChange('changes')}
                  onMouseEnter={() => handleTabHover('changes')}
                  className={`py-4 px-4 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[44px] flex items-center justify-center sm:justify-start active:bg-gray-50 ${
                    state.currentForm === 'changes'
                      ? 'border-[#1d0fdb] text-[#1d0fdb] bg-[#1d0fdb]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Request Changes
                </button>
                <button
                  onClick={() => handleTabChange('worker')}
                  onMouseEnter={() => handleTabHover('worker')}
                  className={`py-4 px-4 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 min-h-[44px] flex items-center justify-center sm:justify-start active:bg-gray-50 ${
                    state.currentForm === 'worker'
                      ? 'border-[#1d0fdb] text-[#1d0fdb] bg-[#1d0fdb]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Worker
                </button>
              </nav>
            </div>
            
            {/* Form Content */}
            <div className="p-6">
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Assignment Form
                    </h2>
                    <AssignmentForm />
                  </div>
                )}
                
                {state.currentForm === 'changes' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Request Changes Form
                    </h2>
                    <ChangesForm />
                  </div>
                )}
                
                {state.currentForm === 'worker' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Worker Form
                    </h2>
                    <WorkerForm />
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormsPage;