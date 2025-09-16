import React, { useState } from 'react';
import AdminSidebar from '@/components/common/SideBar/AdminSideBar';
import AdminHeader from '@/components/common/Header/AdminHeader';
import AdminFooter from '@/components/common/Footer/AdminFooter';
// import Banner from '@/components/common/Banner/Banner';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />

        {/* Banner */}
        {/* <Banner /> */}
      </div>
    </div>
  );
}

export default AdminLayout;
