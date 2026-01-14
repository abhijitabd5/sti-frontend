import React, { useRef } from 'react';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

const CertificateViewer = ({ certificate, student, onBack, onDownload }) => {
  const certificateRef = useRef();

  const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateNumber}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Certificates</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownload}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Certificate */}
      <div className="flex justify-center bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
        <div 
          ref={certificateRef}
          className="relative w-full max-w-[1000px] aspect-[1.414/1] bg-white shadow-2xl print:shadow-none"
          style={{ minHeight: '700px' }}
        >
          {/* Decorative corner ribbons */}
          <div className="absolute top-0 left-0 w-64 h-64 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 transform rotate-[-15deg] opacity-90"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-amber-600 via-amber-500 to-amber-700 transform rotate-[-15deg] opacity-90"></div>
          </div>

          {/* Decorative pattern overlays */}
          <div className="absolute top-0 right-0 w-full h-32 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q25,30 50,50 T100,50" stroke="#f97316" strokeWidth="1" fill="none" />
              </pattern>
              <rect width="1000" height="100" fill="url(#wave-pattern)" />
            </svg>
          </div>

          {/* Border frame */}
          <div className="absolute inset-4 border-4 border-black"></div>

          {/* Background watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-around py-8">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="font-bold text-3xl opacity-[0.06] select-none whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(90deg, #d4af37 0%, #f4e5a1 25%, #d4af37 50%, #f4e5a1 75%, #d4af37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent'
                  }}
                >
                  EARTH MOVERS TRAINING ACADEMY • EARTH MOVERS TRAINING ACADEMY • EARTH MOVERS TRAINING ACADEMY
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="relative h-full p-8 flex flex-col">
            {/* Left side - Logo and QR */}
            <div className="absolute left-12 top-20 flex flex-col items-center gap-4">
              {/* Logo placeholder */}
              <div className="w-32 h-32 border-4 border-green-700 rounded-full flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-green-700 font-bold text-3xl">EMTA</div>
                  <div className="text-xs text-gray-600">ISO 9001:2015</div>
                </div>
              </div>
              
              {/* Certificate Number */}
              <div className="text-center text-xs">
                <div className="font-semibold">Certificate No: {certificate.certificateNumber}</div>
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-2 rounded">
                <QRCode
                  value={verificationUrl}
                  size={80}
                  level="M"
                />
              </div>
            </div>

            {/* Right side - Photo */}
            <div className="absolute right-12 top-32">
              <div className="w-28 h-32 border-2 border-gray-400 bg-gray-100 flex items-center justify-center overflow-hidden">
                {student.profilePhoto ? (
                  <img 
                    src={student.profilePhoto} 
                    alt="Student" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Photo</div>
                )}
              </div>
              <div className="text-xs text-center mt-1">
                Regd No: {student.registrationNumber || 'EMTA/000001/' + certificate.certificateNumber}
              </div>
            </div>

            {/* Header */}
            <div className="text-center pt-8 pb-4">
              <h1 className="text-6xl font-bold text-amber-700 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                EARTH MOVERS
              </h1>
              <h2 className="text-4xl font-bold text-gray-700 mb-2">
                TRAINING ACADEMY
              </h2>
              <p className="text-sm text-gray-600 mb-1">AN (ISO 9001:2015) CERTIFIED INSTITUTE</p>
              <p className="text-xs text-gray-600 mb-1">Managed By: Earth Movers Education & Welfare Foundation</p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Add:</span> Heavy Equipment Training Center, Industrial Area
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Visit Us:</span> www.earthmoverstraining.com
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center mb-6">
              <h3 className="text-6xl font-serif italic">Certificate</h3>
            </div>

            {/* Certificate Body */}
            <div className="max-w-2xl mx-auto text-left space-y-3 text-base leading-relaxed px-4">
              <p className="text-center mb-4">THIS IS TO CERTIFY THAT</p>
              
              <div className="flex items-baseline gap-2">
                <span>MR/MS</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {student.fullName?.toUpperCase() || 'STUDENT NAME'}
                </span>
                <span>Son/Daughter/Wife Of</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span>Mr./Ms.</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {student.fatherName?.toUpperCase() || 'FATHER NAME'}
                </span>
                <span>has successfully</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span>completed course of</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {certificate.courseDuration?.toUpperCase() || 'COURSE DURATION'}
                </span>
                <span>Training Programme</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span>in</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {certificate.courseName?.toUpperCase() || 'COURSE NAME'}
                </span>
                <span>Trade commence from</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {certificate.startDate ? format(new Date(certificate.startDate), 'MMMM yyyy').toUpperCase() : 'START DATE'}
                </span>
                <span>and obtained</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {certificate.gradeText || 'A+'}
                </span>
                <span>Grade in the</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span>examination held in the month of</span>
                <span className="flex-1 border-b-2 border-dotted border-gray-400 text-center font-bold">
                  {certificate.completionDate ? format(new Date(certificate.completionDate), 'MMMM yyyy').toUpperCase() : 'COMPLETION DATE'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex justify-between items-end px-8 pb-8">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Issued On:</span> 
                  <span className="font-bold ml-2">
                    {certificate.issuedDate ? format(new Date(certificate.issuedDate), 'dd MMM yyyy').toUpperCase() : 'ISSUE DATE'}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="border-t-2 border-black pt-2 px-4">
                  <p className="text-sm font-semibold">Director</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="absolute bottom-16 left-0 right-0 text-center px-12">
              <p className="text-[10px] text-red-600 italic">
                Disclaimer: This Certificate is being awarded as per the present evaluations of candidate. In any circumstances it does not guarantee the Technical Skill of candidate in any means.
              </p>
            </div>

            {/* ISO Watermark */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 opacity-5">
              <div className="text-6xl font-bold text-gray-400">AN ISO 9001:2015</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;