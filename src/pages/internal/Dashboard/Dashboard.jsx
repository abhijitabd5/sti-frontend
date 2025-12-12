import React from "react";

import AdminLayout from "@/components/common/Layouts/AdminLayout";

import DashboardStatsCards from "@/pages/internal/Dashboard/components/DashboardStatsCards";
import DashboardIncomeVsExpenses from "@/pages/internal/Dashboard/components/DashboardIncomeVsExpenses";
import DashboardIncomeExpensesByCategory from "@/pages/internal/Dashboard/components/DashboardIncomeExpensesByCategory";
import DashboardSocialTraffic from "@/pages/internal/Dashboard/components/DashboardSocialTraffic";
import DashboardStudentsPerState from "@/pages/internal/Dashboard/components/DashboardStudentsPerState";
import DashboardStudentsPerCourse from "@/pages/internal/Dashboard/components/DashboardStudentsPerCourse";



function Dashboard() {

  return (
    <AdminLayout>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Dashboard
        </h1>
      </div>

      {/* Dashboard Layout */}
      <div className="space-y-6">
        {/* Row 1: Stats Cards (Left) + Students per State Chart (Right) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Stats Cards */}
          <div className="col-span-12 lg:col-span-4 flex">
            <DashboardStatsCards />
          </div>
          
          {/* Right Side - Students per State Chart */}
          <div className="col-span-12 lg:col-span-8 flex">
            <DashboardStudentsPerState />
          </div>
        </div>

        {/* Row 2: Income vs Expenses Bar Chart - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <DashboardIncomeVsExpenses />
          </div>
        </div>

        {/* Row 3: Students per Course Chart - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <DashboardStudentsPerCourse />
          </div>
        </div>

        {/* Row 4: Social Traffic - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <DashboardSocialTraffic />
          </div>
        </div>

        {/* Row 4: Expenses by Category - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <DashboardIncomeExpensesByCategory />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
