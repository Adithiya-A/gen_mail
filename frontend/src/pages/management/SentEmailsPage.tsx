import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Calendar,
  Star,
  GraduationCap,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SentEmailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sentEmails } = useEmailContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = sentEmails.filter((item) => {
    return (
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getRowIcon = (type?: string) => {
    if (type === 'grad') return <GraduationCap className="w-4 h-4 text-emerald-600" />;
    if (type === 'doc') return <FileText className="w-4 h-4 text-pink-600" />;
    if (type === 'star') return <Star className="w-4 h-4 text-amber-500" />;
    if (type === 'team') return <Users className="w-4 h-4 text-purple-600" />;
    return <Calendar className="w-4 h-4 text-blue-600" />;
  };

  const getRowBg = (type?: string) => {
    if (type === 'grad') return 'bg-emerald-50';
    if (type === 'doc') return 'bg-pink-50';
    if (type === 'star') return 'bg-amber-50';
    if (type === 'team') return 'bg-purple-50';
    return 'bg-blue-50';
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
          <Send className="w-5 h-5 text-[#635BFF] transform rotate-[-20deg]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
            Sent Emails
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            View all your sent emails.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Search Bar & Filter Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sent emails..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8F9FE] focus:bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-[#E8EBF8] text-xs font-semibold text-[#13182E] cursor-pointer hover:border-purple-300 transition-colors">
              <Filter className="w-3.5 h-3.5 text-[#635BFF]" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-4"
              >
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="This month">This month</option>
                <option value="All time">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] font-semibold border-b border-slate-100">
                <th className="pb-3">Subject</th>
                <th className="pb-3">Recipient</th>
                <th className="pb-3 cursor-pointer select-none" onClick={() => setSortAsc(!sortAsc)}>
                  <div className="flex items-center gap-1 hover:text-[#635BFF]">
                    <span>Sent Time</span>
                    <span>{sortAsc ? '▲' : '▼'}</span>
                  </div>
                </th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
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
                  <td className="py-4 text-[#64748B] font-medium">
                    {item.sentTime || `${item.date}, ${item.time}`}
                  </td>
                  <td className="py-4">
                    <StatusBadge status="sent" size="sm" />
                  </td>
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

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-[#94A3B8]">
          <span>Showing 1 to {filtered.length} of {sentEmails.length} emails</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#635BFF] text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
