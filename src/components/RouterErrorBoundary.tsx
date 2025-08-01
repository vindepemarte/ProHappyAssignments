import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary specifically for Router-related errors
 * Catches errors like "useLocation() may be used only in the context of a <Router>"
 */
class RouterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a Router context error
    const isRouterError = error.message.includes('useLocation') || 
                         error.message.includes('Router') ||
                         error.message.includes('context');
    
    if (isRouterError) {
      console.warn('RouterErrorBoundary caught Router context error:', error.message);
      return { hasError: true, error };
    }
    
    // Re-throw non-Router errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RouterErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI for Router errors
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Navigation Error
            </h2>
            <p className="text-gray-600 mb-6">
              There was an issue with the page navigation. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1d0fdb] text-white px-6 py-3 rounded-lg hover:bg-[#2f3b65] transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouterErrorBoundary;