import React, { useState } from 'react';
import {
  History,
  Send,
  Eye,
  FileText,
  Clock,
  Sparkles,
  MoreVertical,
  Filter,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const ActivityHistoryPage: React.FC = () => {
  const { activities } = useEmailContext();

  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('Last 30 days');

  const filtered = activities.filter((act) => {
    if (typeFilter === 'all') return true;
    return act.type === typeFilter;
  });

  const getIcon = (type: string) => {
    if (type === 'sent') return <Send className="w-5 h-5 text-emerald-600" />;
    if (type === 'opened') return <Eye className="w-5 h-5 text-blue-600" />;
    if (type === 'draft') return <FileText className="w-5 h-5 text-amber-600" />;
    if (type === 'scheduled') return <Clock className="w-5 h-5 text-purple-600" />;
    return <Sparkles className="w-5 h-5 text-rose-600" />;
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Activity / History
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              A log of all your email activities.
            </p>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5">
          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-200 focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer pr-7 shadow-xs"
            >
              <option value="all">All Activities</option>
              <option value="sent">Email sent</option>
              <option value="opened">Email opened</option>
              <option value="scheduled">Email scheduled</option>
              <option value="draft">Draft saved</option>
              <option value="template">Template created</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
          </div>

          {/* Time Filter */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-200 focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer pr-7 shadow-xs"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Today">Today</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* Main Activity Cards Container */}
      <div className="flex flex-col gap-3">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-5 rounded-3xl bg-white border border-[#E8EBF8] hover:border-purple-200 hover:shadow-card transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${act.iconBg} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                {getIcon(act.type)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#13182E]">{act.title}</h4>
                <p className="text-xs text-[#64748B] mt-0.5">{act.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#94A3B8]">{act.timestamp}</span>
              <button className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
