import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "@/styles/globals.css";

import "@/components/charts/config/chartConfig";

// Import pages
import Dashboard from "@/pages/internal/Dashboard/Dashboard";
import Home from "@/pages/website/Home/Home";
import Login from "@/pages/auth/Login";
import Logout from "@/pages/auth/Logout";
import Courses from "@/pages/website/Courses/Courses";
import CourseDetails from "@/pages/website/Courses/CourseDetails";
import About from "@/pages/website/About/About";
import Images from "@/pages/website/Gallery/Images";
import Videos from "@/pages/website/Gallery/Videos";
import Contact from "@/pages/website/ContactUs/ContactUs";
import PrivacyPolicy from "@/pages/website/PrivacyPolicy";
import TermsAndConditions from "@/pages/website/TermsAndConditions";
import FAQ from "@/pages/website/FAQ";
import InternalCourses from "@/pages/internal/Courses/Courses";
import ViewCourse from "@/pages/internal/Courses/ViewCourse";
import CreateCourse from "@/pages/internal/Courses/CreateCourse";
import EditCourse from "@/pages/internal/Courses/EditCourse";
import AddCourseLanguage from "@/pages/internal/Courses/AddCourseLanguage";
import TransactionCategories from "@/pages/internal/TransactionCategories/TransactionCategories";
import Transactions from "@/pages/internal/Transactions/Transactions";
import AddEditTransaction from "@/pages/internal/Transactions/AddEditTransaction";
import ViewTransaction from "@/pages/internal/Transactions/ViewTransaction";
import Gallery from "@/pages/internal/Gallery/Gallery";
import OtherGallery from "@/pages/internal/Gallery/OtherGallery";
import StudentList from "@/pages/internal/Students/StudentList";
import StudentDetail from "@/pages/internal/Students/StudentDetail";
import EnrollmentForm from "@/pages/internal/Students/EnrollmentForm";
import StudentDocuments from "@/pages/internal/Students/StudentDocuments";
import Reviews from "@/pages/internal/Reviews/Reviews";
import Enquiries from "@/pages/internal/Enquiries/Enquiries";
import Profile from "@/pages/internal/Profile/Profile";
// import ExampleUsage from "@/components/ui/RichTextEditor/ExampleUsage";

// Import guards
import { AdminRoute } from "@/guards/ProtectedRoute";

function App() {
  const location = useLocation();

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
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/example-editor" element={<ExampleUsage />} /> */}

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="courses">
            <Route index element={<InternalCourses />} />
            <Route path="create" element={<CreateCourse />} />
            <Route path="view/:id" element={<ViewCourse />} />
            <Route path="edit/:id" element={<EditCourse />} />
            <Route path="add-language/:id" element={<AddCourseLanguage />} />
          </Route>

          <Route
            path="transaction-categories"
            element={<TransactionCategories />}
          />

          <Route path="transactions">
            <Route index element={<Transactions />} />
            <Route path="create" element={<AddEditTransaction />} />
            <Route path=":id" element={<ViewTransaction />} />
            <Route path="edit/:id" element={<AddEditTransaction />} />
          </Route>

          <Route path="gallery" element={<Gallery />} />
          <Route path="other-gallery" element={<OtherGallery />} />

          <Route path="students">
            <Route index element={<StudentList />} />
            <Route path="enroll" element={<EnrollmentForm />} />
            <Route path=":studentId" element={<StudentDetail />} />
            <Route path=":studentId/documents" element={<StudentDocuments />} />
            <Route path="edit/:enrollmentId" element={<EnrollmentForm />} />
          </Route>

          <Route path="reviews">
            <Route index element={<Reviews />} />
          </Route>

          <Route path="enquiries">
            <Route index element={<Enquiries />} />
          </Route>
          
          <Route path="profile">
            <Route index element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
