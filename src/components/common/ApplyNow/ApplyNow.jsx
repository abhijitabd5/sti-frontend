import React from 'react';
import { Link } from 'react-router-dom';

const ApplyNow = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Left Section - Certification Info */}
          <div className="text-center lg:text-left text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1">
              Certified Training Institute
            </h2>
            <p className="text-white/90 text-sm lg:text-base">
              ISO Certification Number: ISO 9001:2015 | Certificate No: EMT-2024-001
            </p>
          </div>

          {/* Center Section - Contact & Admission Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-white">
            {/* Call Now */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Call Now</div>
                <div className="text-lg font-bold">+91 9175-113-022</div>
              </div>
            </div>

            {/* Admission Info */}
            <div className="text-center">
              <div className="text-sm font-medium">Admission Opens</div>
              <div className="text-lg font-bold">Limited Seats Available</div>
            </div>
          </div>

          {/* Right Section - Apply Button */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              to="/apply"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <a
              href="tel:+919175113022"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Quick Call
            </a>
          </div>
        </div>

        {/* Bottom Section - Additional Info */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-wrap justify-center lg:justify-between items-center space-y-2 lg:space-y-0 text-sm text-white/90">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Job Placement Assistance
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Industry Certified Training
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Flexible Payment Options
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">Next Batch Starts: March 15, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
