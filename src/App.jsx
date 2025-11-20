import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "@/styles/globals.css";

import "@/components/charts/config/chartConfig";
import seoApi from "@/services/api/seoApi";

// Import public pages (eager loading)
import Home from "@/pages/website/Home/Home";
import Login from "@/pages/auth/Login";
import Logout from "@/pages/auth/Logout";
import Courses from "@/pages/website/Courses/Courses";
import CourseDetails from "@/pages/website/Courses/CourseDetails";
import About from "@/pages/website/About/About";
import Images from "@/pages/website/Gallery/Images";
import Videos from "@/pages/website/Gallery/Videos";
import Contact from "@/pages/website/ContactUs/ContactUs";
import PrivacyPolicy from "@/pages/website/Legal/PrivacyPolicy";
import TermsAndConditions from "@/pages/website/Legal/TermsAndConditions";
import FAQ from "@/pages/website/Legal/FAQ";
import Certificate from "@/pages/website/Certificate/Certificate";

// Import lazy admin wrapper (lazy loading)
import LazyAdminWrapper from "@/components/common/LazyAdminWrapper";

// import ExampleUsage from "@/components/ui/RichTextEditor/ExampleUsage";

function App() {
  const location = useLocation();

  // Initialize SEO system
  useEffect(() => {
    // Preload critical SEO pages for better performance
    seoApi.preloadCriticalPages('en');
    console.log('SEO system initialized');
  }, []);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery/images" element={<Images />} />
        <Route path="/gallery/videos" element={<Videos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/example-editor" element={<ExampleUsage />} /> */}

        {/* Protected Admin Routes - Lazy Loaded */}
        <Route path="/admin/*" element={<LazyAdminWrapper />} />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
