import React from 'react';
import { Link } from 'react-router-dom';

const WebsiteFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Courses', path: '/courses' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
    ],
    courses: [
      { label: 'Excavator Training', path: '/courses/excavator' },
      { label: 'Crane Operations', path: '/courses/crane' },
      { label: 'Bulldozer Training', path: '/courses/bulldozer' },
      { label: 'Heavy Equipment Package', path: '/courses/complete' },
    ],
    support: [
      { label: 'Student Portal', path: '/student/login' },
      { label: 'Career Services', path: '/career-services' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Financial Aid', path: '/financial-aid' },
    ]
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/earthmoverstraining',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/earthmoversedu',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/earth-movers-training',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@earthmoverstraining',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/earthmoverstraining',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.485.15 4.946.268a5.989 5.989 0 0 0-2.163.89 5.989 5.989 0 0 0-.89 2.163C1.775 4.36 1.707 4.97 1.673 5.917 1.638 6.866 1.625 7.272 1.625 10.893s.013 4.027.048 4.975c.034.947.102 1.556.22 2.095.119.54.277 1.04.52 1.504.244.464.537.871.89 1.224.353.353.76.646 1.224.89.464.243.964.401 1.504.52.539.118 1.148.186 2.095.22.948.035 1.354.048 4.975.048s4.027-.013 4.975-.048c.947-.034 1.556-.102 2.095-.22.54-.119 1.04-.277 1.504-.52.464-.244.871-.537 1.224-.89.353-.353.646-.76.89-1.224.243-.464.401-.964.52-1.504.118-.539.186-1.148.22-2.095.035-.948.048-1.354.048-4.975s-.013-4.027-.048-4.975c-.034-.947-.102-1.556-.22-2.095-.119-.54-.277-1.04-.52-1.504a5.989 5.989 0 0 0-.89-1.224 5.989 5.989 0 0 0-1.224-.89c-.464-.243-.964-.401-1.504-.52-.539-.118-1.148-.186-2.095-.22C16.044.013 15.638 0 12.017 0zm0 2.164c3.578 0 3.999.014 5.417.048.906.033 1.396.142 1.724.236.433.168.742.369 1.067.694.325.325.526.634.694 1.067.094.328.203.818.236 1.724.034 1.418.048 1.839.048 5.417s-.014 3.999-.048 5.417c-.033.906-.142 1.396-.236 1.724-.168.433-.369.742-.694 1.067-.325.325-.634.526-1.067.694-.328.094-.818.203-1.724.236-1.418.034-1.839.048-5.417.048s-3.999-.014-5.417-.048c-.906-.033-1.396-.142-1.724-.236-.433-.168-.742-.369-1.067-.694-.325-.325-.526-.634-.694-1.067-.094-.328-.203-.818-.236-1.724-.034-1.418-.048-1.839-.048-5.417s.014-3.999.048-5.417c.033-.906.142-1.396.236-1.724.168-.433.369-.742.694-1.067.325-.325.634-.526 1.067-.694.328-.094.818-.203 1.724-.236 1.418-.034 1.839-.048 5.417-.048zm0 3.68a5.156 5.156 0 1 0 0 10.312 5.156 5.156 0 0 0 0-10.312zm0 8.5a3.344 3.344 0 1 1 0-6.688 3.344 3.344 0 0 1 0 6.688zm5.381-9.09a1.204 1.204 0 1 0 2.408 0 1.204 1.204 0 0 0-2.408 0z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 2H5C3.89 2 3 2.89 3 4v16a1 1 0 0 0 1.44.89L12 17.5l7.56 3.39A1 1 0 0 0 21 20V4c0-1.11-.89-2-2-2zm-7 14.5l-5.72 2.56L6 4h12l-.28 15.06L12 16.5z"/>
                  <circle cx="8" cy="8" r="1"/>
                  <circle cx="16" cy="8" r="1"/>
                  <path d="M8 12h8v2H8z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Earth Movers</h3>
                <p className="text-sm text-gray-400">Training Academy</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Building careers and moving earth with professional heavy equipment training since 2018.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Beside NH-2 At Barkatha, Barhi, Hazaribagh, Jharkhand (825323).
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 9175113022
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                shahabuddintraining@gmail.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerSections.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Courses</h3>
            <ul className="space-y-2">
              {footerSections.courses.map((course, index) => (
                <li key={index}>
                  <Link
                    to={course.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Student Support</h3>
            <ul className="space-y-2">
              {footerSections.support.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; {currentYear} Earth Movers Training Academy. All rights reserved.</p>
              <div className="mt-1 space-x-4">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;
