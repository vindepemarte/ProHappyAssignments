import React, { ReactNode } from 'react';
import { Header, Footer } from './index';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  return (
    <div className={`min-h-screen flex flex-col gradient-bg ${process.env.NODE_ENV === 'development' ? 'responsive-test' : ''}`}>
      {showHeader && <Header />}
      <main className="flex-1 container-mobile py-4 sm:py-6 lg:py-8">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;