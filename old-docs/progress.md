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
  - Role-based redirect functionality

### Services & Context
- **AuthContext** (`src/contexts/AuthContext.jsx`)
  - Manages authentication state globally
  - Provides login, logout, and user update functions
  - Handles token management and persistence
  - User session management

### Guards & Protection
- **ProtectedRoute** (`src/guards/ProtectedRoute.jsx`)
  - Route protection based on authentication status
  - Role-based access control (AdminRoute)
  - Automatic redirect to login for unauthorized access

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

### Code Quality
- **Component Reusability**: DRY principles followed
- **Performance Considerations**: Efficient state updates and re-renders
- **Maintainability**: Clear component structure and naming conventions
- **Scalability**: Architecture supports easy feature additions

## Current Status

#### Admin Pages

 **Static Pages Completed**

- Dashboard
- Course Pages
- Students & Student Enrollment Pages (Unified Module)
- Gallery Management
- Transaction Categories
- Transaction Pages (Expense and Income Unified)

**API Integration**
- Courses Pages
- Students Pages

**Pending**

- All other pages (except Courses and Student Pages) need backend API integration
- Like Transaction, 

#### Website/Public Pages

 **Completed**

- Home Page
- Courses Page
- About Us
- Contact Us
- Gallery -> Image
- Gallery -> Video


**Pending**

**API Integration**
- All other pages (except Student Pages) need backend integration
- Courses Page and Gallery (Image & Video) currently use mock data need backend integration

- Terms and Condition Page (planned last phase)
- Refund Policy Page (planned last phase)

**Language Context (Priority)**
- Need to fetch info based on language selected (not required for Admin/Internal pages)

#### Authentication System
- Login Page (API not integrated yet)
- Logout (currently just a route, needs link and confirmation modal)
- Forgot Password and Reset Password (pending)

---

**Last Updated**: September 26, 2025
**Development Environment**: React 18 + Vite + TailwindCSS
**Current Version**: In Progress
