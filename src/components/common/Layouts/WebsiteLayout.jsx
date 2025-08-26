import React from 'react';
import WebsiteHeader from '../Header/WebsiteHeader';
import WebsiteFooter from '../Footer/WebsiteFooter';

const WebsiteLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <WebsiteHeader />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
