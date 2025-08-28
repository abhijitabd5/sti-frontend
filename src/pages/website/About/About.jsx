import React from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';

const About = () => {
  const stats = [
    { number: '5000+', label: 'Graduates Trained' },
    { number: '95%', label: 'Job Placement Rate' },
    { number: '25+', label: 'Years of Experience' },
    { number: '15+', label: 'Industry Partners' }
  ];

  const values = [
    {
      title: 'Safety First',
      description: 'Safety is our top priority in every aspect of training. We maintain the highest safety standards and instill a safety-first mindset in all our students.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      title: 'Excellence in Training',
      description: 'We provide the highest quality training programs using state-of-the-art equipment and industry-proven methods to ensure our graduates are job-ready.',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    },
    {
      title: 'Career Support',
      description: 'Our commitment extends beyond training. We provide ongoing career support, job placement assistance, and industry connections to help our graduates succeed.',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'
    },
    {
      title: 'Industry Leadership',
      description: 'With decades of experience and strong industry partnerships, we stay at the forefront of heavy equipment training and construction industry trends.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    }
  ];

  const teamMembers = [
    {
      name: 'John Mitchell',
      position: 'CEO & Lead Instructor',
      experience: '30+ years experience',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Former construction site supervisor with extensive experience in heavy equipment operations and safety training.'
    },
    {
      name: 'Sarah Rodriguez',
      position: 'Training Director',
      experience: '20+ years experience',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Certified safety instructor specializing in OSHA compliance and heavy equipment safety protocols.'
    },
    {
      name: 'Mike Thompson',
      position: 'Equipment Operations Specialist',
      experience: '25+ years experience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Master operator with expertise in all types of heavy machinery and advanced equipment technologies.'
    },
    {
      name: 'Lisa Chen',
      position: 'Career Services Manager',
      experience: '15+ years experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Dedicated to connecting graduates with career opportunities and providing ongoing professional support.'
    }
  ];

  const timeline = [
    {
      year: '1998',
      title: 'Founded',
      description: 'Started as a small local training center with a vision to provide quality heavy equipment training.'
    },
    {
      year: '2005',
      title: 'Expanded Facility',
      description: 'Opened our current 50-acre training facility with state-of-the-art equipment and classrooms.'
    },
    {
      year: '2010',
      title: 'Industry Partnerships',
      description: 'Established partnerships with major construction companies for job placement programs.'
    },
    {
      year: '2015',
      title: '1000th Graduate',
      description: 'Celebrated training our 1000th student, marking a major milestone in our journey.'
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Integrated advanced simulation technology and online learning components.'
    },
    {
      year: '2024',
      title: 'Continued Excellence',
      description: 'Today, we continue to be the leading heavy equipment training institute in the region.'
    }
  ];

  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      <ApplyNow />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Heavy equipment training facility"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Our Training Institute
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            For over 25 years, we've been transforming careers through comprehensive heavy equipment training programs, preparing skilled operators for success in the construction and mining industries.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                To provide the highest quality heavy equipment training in a safe, supportive environment while preparing our students for successful careers in the construction and mining industries.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We believe that proper training not only creates skilled operators but also builds careers, strengthens families, and contributes to the growth of our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Our Courses
                  <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold text-lg rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Training facility"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              These principles guide everything we do and shape the experience of every student who trains with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our experienced instructors and staff are dedicated to providing you with the best training experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-2">
                    {member.position}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {member.experience}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From humble beginnings to industry leadership, here's how we've grown over the years.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-orange-200 dark:bg-orange-800"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 border-4 border-white dark:border-gray-900 rounded-full z-10"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-2xl font-bold text-orange-500 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              World-Class Training Facilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our 50-acre training facility features the latest equipment and technology to provide hands-on, real-world training experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Training yard"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  50-Acre Training Yard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Spacious outdoor training area with various terrain types to simulate real working conditions.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern classrooms"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Modern Classrooms
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  State-of-the-art classrooms equipped with multimedia technology for effective learning.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Equipment fleet"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Latest Equipment Fleet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive collection of modern heavy equipment for hands-on training experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Join thousands of successful graduates who've built rewarding careers through our comprehensive training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Now
              <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/gallery/images"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 font-semibold text-lg rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              View Our Gallery
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default About;
