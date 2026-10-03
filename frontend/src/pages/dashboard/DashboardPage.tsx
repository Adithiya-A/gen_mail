import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
  Send,
  MoreVertical,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getGmailStatus } from '../../services/gmailService';

export const DashboardPage: React.FC = () => {
  const { user, stats, scheduledEmails, sentEmails, activities } = useEmailContext();

  const checkGmail = async () => {
    try {
      const result = await getGmailStatus();

      console.log('Gmail Status:', result);

    } catch (error) {
      console.error('Gmail status error:', error);
    }
  };

  const todaySchedule = [
    { time: '09:00 AM', title: 'Leave Request', recipient: 'professor@pec.edu.in' },
    { time: '11:00 AM', title: 'Project Update', recipient: 'team@company.com' },
    { time: '03:00 PM', title: 'Meeting Follow Up', recipient: 'mentor@pec.edu.in' },
    { time: '05:30 PM', title: 'Thank You', recipient: 'recruiter@abc.com' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

     <button onClick={checkGmail}> Check Gmail Status </button>

      {/* 1. Greeting & Daily Inspiration Quote */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13182E] tracking-tight flex items-center gap-2">
            <span>Good Morning, {user.name.split(' ')[0]}!</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Here's your email overview for today.
          </p>
        </div>

        {/* Motivational Banner Quote */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE]/70 to-[#F8F9FE] border border-purple-200/80 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-[#13182E] italic">
            "Smart emails today, bigger opportunities tomorrow."
          </span>
        </div>
      </div>

      {/* 2. 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Emails Sent */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#13182E]">{stats.emailsSent}</span>
              <p className="text-xs font-semibold text-[#64748B]">Emails Sent</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.emailsSentGrowth}%</span>
          </span>
        </div>

        {/* Metric 2: Scheduled */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#13182E]">{stats.scheduled}</span>
              <p className="text-xs font-semibold text-[#64748B]">Scheduled</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.scheduledGrowth}%</span>
          </span>
        </div>

        {/* Metric 3: Drafts */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#13182E]">{stats.drafts}</span>
              <p className="text-xs font-semibold text-[#64748B]">Drafts</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.draftsGrowth}%</span>
          </span>
        </div>

        {/* Metric 4: Time Saved */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#13182E]">{stats.timeSaved}</span>
              <p className="text-xs font-semibold text-[#64748B]">Time Saved</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.timeSavedGrowth}%</span>
          </span>
        </div>
      </div>

      {/* 3. Middle 2-Column Grid (Recent Activity & Today's Schedule) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Recent Activity */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                <h3 className="text-sm font-bold text-[#13182E]">Recent Activity</h3>
              </div>
              <Link
                to="/activity"
                className="text-xs font-bold text-[#635BFF] hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Activity Items */}
            <div className="flex flex-col gap-3.5 mt-4">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F8F9FE] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${act.iconBg} flex items-center justify-center flex-shrink-0`}>
                      {act.type === 'sent' && <Send className="w-4 h-4" />}
                      {act.type === 'scheduled' && <Calendar className="w-4 h-4" />}
                      {act.type === 'draft' && <FileText className="w-4 h-4" />}
                      {act.type === 'template' && <Sparkles className="w-4 h-4" />}
                      {act.type === 'opened' && <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#13182E]">{act.title}</h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{act.description}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#94A3B8] whitespace-nowrap ml-2">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Today's Schedule */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#635BFF]" />
                <h3 className="text-sm font-bold text-[#13182E]">Today's Schedule</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  <Calendar className="w-3 h-3 text-[#635BFF]" />
                  <span>Sat, 20 Sep 2026</span>
                </span>
                <Link
                  to="/scheduled"
                  className="text-xs font-bold text-[#635BFF] hover:underline"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Time Slot Items */}
            <div className="flex flex-col gap-3.5 mt-4">
              {todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F8F9FE] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="text-xs font-bold text-[#13182E] w-20">{item.time}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#13182E]">{item.title}</span>
                      <span className="text-[11px] text-[#64748B]">To: {item.recipient}</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom 2-Column Grid (Upcoming Scheduled Emails & Sent Emails) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Scheduled Emails Table */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-[#13182E]">Upcoming Scheduled Emails</h3>
            </div>
            <Link to="/scheduled" className="text-xs font-bold text-[#635BFF] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#94A3B8] font-semibold border-b border-slate-100">
                  <th className="pb-2.5">Subject</th>
                  <th className="pb-2.5">Recipient</th>
                  <th className="pb-2.5">Schedule Time</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {scheduledEmails.slice(0, 3).map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F9FE] transition-colors">
                    <td className="py-3 font-semibold text-[#13182E]">{item.subject}</td>
                    <td className="py-3 text-[#64748B]">{item.recipient}</td>
                    <td className="py-3 text-[#64748B]">{item.scheduledTime || `${item.date}, ${item.time}`}</td>
                    <td className="py-3 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sent Emails Table */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#635BFF]" />
              <h3 className="text-sm font-bold text-[#13182E]">Sent Emails</h3>
            </div>
            <Link to="/sent" className="text-xs font-bold text-[#635BFF] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#94A3B8] font-semibold border-b border-slate-100">
                  <th className="pb-2.5">Subject</th>
                  <th className="pb-2.5">Recipient</th>
                  <th className="pb-2.5">Sent Time</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sentEmails.slice(0, 3).map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F9FE] transition-colors">
                    <td className="py-3 font-semibold text-[#13182E]">{item.subject}</td>
                    <td className="py-3 text-[#64748B]">{item.recipient}</td>
                    <td className="py-3 text-[#64748B]">{item.sentTime || `${item.date}, ${item.time}`}</td>
                    <td className="py-3 text-right">
                      <StatusBadge status="sent" size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
