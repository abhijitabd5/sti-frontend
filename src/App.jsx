import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import '@/styles/globals.css';

import '@/components/charts/config/chartConfig';

// Import pages
import Dashboard from '@/pages/internal/Dashboard/Dashboard';
import Home from '@/pages/website/Home/Home';
import Login from '@/pages/auth/Login';
import Logout from '@/pages/auth/Logout';
import Courses from '@/pages/website/Courses/Courses';
import CourseDetails from '@/pages/website/Courses/CourseDetails';
import About from '@/pages/website/About/About';
import Images from '@/pages/website/Gallery/Images';
import Videos from '@/pages/website/Gallery/Videos';
import Contact from '@/pages/website/ContactUs/ContactUs';

// Import guards
import { AdminRoute } from '@/guards/ProtectedRoute';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery/images" element={<Images />} />
        <Route path="/gallery/videos" element={<Videos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;