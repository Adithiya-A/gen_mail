import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  GraduationCap,
  Star,
  Trash2,
  Edit2,
  Eye,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ScheduledEmailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { scheduledEmails, deleteScheduledEmail } = useEmailContext();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  const filtered = scheduledEmails.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'today') {
      return item.scheduledTime?.toLowerCase().includes('today') || item.date?.toLowerCase().includes('today');
    }
    if (activeTab === 'week') {
      return true;
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getRowIcon = (type?: string) => {
    if (type === 'grad') return <GraduationCap className="w-4 h-4 text-emerald-600" />;
    if (type === 'doc') return <FileText className="w-4 h-4 text-blue-600" />;
    if (type === 'star') return <Star className="w-4 h-4 text-amber-500" />;
    return <Users className="w-4 h-4 text-pink-600" />;
  };

  const getRowBg = (type?: string) => {
    if (type === 'grad') return 'bg-emerald-50';
    if (type === 'doc') return 'bg-blue-50';
    if (type === 'star') return 'bg-amber-50';
    return 'bg-pink-50';
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Scheduled Emails
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              View and manage your upcoming emails.
            </p>
          </div>
        </div>

        <Link
          to="/compose"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Email</span>
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'all'
                  ? 'bg-purple-50 text-[#635BFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#13182E] hover:bg-slate-50'
              }`}
            >
              All ({scheduledEmails.length})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'today'
                  ? 'bg-purple-50 text-[#635BFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#13182E] hover:bg-slate-50'
              }`}
            >
              Today (1)
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'week'
                  ? 'bg-purple-50 text-[#635BFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#13182E] hover:bg-slate-50'
              }`}
            >
              This Week (3)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheduled emails..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8F9FE] focus:bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] font-semibold border-b border-slate-100">
                <th className="pb-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
                  />
                </th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Recipient</th>
                <th className="pb-3">Scheduled Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#F8F9FE] transition-colors group cursor-pointer ${
                      isSelected ? 'bg-purple-50/40' : ''
                    }`}
                  >
                    <td className="py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        className="w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
                      />
                    </td>
                    <td
                      className="py-4 font-bold text-[#13182E]"
                      onClick={() => navigate(`/emails/${item.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl ${getRowBg(
                            item.iconType
                          )} flex items-center justify-center flex-shrink-0`}
                        >
                          {getRowIcon(item.iconType)}
                        </div>
                        <span className="hover:text-[#635BFF] transition-colors">{item.subject}</span>
                      </div>
                    </td>
                    <td
                      className="py-4 text-[#64748B] font-medium"
                      onClick={() => navigate(`/emails/${item.id}`)}
                    >
                      {item.recipient}
                    </td>
                    <td
                      className="py-4 text-[#64748B] font-medium"
                      onClick={() => navigate(`/emails/${item.id}`)}
                    >
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.scheduledTime || `${item.date}, ${item.time}`}</span>
                      </div>
                    </td>
                    <td className="py-4" onClick={() => navigate(`/emails/${item.id}`)}>
                      <StatusBadge status="scheduled" size="sm" />
                    </td>
                    <td
                      className="py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            if (activeMenuId === item.id) {
                              setActiveMenuId(null);
                              return;
                            }

                            const rect = e.currentTarget.getBoundingClientRect();

                            const menuWidth = 160;
                            const menuHeight = 130;
                            const spacing = 6;

                            let left = rect.right - menuWidth;
                            let top = rect.bottom + spacing;

                            // Keep menu inside the viewport horizontally
                            if (left < 8) {
                              left = 8;
                            }

                            if (left + menuWidth > window.innerWidth - 8) {
                              left = window.innerWidth - menuWidth - 8;
                            }

                            // If there isn't enough space below,
                            // open it upward.
                            if (top + menuHeight > window.innerHeight - 8) {
                              top = rect.top - menuHeight - spacing;
                            }

                            // Prevent it from going above the viewport
                            if (top < 8) {
                              top = 8;
                            }

                            setMenuPosition({
                              top,
                              left,
                            });

                            setActiveMenuId(item.id);
                          }}
                          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-full mb-3 w-40 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-1 z-50 flex flex-col gap-0.5 text-left animate-in fade-in zoom-in-95 duration-100">

                            {/* Edit */}
                            <button
                              onClick={() => {
                                navigate('/review', {
                                  state: {
                                    draftId: item.id,
                                    scheduledAt: item.scheduledAt,
                                    draft: {
                                      to: item.recipient,
                                      subject: item.subject,
                                      body: item.body,
                                    },
                                  },
                                });

                                setActiveMenuId(null);
                              }}
                              className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* View Details */}
                            <button
                              onClick={() => {
                                navigate(`/emails/${item.id}`);
                                setActiveMenuId(null);
                              }}
                              className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Details</span>
                            </button>

                            {/* Cancel Send */}
                            <button
                              onClick={async () => {
                                try {
                                  await deleteScheduledEmail(item.id);
                                } finally {
                                  setActiveMenuId(null);
                                }
                              }}
                              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Cancel Send</span>
                            </button>

                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {activeMenuId &&
            createPortal(
              (() => {
                const item = scheduledEmails.find(
                  (email) => email.id === activeMenuId
                );

                if (!item) return null;

                return (
                  <div
                    className="fixed w-40 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-1 z-[9999] flex flex-col gap-0.5 text-left animate-in fade-in zoom-in-95 duration-100"
                    style={{
                      top: `${menuPosition.top}px`,
                      left: `${menuPosition.left}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Edit */}
                    <button
                      onClick={() => {
                        navigate('/review', {
                          state: {
                            draftId: item.id,
                            scheduledAt: item.scheduledAt,
                            draft: {
                              to: item.recipient,
                              subject: item.subject,
                              body: item.body,
                            },
                          },
                        });

                        setActiveMenuId(null);
                      }}
                      className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => {
                        navigate(`/emails/${item.id}`);
                        setActiveMenuId(null);
                      }}
                      className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Details</span>
                    </button>

                    {/* Cancel Send */}
                    <button
                      onClick={async () => {
                        try {
                          await deleteScheduledEmail(item.id);
                        } finally {
                          setActiveMenuId(null);
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Cancel Send</span>
                    </button>
                  </div>
                );
              })(),
              document.body
            )}
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-[#94A3B8]">
          <span>Showing 1 to {filtered.length} of {scheduledEmails.length} emails</span>
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
