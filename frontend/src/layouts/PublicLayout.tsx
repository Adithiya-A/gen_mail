import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { GenMailLogo } from '../components/common/GenMailLogo';
import { ToastContainer } from '../components/common/ToastContainer';
import { ArrowRight } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col justify-between text-[#13182E]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E8EBF8]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <GenMailLogo to="/" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === '/' && link.name === 'Home';
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#635BFF]'
                      : 'text-[#505A74] hover:text-[#13182E]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#635BFF] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="px-4 py-2 text-sm font-semibold text-[#505A74] hover:text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-white transition-all shadow-xs"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5346E0] rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-[#E8EBF8] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <GenMailLogo to="/" />
          <p className="text-xs text-[#94A3B8]">
            © 2026 GenMail. All rights reserved.
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
