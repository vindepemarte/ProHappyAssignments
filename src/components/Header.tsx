import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSafeLocation } from '../hooks/useSafeLocation';
import { Logo } from './';

const Header: React.FC = () => {
  const location = useSafeLocation();
  const { dispatch } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showInstallModal, setShowInstallModal] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTermsClick = () => {
    dispatch({ type: 'SET_SHOW_TERMS', payload: true });
    setIsMobileMenuOpen(false);
  };

  const handlePrivacyClick = () => {
    dispatch({ type: 'SET_SHOW_PRIVACY', payload: true });
    setIsMobileMenuOpen(false);
  };

  const handleInstallClick = () => {
    setShowInstallModal(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="card border-0 shadow-lg m-2 sm:m-4 mb-0 rounded-xl sm:rounded-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 min-w-0">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-300">
                <Logo size="sm" className="sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                <span className="text-sm sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                  ProHappyAssignments
                </span>
              </Link>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                  : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
              }`}
            >
              Home
            </Link>
            <Link
              to="/forms"
              className={`px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/forms'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                  : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
              }`}
            >
              Forms
            </Link>
            <button
              onClick={handleTermsClick}
              className="px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Terms
            </button>
            <button
              onClick={handlePrivacyClick}
              className="px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Privacy
            </button>
            <button
              onClick={handleInstallClick}
              className="px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              📱 Install
            </button>
          </nav>

          {/* Mobile menu button - Enhanced for touch */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-accent-yellow to-accent-red text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30 active:scale-95 transition-all duration-300 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMobileMenuOpen ? (
                <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced for touch */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-2 sm:space-y-3 border-t border-primary/20 bg-gradient-to-br from-white/95 to-accent-purple/10 backdrop-blur-sm rounded-b-xl sm:rounded-b-2xl">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 min-h-[44px] flex items-center ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                    : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
                }`}
              >
                🏠 Home
              </Link>
              <Link
                to="/forms"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 min-h-[44px] flex items-center ${
                  location.pathname === '/forms'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                    : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
                }`}
              >
                📝 Forms
              </Link>
              <button
                onClick={handleTermsClick}
                className="block w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300 min-h-[44px] flex items-center"
              >
                📋 Terms & Conditions
              </button>
              <button
                onClick={handlePrivacyClick}
                className="block w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300 min-h-[44px] flex items-center"
              >
                🔒 Privacy Policy
              </button>
              <button
                onClick={handleInstallClick}
                className="block w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300 min-h-[44px] flex items-center"
              >
                📱 Install App
              </button>
            </div>
          </div>
        )}
      </div>
    </header>

      {/* Install App Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Install ProHappyAssignments</h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* iOS Instructions */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">📱</span>
                  iOS (iPhone/iPad)
                </h4>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Tap the <strong>Share</strong> button (square with arrow) at the bottom of Safari</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right corner</li>
                  <li>The app will appear on your home screen!</li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  Android
                </h4>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Tap the <strong>Menu</strong> button (three dots) in Chrome</li>
                  <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                  <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong></li>
                  <li>The app will appear on your home screen!</li>
                </ol>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✨ Benefits of Installing:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Quick access from your home screen</li>
                  <li>• Works offline for basic features</li>
                  <li>• Faster loading times</li>
                  <li>• Native app-like experience</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;