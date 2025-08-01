import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const CookieBanner: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent !== null) {
      const consent = storedConsent === 'true';
      dispatch({ type: 'SET_COOKIE_CONSENT', payload: consent });
    } else {
      // Show banner if no previous choice
      setIsVisible(true);
    }
  }, [dispatch]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    dispatch({ type: 'SET_COOKIE_CONSENT', payload: true });
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    dispatch({ type: 'SET_COOKIE_CONSENT', payload: false });
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#2f3b65] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-[#434343] leading-relaxed">
              We use cookies to enhance your experience and analyze site usage. 
              By continuing to use this site, you consent to our use of cookies. 
              <button
                onClick={() => dispatch({ type: 'SET_SHOW_PRIVACY', payload: true })}
                className="text-[#1d0fdb] hover:text-[#2f3b65] underline ml-1 font-medium"
                aria-label="View Privacy Policy"
              >
                Learn more
              </button>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-[#434343] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1d0fdb] focus:ring-offset-2"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1d0fdb] hover:bg-[#2f3b65] rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1d0fdb] focus:ring-offset-2"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;