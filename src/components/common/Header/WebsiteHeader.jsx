import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import stiLogo from '@/assets/logos/sti-logo.svg';

const WebsiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 ${
        isSticky 
          ? 'fixed top-0 bg-gray-300/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'absolute top-0 bg-transparent'
      }`}
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
                        ? isSticky
                          ? 'text-orange-500'
                          : 'text-yellow-400'
                        : isSticky
                          ? 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                          : 'text-white/90 hover:text-white'
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
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdownItems.map((dropdownItem, index) => (
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
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                    item.active
                      ? isSticky
                        ? 'text-orange-500'
                        : 'text-yellow-400'
                      : isSticky
                        ? 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                        : 'text-white/90 hover:text-white'
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
                  isSticky 
                    ? 'text-orange-500' 
                    : 'text-yellow-400'
                }`}>
                  <span className="animate-pulse">Call Now</span>
                  <span className="absolute inset-0 animate-ping opacity-75">Call Now</span>
                </span>
                <a 
                  href="tel:09175113022"
                  className={`text-sm font-bold transition-all duration-200 hover:scale-105 ${
                    isSticky
                      ? 'text-gray-900 dark:text-white hover:text-orange-500'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  09175113022
                </a>
              </div>
            </div>

            {/* Mobile Call Icon */}
            {isMobile && (
              <a
                href="tel:09175113022"
                className={`sm:hidden p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isSticky
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
                aria-label="Call Now"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}

            {/* Language Dropdown */}
            <LanguageDropdown isSticky={isSticky} />

            {/* Theme Toggle */}
            <div className={`${!isSticky ? '[&_svg]:text-white/90' : ''}`}>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isSticky
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/20'
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
            isSticky 
              ? 'border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95' 
              : 'border-white/20 bg-black/20 backdrop-blur-sm'
          }`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                  item.active
                    ? isSticky
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'bg-white/20 text-yellow-400'
                    : isSticky
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Call Now */}
            <a
              href="tel:09175113022"
              className={`flex items-center justify-center space-x-2 px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                isSticky
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call Now: 09175113022</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;
