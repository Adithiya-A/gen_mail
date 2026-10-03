import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Mail,
  Shield,
  Palette,
  Camera,
  Check,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useEmailContext();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'security' | 'appearance'>('profile');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, role, bio });
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User, to: '/settings' },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'gmail', label: 'Gmail Integration', icon: Mail, to: '/settings/gmail' },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your account and preferences.
          </p>
        </div>
      </div>

      {/* Main Grid: Sub-nav on left, Form on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Sidebar */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDirectActive = activeTab === item.id;

            if (item.to && item.id === 'gmail') {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-[#505A74] hover:bg-[#F4F2FF] hover:text-[#635BFF] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  isDirectActive
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'text-[#505A74] hover:bg-[#F4F2FF] hover:text-[#635BFF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* User Avatar & Header */}
            <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#7C3AED] text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {user.avatar || 'A'}
                </div>
                <button
                  type="button"
                  onClick={() => alert('Change profile photo!')}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white text-[#635BFF] border border-slate-200 shadow-sm hover:scale-110 transition-transform"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#13182E]">{name}</h3>
                <p className="text-xs text-[#64748B] mt-0.5">{email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Professional">Professional</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Executive">Executive</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
