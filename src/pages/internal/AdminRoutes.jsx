import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all admin pages
import Dashboard from '@/pages/internal/Dashboard/Dashboard';
import InternalCourses from '@/pages/internal/Courses/Courses';
import ViewCourse from '@/pages/internal/Courses/ViewCourse';
import CreateCourse from '@/pages/internal/Courses/CreateCourse';
import EditCourse from '@/pages/internal/Courses/EditCourse';
import AddCourseLanguage from '@/pages/internal/Courses/AddCourseLanguage';
import TransactionCategories from '@/pages/internal/TransactionCategories/TransactionCategories';
import Transactions from '@/pages/internal/Transactions/Transactions';
import AddEditTransaction from '@/pages/internal/Transactions/AddEditTransaction';
import ViewTransaction from '@/pages/internal/Transactions/ViewTransaction';
import Gallery from '@/pages/internal/Gallery/Gallery';
import OtherGallery from '@/pages/internal/Gallery/OtherGallery';
import StudentList from '@/pages/internal/Students/StudentList';
import StudentDetail from '@/pages/internal/Students/StudentDetail';
import EnrollmentForm from '@/pages/internal/Students/EnrollmentForm';
import StudentDocuments from '@/pages/internal/Students/StudentDocuments';
import Reviews from '@/pages/internal/Reviews/Reviews';
import OnlineEnquiries from '@/pages/internal/Enquiries/OnlineEnquiries';
import OfflineEnquiries from '@/pages/internal/Enquiries/OfflineEnquiries';
import Profile from '@/pages/internal/Profile/Profile';
import Partners from '@/pages/internal/Promotion/Partners/Partners';
import CreatePartner from '@/pages/internal/Promotion/Partners/CreatePartner';
import EditPartner from '@/pages/internal/Promotion/Partners/EditPartner';
import ViewPartner from '@/pages/internal/Promotion/Partners/ViewPartner';
import Posts from '@/pages/internal/Promotion/Posts/Posts';
import CreatePost from '@/pages/internal/Promotion/Posts/CreatePost';
import EditPost from '@/pages/internal/Promotion/Posts/EditPost';
import ViewPost from '@/pages/internal/Promotion/Posts/ViewPost';
import CreateLink from '@/pages/internal/Promotion/Links/CreateLink';
import Pages from '@/pages/internal/Pages/Pages';
import CreatePage from '@/pages/internal/Pages/CreatePage';
import EditPage from '@/pages/internal/Pages/EditPage';
import ViewPage from '@/pages/internal/Pages/ViewPage';
import PromotionReports from '@/pages/internal/Reports/PromotionReports';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />

      <Route path="courses">
        <Route index element={<InternalCourses />} />
        <Route path="create" element={<CreateCourse />} />
        <Route path="view/:id" element={<ViewCourse />} />
        <Route path="edit/:id" element={<EditCourse />} />
        <Route path="add-language/:id" element={<AddCourseLanguage />} />
      </Route>

      <Route path="pages">
        <Route index element={<Pages />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="view/:id" element={<ViewPage />} />
        <Route path="edit/:id" element={<EditPage />} />
      </Route>

      <Route
        path="settings/transaction-categories"
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
        <Route index element={<OnlineEnquiries />} />
      </Route>

      <Route path="offline-enquiries">
        <Route index element={<OfflineEnquiries />} />
      </Route>
      
      <Route path="profile">
        <Route index element={<Profile />} />
      </Route>

      <Route path="promotion">
        <Route path="partners">
          <Route index element={<Partners />} />
          <Route path="create" element={<CreatePartner />} />
          <Route path=":id" element={<ViewPartner />} />
          <Route path=":id/edit" element={<EditPartner />} />
        </Route>
        
        <Route path="posts">
          <Route index element={<Posts />} />
          <Route path="create" element={<CreatePost />} />
          <Route path=":id" element={<ViewPost />} />
          <Route path=":id/edit" element={<EditPost />} />
        </Route>
        
        <Route path="links">
          <Route path="create" element={<CreateLink />} />
        </Route>
      </Route>

      <Route path="reports">
        <Route path="promotion-analytics" element={<PromotionReports />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;