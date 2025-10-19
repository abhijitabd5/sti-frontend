import React from "react";
import WebsiteHeader from "../Header/WebsiteHeader";
import WebsiteFooter from "../Footer/WebsiteFooter";
import ScrollToTop from "../Floater/ScrollToTop";
import FloatingSocialButtons from "../Floater/FloatingSocialButtons";

const WebsiteLayout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <WebsiteHeader />
      <main className={`flex-grow ${className}`}>{children}</main>
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        <FloatingSocialButtons />
        <ScrollToTop />
      </div>

      {/* Optional: Progress Indicator for Page Loading */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-100 z-50"></div>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
