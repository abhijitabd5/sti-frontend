# STI Training Institute - Development Progress

## Overview
This document tracks the development progress of the STI Training Institute frontend application, a React-based web application for a heavy equipment training institute.

## Project Structure

### Core Setup
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS with custom configuration
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Icons**: Heroicons (SVG-based)
- **Build Tool**: Vite with custom alias configuration (@/ for src/)

## Authentication System

### Components Created
- **Login Page** (`src/pages/auth/Login.jsx`)
  - Responsive design with left-side image and right-side form
  - Supports both mobile/email and password authentication
  - Demo credentials display for testing
  - Form validation and error handling
  - Theme toggle integration
  - Role-based redirect functionality

### Services & Context
- **AuthContext** (`src/contexts/AuthContext.jsx`)
  - Manages authentication state globally
  - Provides login, logout, and user update functions
  - Handles token management and persistence
  - User session management

- **Authentication API** (`src/services/api/authApi.js`)
  - Mock authentication service
  - Login/logout functionality
  - Profile management
  - Password reset capabilities
  - Token verification
  - Uses mock user data for testing

### Guards & Protection
- **ProtectedRoute** (`src/guards/ProtectedRoute.jsx`)
  - Route protection based on authentication status
  - Role-based access control (AdminRoute)
  - Automatic redirect to login for unauthorized access

## Website Pages

### Public Pages
- **Home Page** (`src/pages/website/Home/Home.jsx`)
  - Landing page with hero section and key information
  - Course highlights and testimonials
  - Call-to-action sections

- **Courses Page** (`src/pages/website/Courses/Courses.jsx`)
  - Course catalog with filtering capabilities
  - Category and level-based filtering
  - Course cards with pricing and enrollment info
  - Integration with website API for course data

- **Course Details Page** (`src/pages/website/Courses/CourseDetails.jsx`)
  - Detailed course information with tabbed interface
  - Curriculum, requirements, and reviews sections
  - Enrollment modal functionality
  - Related courses suggestions
  - Breadcrumb navigation

- **About Page** (`src/pages/website/About/About.jsx`)
  - Company information and statistics
  - Team member profiles
  - Company timeline and history
  - Facility showcases
  - Mission and values presentation

### Gallery System
- **Images Gallery** (`src/pages/website/Gallery/Images.jsx`)
  - Categorized photo gallery
  - Lightbox functionality with keyboard navigation
  - Image filtering by categories
  - Lazy loading for performance
  - Full-screen image viewing

- **Videos Gallery** (`src/pages/website/Gallery/Videos.jsx`)
  - Video catalog with thumbnail previews
  - Modal video player with YouTube embeds
  - Category-based filtering
  - Video metadata display (duration, views, dates)

  - **Contact Page** (`src/pages/website/ContactUs/ContactUs.jsx`)
  - Responsive design with left-side image and right-side form

## API Services

### Website API Client (`src/services/api/websiteApi.js`)
- **Course Management**:
  - `getCourses()` - Fetch all available courses
  - `getCourseById(id)` - Get specific course details
- **Mock Data Integration**: Uses comprehensive mock data for courses
- **Data Structure**: Courses include pricing, duration, level, features, enrollment counts
- **Future-Ready**: Structured to easily integrate with real backend APIs

## Common Components

### Layout System
- **WebsiteLayout** (`src/components/common/Layouts/WebsiteLayout.jsx`)
  - Consistent layout wrapper for all public pages
  - Navbar and footer integration
  - Theme support and responsive design

### Functional Components
- **ApplyNow** (`src/components/common/ApplyNow/ApplyNow.jsx`)
  - Sticky application banner
  - Consistent across all pages
  - Call-to-action functionality

### Theme System
- **ThemeContext** (`src/contexts/ThemeContext.jsx`)
  - Dark/light theme management
  - System preference detection
  - Theme persistence across sessions
  - Smooth theme transitions

## Admin Dashboard

### Internal Pages
- **Dashboard** (`src/pages/internal/Dashboard/Dashboard.jsx`)
  - Admin dashboard with role-based access
  - Protected by authentication guards
  - Statistics and management interface

## Mock Data & Testing

### Course Data (Integrated in websiteApi.js)
- **Diverse Course Catalog**: Equipment training courses (excavator, crane, bulldozer, loader)
- **Pricing Structure**: Various price points and payment options
- **Skill Levels**: Beginner, intermediate, advanced classifications
- **Rich Content**: Descriptions, features, requirements, reviews

## Routing System

### Public Routes
- `/` - Home page
- `/login` - Authentication page
- `/courses` - Course catalog
- `/courses/:id` - Individual course details
- `/about` - Company information
- `/gallery/images` - Photo gallery
- `/gallery/videos` - Video gallery

### Protected Routes
- `/admin/dashboard` - Admin dashboard (requires super_admin role)

### Route Configuration
- **App.jsx**: Central routing configuration
- **Protected Routes**: Role-based access control
- **Fallback Routes**: Redirect to home for undefined routes
- **Auto Scroll**: Automatic scroll-to-top on route changes

## Development Features

### Performance Optimizations
- **Lazy Loading**: Images load on demand
- **Code Splitting**: Route-based code splitting ready
- **Responsive Images**: Optimized image sizing
- **Efficient Rendering**: Proper React key usage and state management

### User Experience
- **Loading States**: Consistent loading indicators across all pages
- **Error Handling**: Comprehensive error messaging
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Smooth Animations**: CSS transitions and hover effects

### Developer Experience
- **Component Structure**: Organized and reusable component architecture
- **State Management**: Clean separation of concerns with Context API
- **Mock Services**: Easy testing and development with mock data
- **TypeScript Ready**: Code structure prepared for TypeScript migration

## Technical Standards

### Code Organization
- **Feature-based Structure**: Pages grouped by functionality
- **Shared Components**: Reusable components in common directory
- **Service Layer**: Separate API services for different domains
- **Context Providers**: Global state management with React Context

### Styling Standards
- **TailwindCSS**: Utility-first CSS framework
- **Design System**: Consistent color scheme and typography
- **Dark Mode**: Full dark theme support
- **Responsive Design**: Mobile-first responsive breakpoints

## Future Enhancements Ready

### Backend Integration
- API clients structured for easy backend integration
- Authentication context ready for JWT token management
- Service layer abstracted for quick API endpoint updates

### Additional Features
- Contact form integration ready
- Application form system prepared
- Payment integration structure in place
- User profile management foundation set

## Testing & Quality

### Mock Data Coverage
- **Authentication**: Complete user authentication flow
- **Course Catalog**: Comprehensive course data with all required fields
- **User Roles**: Multi-role user system for testing different access levels
- **Error Scenarios**: Error handling for various failure cases

### Code Quality
- **Component Reusability**: DRY principles followed
- **Performance Considerations**: Efficient state updates and re-renders
- **Maintainability**: Clear component structure and naming conventions
- **Scalability**: Architecture supports easy feature additions

## Current Status

### Completed ✅
- Authentication system with role-based access
- Complete website public pages
- Gallery system with images and videos
- Admin dashboard foundation
- Mock data integration
- Routing and navigation
- Theme system
- Responsive design implementation

### In Progress 🔄
- Additional admin features
- Contact and application forms
- Enhanced user profile management

### Planned 📋
- Payment integration
- Email notifications
- Advanced course management
- Student progress tracking
- Certificate generation system

---

**Last Updated**: August 26, 2024  
**Development Environment**: React 18 + Vite + TailwindCSS  
**Current Version**: MVP with core functionality complete
