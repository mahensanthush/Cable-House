
import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
  
    <div className="flex flex-col h-full">
      {/* This holds your scrollable Routes */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {children}
      </div>
      {/* Footer stays at the bottom, always visible */}
      <Footer />
    </div>
  );
};

export default Layout;