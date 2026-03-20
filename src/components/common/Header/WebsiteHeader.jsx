import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import VerifyCertificateModal from '@/components/common/VerifyCertificateModal';
import stiLogo from '@/assets/logos/sti-logo.png';

const WebsiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const location = useLocation();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 640;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation items
  const navItems = [
    { label: 'Home', path: '/', active: location.pathname === '/' },
    { label: 'Courses', path: '/courses', active: location.pathname === '/courses' },
    { label: 'About Us', path: '/about', active: location.pathname === '/about' },
    { 
      label: 'Gallery', 
      path: '/gallery', 
      active: location.pathname.startsWith('/gallery'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Images', path: '/gallery/images' },
        { label: 'Videos', path: '/gallery/videos' }
      ]
    },
    { label: 'Contact Us', path: '/contact', active: location.pathname === '/contact' },
    { label: 'Verify Certificate', action: () => setIsVerifyModalOpen(true), isButton: true },
  ];

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Check if current page is homepage
  const isHomepage = location.pathname === '/';
  
  // Determine if header should be transparent (only on homepage when not sticky)
  const shouldBeTransparent = isHomepage && !isSticky;
  
  // Determine if header should be fixed positioned
  const shouldBeFixed = isSticky || !isHomepage;

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 ${
        shouldBeFixed 
          ? 'fixed top-0 backdrop-blur-md shadow-lg' 
          : 'absolute top-0'
      }`}
      style={{ backgroundColor: shouldBeTransparent ? 'transparent' : '#111827' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={stiLogo} 
              alt="STI Logo" 
              className="h-8 lg:h-10 w-auto transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div key={item.path} className="relative group">
                  <button
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      item.active
                        ? shouldBeTransparent
                          ? 'text-yellow-400'
                          : 'text-orange-400'
                        : shouldBeTransparent
                          ? 'text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white'
                          : 'text-gray-300 hover:text-orange-400'
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-current transform -translate-x-1/2 transition-all duration-200 ${
                      item.active 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 transition-colors"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.isButton ? (
                <button
                  key={`button-${item.label}`}
                  onClick={item.action}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                    shouldBeTransparent
                      ? 'text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white'
                      : 'text-gray-300 hover:text-orange-400'
                  }`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 bg-current transform -translate-x-1/2 transition-all duration-200 w-0 group-hover:w-full" />
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                    item.active
                      ? shouldBeTransparent
                        ? 'text-yellow-400'
                        : 'text-orange-400'
                      : shouldBeTransparent
                        ? 'text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white'
                        : 'text-gray-300 hover:text-orange-400'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-current transform -translate-x-1/2 transition-all duration-200 ${
                    item.active 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            ))}
          </nav>

          {/* Right Section - Call Now, Language, Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Call Now Section */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <span className={`text-xs font-medium relative ${
                  shouldBeTransparent 
                    ? 'text-yellow-400' 
                    : 'text-orange-400'
                }`}>
                  <span className="animate-pulse">Call Now</span>
                  <span className="absolute inset-0 animate-ping opacity-75">Call Now</span>
                </span>
                <a 
                  href="tel:06206832852"
                  className={`text-sm font-bold transition-all duration-200 hover:scale-105 ${
                    shouldBeTransparent
                      ? 'text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-yellow-400'
                      : 'text-white hover:text-orange-400'
                  }`}
                >
                  06206832852
                </a>
              </div>
            </div>

            {/* Mobile Call Icon */}
            {isMobile && (
              <a
                href="tel:06206832852"
                className={`sm:hidden p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  shouldBeTransparent
                    ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
                aria-label="Call Now"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}

            {/* Language Dropdown */}
            {/* <LanguageDropdown isSticky={isSticky} /> */}

            {/* Theme Toggle */}
            <div className={`${shouldBeTransparent ? '[&_svg]:text-gray-900 dark:[&_svg]:text-white/90' : ''}`}>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                shouldBeTransparent
                  ? 'text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-4 space-y-2 border-t ${
            shouldBeTransparent 
              ? 'border-white/20 bg-black/20 backdrop-blur-sm' 
              : 'border-gray-600'
          }`}
          style={{ backgroundColor: shouldBeTransparent ? undefined : '#111827' }}
          >
            {navItems.map((item) => (
              item.isButton ? (
                <button
                  key={`mobile-button-${item.label}`}
                  onClick={item.action}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                    shouldBeTransparent
                      ? 'text-white/90 hover:bg-white/20 hover:text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                    item.active
                      ? shouldBeTransparent
                        ? 'bg-white/20 text-yellow-400'
                        : 'bg-orange-900/20 text-orange-400'
                      : shouldBeTransparent
                        ? 'text-white/90 hover:bg-white/20 hover:text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Mobile Call Now */}
            <a
              href="tel:06206832852"
              className={`flex items-center justify-center space-x-2 px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                shouldBeTransparent
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call Now: 06206832852</span>
            </a>
          </div>
        </div>
      </div>

      {/* Verify Certificate Modal */}
      <VerifyCertificateModal 
        isOpen={isVerifyModalOpen} 
        onClose={() => setIsVerifyModalOpen(false)} 
      />
    </header>
  );
};

export default WebsiteHeader;
