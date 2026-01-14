import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

const CertificateDownloader = ({ certificate, student, onBack }) => {
  const certificateRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [quality, setQuality] = useState('high');
  const [orientation, setOrientation] = useState('landscape');

  const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateNumber}`;

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const element = certificateRef.current;
      
      // Configure canvas options based on quality
      const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1;
      
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // PDF dimensions (A4)
      const pdfWidth = orientation === 'landscape' ? 297 : 210;
      const pdfHeight = orientation === 'landscape' ? 210 : 297;
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the certificate
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      // Center the image
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
      // Generate filename
      const filename = `${certificate.courseName.replace(/[^a-z0-9]/gi, '_')}_Certificate_${certificate.certificateNumber}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsImage = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const element = certificateRef.current;
      
      const scale = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1;
      
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${certificate.courseName.replace(/[^a-z0-9]/gi, '_')}_Certificate_${certificate.certificateNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadFormat === 'pdf') {
      downloadAsPDF();
    } else {
      downloadAsImage();
    }
  };

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
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Download Certificate
          </h2>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Download Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="pdf">PDF Document</option>
              <option value="png">PNG Image</option>
            </select>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="low">Low Quality</option>
            </select>
          </div>

          {/* Orientation (PDF only) */}
          {downloadFormat === 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download {downloadFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>

        {/* Format Info */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Download Information:</p>
              {downloadFormat === 'pdf' ? (
                <ul className="list-disc list-inside space-y-1">
                  <li>PDF format is ideal for printing and official use</li>
                  <li>Maintains vector quality and text searchability</li>
                  <li>File size is optimized for sharing</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  <li>PNG format provides high-quality images</li>
                  <li>Perfect for digital sharing and display</li>
                  <li>Transparent background support</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
        <div className="flex justify-center">
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
    </div>
  );
};

export default CertificateDownloader;