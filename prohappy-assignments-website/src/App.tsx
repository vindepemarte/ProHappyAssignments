import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './contexts/AppContext';
import { CookieBanner, LazyTermsModal, LazyPrivacyModal, ResponsiveTest, ErrorBoundary, RouterErrorBoundary, LoadingSpinner } from './components';

// Lazy load pages for route-based code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FormsPage = lazy(() => import('./pages/FormsPage'));

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterErrorBoundary>
          <Router>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" className="mb-4" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/forms" element={<FormsPage />} />
              </Routes>
            </Suspense>
            <CookieBanner />
            <LazyTermsModal />
            <LazyPrivacyModal />
            {import.meta.env.DEV && <ResponsiveTest />}
          </Router>
        </RouterErrorBoundary>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
