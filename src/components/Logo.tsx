import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'
  };

  // Determine which logo to use based on size
  const getLogoSrc = () => {
    if (size === 'xl' || size === 'lg') {
      return '/logo-512.png';
    }
    return '/logo-192.png';
  };

  return (
    <img
      src={getLogoSrc()}
      alt="ProHappyAssignments Logo"
      className={`${sizeClasses[size]} ${className} object-contain rounded-lg shadow-sm`}
      loading="lazy"
      onError={(e) => {
        // Fallback to the SVG version if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'block';
      }}
    />
  );
};

export default Logo;