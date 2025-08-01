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

  return (
    <header className="card border-0 shadow-lg m-4 mb-0 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <Logo size="lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ProHappyAssignments
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                  : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
              }`}
            >
              Home
            </Link>
            <Link
              to="/forms"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/forms'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                  : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
              }`}
            >
              Forms
            </Link>
            <button
              onClick={handleTermsClick}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Terms
            </button>
            <button
              onClick={handlePrivacyClick}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Privacy
            </button>
          </nav>

          {/* Mobile menu button - Enhanced for touch */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-accent-yellow to-accent-red text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30 active:scale-95 transition-all duration-300 min-h-[44px] min-w-[44px]"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced for touch */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 border-t border-primary/20 bg-gradient-to-br from-white/95 to-accent-purple/10 backdrop-blur-sm rounded-b-2xl">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 min-h-[44px] flex items-center ${
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
                className={`block px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 min-h-[44px] flex items-center ${
                  location.pathname === '/forms'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                    : 'text-accent-navy hover:bg-gradient-to-r hover:from-accent-yellow hover:to-accent-red hover:text-white hover:shadow-md hover:scale-105'
                }`}
              >
                📝 Forms
              </Link>
              <button
                onClick={handleTermsClick}
                className="block w-full text-left px-6 py-4 rounded-xl text-base font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300 min-h-[44px] flex items-center"
              >
                📋 Terms & Conditions
              </button>
              <button
                onClick={handlePrivacyClick}
                className="block w-full text-left px-6 py-4 rounded-xl text-base font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300 min-h-[44px] flex items-center"
              >
                🔒 Privacy Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;