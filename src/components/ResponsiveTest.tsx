import React, { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
  breakpoint: string;
}

export const ResponsiveTest: React.FC = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
    breakpoint: ''
  });

  const getBreakpoint = (width: number): string => {
    if (width < 640) return 'xs (< 640px)';
    if (width < 768) return 'sm (640px - 767px)';
    if (width < 1024) return 'md (768px - 1023px)';
    if (width < 1280) return 'lg (1024px - 1279px)';
    if (width < 1536) return 'xl (1280px - 1535px)';
    return '2xl (≥ 1536px)';
  };

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        breakpoint: getBreakpoint(width)
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const testElements = [
    {
      name: 'Touch Target Size',
      test: 'min-h-[44px]',
      description: 'All interactive elements should be at least 44px tall for touch accessibility'
    },
    {
      name: 'Form Input Padding',
      test: 'px-4 py-3',
      description: 'Form inputs should have adequate padding for mobile use'
    },
    {
      name: 'Button Sizing',
      test: 'min-h-[48px]',
      description: 'Primary buttons should be at least 48px tall'
    },
    {
      name: 'Text Size',
      test: 'text-base',
      description: 'Form text should be at least 16px to prevent zoom on iOS'
    },
    {
      name: 'Checkbox Size',
      test: 'h-5 w-5',
      description: 'Checkboxes should be large enough for touch interaction'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Responsive Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium">Screen:</span> {screenSize.width} × {screenSize.height}
        </div>
        <div>
          <span className="font-medium">Breakpoint:</span> {screenSize.breakpoint}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Mobile Optimizations</h4>
        <div className="space-y-1">
          {testElements.map((element, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{element.name}</span>
              </div>
              <div className="text-gray-600 ml-3">{element.test}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Test Elements</h4>
        
        {/* Test touch target */}
        <button className="w-full bg-[#1d0fdb] text-white py-3 px-4 rounded-lg text-sm mb-2 min-h-[44px] active:bg-[#3a2a5c]">
          Touch Target Test
        </button>
        
        {/* Test input */}
        <input 
          type="text" 
          placeholder="Input test"
          className="w-full px-4 py-3 border rounded-lg text-base mb-2 min-h-[44px]"
        />
        
        {/* Test checkbox */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="h-5 w-5 cursor-pointer" />
          <label className="text-xs cursor-pointer">Checkbox test</label>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;