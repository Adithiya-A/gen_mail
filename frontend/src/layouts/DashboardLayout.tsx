import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { ToastContainer } from '../components/common/ToastContainer';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE] text-[#13182E]">
      {/* Fixed Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
