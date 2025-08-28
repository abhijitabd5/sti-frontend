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
            {/* Optional: Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {/* Call Button */}
        <a
          href="tel:+15551234567"
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Call us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
        
        {/* Message Button */}
        <a
          href="#contact"
          className="flex items-center justify-center w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Send message"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </a>
        
        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-center w-14 h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      
      {/* Optional: Progress Indicator for Page Loading */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-100 z-50"></div>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
