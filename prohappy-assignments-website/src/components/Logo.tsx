import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Book Character SVG representation */}
      <div className="w-full h-full relative">
        {/* Book body (yellow) */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow to-yellow-400 rounded-lg transform rotate-3 shadow-lg">
          {/* Book pages (white) */}
          <div className="absolute top-1 right-1 w-3/4 h-1/4 bg-white rounded-sm opacity-90"></div>
          <div className="absolute top-2 right-1 w-3/4 h-1/4 bg-white rounded-sm opacity-80"></div>
          
          {/* Eyes with glasses */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {/* Left eye */}
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full border-2 border-accent-red">
                <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
            {/* Right eye */}
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full border-2 border-accent-red">
                <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Smile */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-2 h-1 border-b-2 border-black rounded-full"></div>
          
          {/* Book being read (red) */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gradient-to-br from-accent-red to-red-500 rounded-sm shadow-md">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white opacity-80"></div>
          </div>
          
          {/* Bookmark (green) */}
          <div className="absolute top-0 right-2 w-1 h-4 bg-gradient-to-b from-green-400 to-green-500 rounded-b-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;