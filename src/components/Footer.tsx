import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Logo } from './';

const Footer: React.FC = () => {
  const { dispatch } = useAppContext();

  const handleTermsClick = () => {
    dispatch({ type: 'SET_SHOW_TERMS', payload: true });
  };

  const handlePrivacyClick = () => {
    dispatch({ type: 'SET_SHOW_PRIVACY', payload: true });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="card m-4 mt-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
              <Logo size="md" />
              <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ProHappyAssignments
              </div>
            </div>
            <p className="text-sm text-accent-navy/70">
              © {currentYear} ProHappyAssignments. All rights reserved.
            </p>
            <p className="text-xs text-accent-navy/60 mt-1">
              🎯 100% Pass • 🔒 100% Trust • ⚡ 0% Risk
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleTermsClick}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              📋 Terms & Conditions
            </button>
            <button
              onClick={handlePrivacyClick}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-accent-navy hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              🔒 Privacy Policy
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Professional academic assignment services. We help students achieve their academic goals with quality assistance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;