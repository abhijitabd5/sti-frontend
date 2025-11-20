import React, { useState } from 'react';
import enquiryApi from '@/services/api/enquiryApi';
import { INSTITUTION_INFO } from '@/config/constants';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    course_id: '',
    course_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        const alphabetCount = (value.match(/[a-zA-Z]/g) || []).length;
        if (alphabetCount < 3) {
          error = 'Name must contain at least 3 alphabetic characters';
        }
        break;
        
      case 'phone':
        if (value.trim()) { // Only validate if phone is provided
          const mobileRegex = /^[6-9]\d{9}$/;
          if (!mobileRegex.test(value)) {
            if (value.length !== 10) {
              error = 'Mobile number must be exactly 10 digits';
            } else if (!/^[6-9]/.test(value)) {
              error = 'Mobile number must start with 6, 7, 8, or 9';
            } else if (!/^\d+$/.test(value)) {
              error = 'Mobile number must contain only digits';
            }
          }
        }
        break;
        
      case 'message':
        const messageAlphabetCount = (value.match(/[a-zA-Z]/g) || []).length;
        if (messageAlphabetCount < 5) {
          error = 'Message must contain at least 5 alphabetic characters';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change
    if (name === 'name' || name === 'phone' || name === 'message') {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });

    // Validate all fields before submission
    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    const messageError = validateField('message', formData.message);
    
    setErrors({
      name: nameError,
      phone: phoneError,
      message: messageError
    });
    
    // If there are any errors, don't submit
    if (nameError || phoneError || messageError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await enquiryApi.createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        course_id: formData.course_id || null,
        course_name: formData.course_name || null,
        enquiry_type: 'contact_us'
      });
      setSubmitStatus({
        type: 'success',
        message: response.message || 'Your enquiry has been submitted successfully. We will get back to you soon!'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        course_id: '',
        course_name: ''
      });
      setErrors({
        name: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'Sorry, there was an error sending your message. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Visit Us',
      details: [
        INSTITUTION_INFO.contact.address
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      details: [
        `Main: ${INSTITUTION_INFO.contact.mobile.primary}`,
        `Alternate: ${INSTITUTION_INFO.contact.mobile.secondary}`,
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      details: [
        INSTITUTION_INFO.contact.email,
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Ready to start your heavy equipment training journey? Contact us today to learn more about our programs 
            or schedule a tour of our facilities.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 h-fit">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h3>
            
            {submitStatus.message && (
              <div className={`p-4 rounded-lg mb-6 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength="10"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors`}
                    placeholder="1234567890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none ${
                    errors.message 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Tell us about your interest in our training programs..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    Send Message
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white">
                      {info.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h4>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 dark:text-gray-400">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Embed - Full Width */}
        <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="relative w-full h-96">
            <iframe
              src="https://www.google.com/maps?q=24.1805183,85.5845335&z=17&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                borderRadius: '8px'
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${INSTITUTION_INFO.name} Location`}
            />
          </div>
          
          {/* Directions Button */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Location: 24.1805183°N, 85.5845335°E</p>
            </div>
            <a
              href="https://www.google.com/maps?q=24.1805183,85.5845335"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-16 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our Campus
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Come see our state-of-the-art training facility and meet our experienced instructors. 
            Tours are available Monday through Friday and include a demonstration of our equipment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tour Duration</h4>
              <p className="text-gray-600 dark:text-gray-400">45-60 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Group Size</h4>
              <p className="text-gray-600 dark:text-gray-400">Up to 10 people</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">What's Included</h4>
              <p className="text-gray-600 dark:text-gray-400">Equipment demo & Q&A</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default ContactSection;
