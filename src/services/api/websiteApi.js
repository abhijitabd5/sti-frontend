import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

// Mock data for development
const MOCK_DATA = {
  heroSlides: [
    {
      id: 1,
      title: "Master Heavy Equipment Operation",
      subtitle: "Professional Training for Excavator Operations",
      description: "Get certified and start your career in heavy equipment with our comprehensive training programs",
      image: "/api/placeholder/1920/800",
      ctaText: "Start Your Journey",
      ctaLink: "/courses"
    },
    {
      id: 2,
      title: "Industry-Leading Certification",
      subtitle: "Recognized by Construction Companies Nationwide",
      description: "Our certificates are accepted by top construction and mining companies across the country",
      image: "/api/placeholder/1920/800",
      ctaText: "View Certificates",
      ctaLink: "/about"
    },
    {
      id: 3,
      title: "Job Placement Assistance",
      subtitle: "95% Employment Rate for Our Graduates",
      description: "We help our certified graduates find employment with our extensive industry network",
      image: "/api/placeholder/1920/800",
      ctaText: "Join Now",
      ctaLink: "/contact"
    }
  ],

  courses: [
    {
      id: 1,
      title: "Basic Excavator Operation",
      description: "Learn fundamental excavator operation skills and safety procedures",
      image: "/api/placeholder/400/300",
      duration: "4 weeks",
      level: "Beginner",
      price: 2500,
      features: ["Safety Training", "Basic Operations", "Maintenance Basics"],
      enrollmentCount: 150
    },
    {
      id: 2,
      title: "Advanced Heavy Equipment",
      description: "Master multiple heavy equipment types including bulldozers and cranes",
      image: "/api/placeholder/400/300",
      duration: "8 weeks",
      level: "Advanced",
      price: 4500,
      features: ["Multi-Equipment Training", "Advanced Techniques", "Job Placement"],
      enrollmentCount: 89
    },
    {
      id: 3,
      title: "Crane Operator Certification",
      description: "Specialized crane operation training with industry certification",
      image: "/api/placeholder/400/300",
      duration: "6 weeks",
      level: "Intermediate",
      price: 3800,
      features: ["Crane Specific", "OSHA Certification", "Practical Training"],
      enrollmentCount: 67
    },
    {
      id: 4,
      title: "Bulldozer Operations",
      description: "Complete bulldozer operation course with earthmoving techniques",
      image: "/api/placeholder/400/300",
      duration: "5 weeks",
      level: "Intermediate",
      price: 3200,
      features: ["Bulldozer Operation", "Earthmoving", "Site Preparation"],
      enrollmentCount: 94
    },
    {
      id: 5,
      title: "Loader Operation Training",
      description: "Comprehensive wheel and track loader operation training",
      image: "/api/placeholder/400/300",
      duration: "3 weeks",
      level: "Beginner",
      price: 2200,
      features: ["Wheel & Track Loaders", "Material Handling", "Safety Protocols"],
      enrollmentCount: 123
    },
    {
      id: 6,
      title: "Complete Heavy Equipment Package",
      description: "Full certification program covering all major equipment types",
      image: "/api/placeholder/400/300",
      duration: "12 weeks",
      level: "All Levels",
      price: 7500,
      features: ["All Equipment Types", "Job Guarantee", "Industry Mentorship"],
      enrollmentCount: 45
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "John Martinez",
      position: "Site Supervisor",
      company: "ABC Construction",
      image: "/api/placeholder/80/80",
      rating: 5,
      comment: "The training I received here was exceptional. Within 3 months of graduation, I was promoted to site supervisor. The practical training really made the difference.",
      graduationYear: 2023
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Crane Operator",
      company: "Steel City Works",
      image: "/api/placeholder/80/80",
      rating: 5,
      comment: "I was nervous about changing careers, but the instructors were so supportive. Now I'm operating cranes on major construction projects and loving every minute of it.",
      graduationYear: 2023
    },
    {
      id: 3,
      name: "Mike Thompson",
      position: "Equipment Operator",
      company: "Mountain Mining Co.",
      image: "/api/placeholder/80/80",
      rating: 5,
      comment: "Best investment I ever made. The job placement assistance was amazing - they helped me find a position that pays twice what I was making before.",
      graduationYear: 2024
    },
    {
      id: 4,
      name: "Lisa Chen",
      position: "Heavy Equipment Trainer",
      company: "Pacific Construction",
      image: "/api/placeholder/80/80",
      rating: 5,
      comment: "After completing the advanced program, I not only got hired but was asked to train new employees. The quality of education here is unmatched.",
      graduationYear: 2022
    }
  ],

  aboutInfo: {
    title: "Earth Movers Training Academy",
    subtitle: "Building Careers, Moving Earth",
    description: "For over 15 years, Earth Movers Training Academy has been the premier destination for heavy equipment training. We've trained over 2,500 students and maintain a 95% job placement rate.",
    mission: "To provide world-class heavy equipment training that prepares students for successful careers in construction, mining, and related industries.",
    features: [
      "State-of-the-art training facility",
      "Experienced industry instructors",
      "Modern fleet of training equipment",
      "Job placement assistance",
      "Industry-recognized certifications",
      "Flexible scheduling options"
    ],
    stats: [
      { label: "Students Trained", value: "2,500+" },
      { label: "Job Placement Rate", value: "95%" },
      { label: "Years of Experience", value: "15+" },
      { label: "Industry Partners", value: "150+" }
    ]
  }
};

// API service functions
export const websiteApi = {
  // Get hero slides for the main banner
  getHeroSlides: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.HERO_SLIDES);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.heroSlides), 500);
      });
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return MOCK_DATA.heroSlides; // Fallback to mock data
    }
  },

  // Get courses for courses section
  getCourses: async (limit = null) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(`${API_ENDPOINTS.COURSES}${limit ? `?limit=${limit}` : ''}`);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          const courses = limit ? MOCK_DATA.courses.slice(0, limit) : MOCK_DATA.courses;
          resolve(courses);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      return MOCK_DATA.courses;
    }
  },

  // Get scrolling courses for marquee section
  getScrollingCourses: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(`${API_ENDPOINTS.COURSES}?featured=true`);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_DATA.courses.map(course => ({
            id: course.id,
            title: course.title,
            image: course.image,
            duration: course.duration,
            enrollmentCount: course.enrollmentCount
          })));
        }, 200);
      });
    } catch (error) {
      console.error('Error fetching scrolling courses:', error);
      return MOCK_DATA.courses.slice(0, 8);
    }
  },

  // Get testimonials
  getTestimonials: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.TESTIMONIALS);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.testimonials), 400);
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return MOCK_DATA.testimonials;
    }
  },

  // Get about information
  getAboutInfo: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.ABOUT);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.aboutInfo), 250);
      });
    } catch (error) {
      console.error('Error fetching about info:', error);
      return MOCK_DATA.aboutInfo;
    }
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.CONTACT, formData);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Thank you for your message! We will get back to you within 24 hours.',
            id: Date.now()
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Submit enrollment form
  submitEnrollment: async (enrollmentData) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.ENROLLMENTS, enrollmentData);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Enrollment application submitted successfully! We will contact you soon.',
            applicationId: `APP-${Date.now()}`,
            nextSteps: [
              'Review application within 2 business days',
              'Schedule orientation call',
              'Send course materials and schedule'
            ]
          });
        }, 1200);
      });
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      throw error;
    }
  }
};

export default websiteApi;
