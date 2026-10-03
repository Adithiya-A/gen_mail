import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Home,
  Mail,
  PenSquare,
  Calendar,
  Send,
  BarChart2,
  FileText,
  Users,
  Settings,
  History,
  HelpCircle,
  Sparkles,
  Crown,
  MoreVertical,
} from 'lucide-react';
import { GenMailLogo } from '../common/GenMailLogo';
import { useEmailContext } from '../../context/EmailContext';

export const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { user, inboxEmails } = useEmailContext();

  const unreadCount = inboxEmails.filter((i) => i.isUnread).length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/inbox', label: 'Inbox', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { to: '/compose', label: 'Compose with AI', icon: PenSquare },
    { to: '/scheduled', label: 'Scheduled', icon: Calendar },
    { to: '/sent', label: 'Sent', icon: Send },
    { to: '/tracking', label: 'Tracking', icon: BarChart2 },
    { to: '/templates', label: 'Templates', icon: FileText },
    { to: '/activity', label: 'Activity', icon: History },
    { to: '/contacts', label: 'Contacts', icon: Users },
    { to: '/help', label: 'Help & Guidance', icon: HelpCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isCompose = location.pathname.startsWith('/compose');
  const isInbox = location.pathname.startsWith('/inbox');

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#E8EBF8] flex flex-col justify-between p-4 flex-shrink-0">
      {/* Brand Header */}
      <div>
        <div className="px-2 pt-2 pb-5 border-b border-slate-100">
          <GenMailLogo to="/dashboard" />
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to === '/compose' && (location.pathname.startsWith('/intent') || location.pathname.startsWith('/generate') || location.pathname.startsWith('/review') || location.pathname.startsWith('/schedule'))) ||
              (item.to === '/templates' && location.pathname.startsWith('/templates')) ||
              (item.to === '/settings' && location.pathname.startsWith('/settings'));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: directActive }) => {
                  const active = directActive || isActive;
                  return `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    active
                      ? 'bg-[#635BFF] text-white shadow-sm font-semibold'
                      : 'text-[#505A74] hover:text-[#13182E] hover:bg-[#F4F2FF]'
                  }`;
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-[#635BFF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Banner & Profile Widget */}
      <div className="mt-6 flex flex-col gap-3">
        {isCompose ? (
          /* Upgrade to Pro Card (from Screenshot 5) */
          <div className="rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#F5F3FF] p-4 border border-amber-200/60 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-tight">
              Unlock more templates and advanced features.
            </p>
            <button
              onClick={() => alert('GenMail Pro plan upgrade unlocked for testing!')}
              className="mt-3 w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-xs font-semibold text-[#635BFF] rounded-xl border border-purple-200 shadow-xs transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        ) : isInbox ? (
          /* Inbox Specific Promo + User Bar (from Screenshot 20) */
          <div className="flex flex-col gap-2.5">
            <div className="rounded-2xl bg-[#F4F2FF] p-3.5 border border-purple-100/90 text-center relative overflow-hidden">
              <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center rounded-xl bg-white shadow-xs">
                <Mail className="w-5 h-5 text-[#635BFF]" />
              </div>
              <p className="text-xs font-semibold text-[#13182E] leading-snug">
                AI for your emails, <br />
                <span className="text-[#635BFF]">more time for what matters.</span>
              </p>
            </div>

            {/* Bottom User Card */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FE] transition-colors border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#7C3AED] text-white text-xs font-bold flex items-center justify-center">
                  {user.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#13182E]">{user.name}</span>
                  <span className="text-[10px] text-[#64748B]">{user.role}</span>
                </div>
              </div>
              <Link to="/settings" className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Default "Smarter Emails Brighter Opportunities" Card (from Screenshot 4) */
          <div className="rounded-2xl bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] p-4 border border-purple-200/60 relative overflow-hidden text-center shadow-xs">
            <span className="absolute -top-1 right-2 text-purple-300 text-xs">✦</span>
            <div className="w-10 h-10 mx-auto mb-1.5 flex items-center justify-center rounded-xl bg-white text-[#635BFF] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-handwritten text-xl font-bold text-[#635BFF] leading-tight">
              Smarter Emails <br />
              <span className="text-[#7C3AED]">Brighter Opportunities</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
