import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Check, Sparkles } from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const DashboardHeader: React.FC = () => {
  const { user } = useEmailContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: '1', title: 'Email Delivered', text: 'Project Update to team@company.com was delivered.', time: '10 mins ago', unread: true },
    { id: '2', title: 'Email Opened', text: 'Meeting Invitation was opened by Dr. Sharma.', time: '1 hr ago', unread: true },
    { id: '3', title: 'Upcoming Send', text: 'Leave Request scheduled to send tomorrow at 9:00 AM.', time: '2 hrs ago', unread: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inbox?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-[#E8EBF8]">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails, templates, or contacts..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8F9FE] hover:bg-[#F1F3FB] focus:bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-transparent focus:border-[#635BFF] focus:outline-none transition-all"
          />
        </div>
      </form>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-[#64748B] hover:text-[#13182E] hover:bg-[#F4F2FF] transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                <span className="text-sm font-bold text-[#13182E]">Notifications</span>
                <span className="text-xs text-[#635BFF] font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-[#F8F9FE] transition-colors cursor-pointer border border-transparent hover:border-[#E8EBF8]">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-[#13182E]">{n.title}</h5>
                      <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-[#F4F2FF] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#7C3AED] text-white text-sm font-bold flex items-center justify-center shadow-sm">
              {user.avatar || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-[#13182E]">Hi, {user.name.split(' ')[0]}!</span>
              <span className="text-[11px] text-[#64748B] -mt-0.5">{user.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-[#13182E]">{user.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
              </div>
              <div className="py-1 flex flex-col gap-0.5">
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#505A74] hover:text-[#635BFF] hover:bg-[#F4F2FF] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile & Settings</span>
                </Link>
                <Link
                  to="/settings/gmail"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#505A74] hover:text-[#635BFF] hover:bg-[#F4F2FF] rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gmail Integration</span>
                </Link>
                <Link
                  to="/help"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#505A74] hover:text-[#635BFF] hover:bg-[#F4F2FF] rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Help & Guidance</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <Link
                  to="/signin"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
