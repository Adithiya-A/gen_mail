import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Send,
  Mail,
  Volume2,
  Clock,
  MoreVertical,
  FileText,
  Users,
  Star,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EmailTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, trackingEmails } = useEmailContext();

  const [activeTab, setActiveTab] = useState<'all' | 'opened' | 'replied' | 'pending'>('all');

  const filtered = trackingEmails.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const getRowIcon = (type?: string) => {
    if (type === 'team') return <Users className="w-4 h-4 text-purple-600" />;
    if (type === 'star') return <Star className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-pink-600" />;
  };

  const getRowBg = (type?: string) => {
    if (type === 'team') return 'bg-purple-50';
    if (type === 'star') return 'bg-amber-50';
    return 'bg-pink-50';
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
            Email Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track the status of your emails.
          </p>
        </div>
      </div>

      {/* 4 Tracking Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Sent */}
        <div className="p-6 rounded-3xl bg-[#F8F9FE] border border-[#E8EBF8] shadow-card flex flex-col items-center text-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#635BFF] flex items-center justify-center">
            <Send className="w-5 h-5 transform rotate-[-20deg]" />
          </div>
          <span className="text-3xl font-extrabold text-[#635BFF]">{stats.tracking.sent}</span>
          <span className="text-xs font-bold text-[#64748B]">Sent</span>
        </div>

        {/* Opened */}
        <div className="p-6 rounded-3xl bg-[#F8F9FE] border border-[#E8EBF8] shadow-card flex flex-col items-center text-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-blue-600">{stats.tracking.opened}</span>
          <span className="text-xs font-bold text-[#64748B]">Opened</span>
        </div>

        {/* Replied */}
        <div className="p-6 rounded-3xl bg-[#F0FDF4] border border-emerald-100 shadow-card flex flex-col items-center text-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-600">{stats.tracking.replied}</span>
          <span className="text-xs font-bold text-emerald-700">Replied</span>
        </div>

        {/* Pending */}
        <div className="p-6 rounded-3xl bg-[#FFFBEB] border border-amber-100 shadow-card flex flex-col items-center text-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-amber-600">{stats.tracking.pending}</span>
          <span className="text-xs font-bold text-amber-700">Pending</span>
        </div>
      </div>

      {/* Main Tracking List Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#635BFF] text-white shadow-sm'
                : 'bg-slate-100 text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('opened')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'opened'
                ? 'bg-[#635BFF] text-white shadow-sm'
                : 'bg-slate-100 text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            Opened
          </button>
          <button
            onClick={() => setActiveTab('replied')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'replied'
                ? 'bg-[#635BFF] text-white shadow-sm'
                : 'bg-slate-100 text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            Replied
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-[#635BFF] text-white shadow-sm'
                : 'bg-slate-100 text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            Pending
          </button>
        </div>

        {/* Tracking Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] font-semibold border-b border-slate-100">
                <th className="pb-3">Subject</th>
                <th className="pb-3">Recipient</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Activity</th>
                <th className="pb-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/emails/${item.id}`)}
                  className="hover:bg-[#F8F9FE] transition-colors cursor-pointer group"
                >
                  <td className="py-4 font-bold text-[#13182E]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl ${getRowBg(
                          item.iconType
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        {getRowIcon(item.iconType)}
                      </div>
                      <span className="group-hover:text-[#635BFF] transition-colors">{item.subject}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#64748B] font-medium">{item.recipient}</td>
                  <td className="py-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-4 text-[#64748B] font-medium">{item.lastActivity}</td>
                  <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/emails/${item.id}`)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
