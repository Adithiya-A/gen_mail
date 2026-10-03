import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from '../components/common/ToastContainer';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#EDE9FE]/50 to-[#F5F3FF] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Centered Main Card Container */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </div>

      {/* Auth Legal Footer */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8] pt-4">
        <span>© 2026 GenMail. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/help" className="hover:text-[#635BFF] transition-colors">Privacy</Link>
          <span>|</span>
          <Link to="/help" className="hover:text-[#635BFF] transition-colors">Terms</Link>
          <span>|</span>
          <Link to="/help" className="hover:text-[#635BFF] transition-colors">Help</Link>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
