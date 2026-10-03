import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Tag,
  Mail,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  CornerUpRight,
  Sparkles,
  Download,
  FileText,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { GoogleLogo } from '../../components/illustrations/FeatureIllustrations';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    inboxEmails,
    selectedInboxEmail,
    setSelectedInboxEmail,
    toggleStarInbox,
    toggleReadInbox,
    deleteInboxEmail,
    syncInbox,
    isSyncing,
    setPromptConfig,
    showToast,
  } = useEmailContext();

  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Starred' | 'Important'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = inboxEmails.filter((email) => {
    const matchesSearch =
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'Unread') return email.isUnread;
    if (filterTab === 'Starred') return email.isStarred;
    if (filterTab === 'Important') return email.isImportant;
    return true;
  });

  const selectedEmail = selectedInboxEmail || filtered[0] || inboxEmails[0];

  const handleSelectEmail = (email: typeof inboxEmails[0]) => {
    setSelectedInboxEmail(email);
    if (email.isUnread) {
      toggleReadInbox(email.id);
    }
  };

  const handleReplyWithAI = () => {
    if (!selectedEmail) return;
    setPromptConfig({
      promptText: `Reply to ${selectedEmail.sender}'s email regarding "${selectedEmail.subject}": Confirming I have reviewed the requirements and will send the revised version before tomorrow morning.`,
      tone: 'Professional',
      length: 'Medium',
      purpose: 'Update',
    });
    showToast('AI Reply Initialized', `Drafting response to ${selectedEmail.sender}...`);
    navigate('/compose');
  };

  const handleDownloadAttachment = (filename: string) => {
    showToast('Downloaded File', `Saved ${filename} to downloads.`);
  };

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-10">
      {/* Top Sync & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
            Inbox
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            View and manage the emails in your connected Gmail account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={syncInbox}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8EBF8] bg-white hover:bg-slate-50 text-xs font-semibold text-[#13182E] shadow-xs transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#635BFF] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <span className="text-xs text-[#94A3B8]">Last synced: Today, 10:32 AM</span>
        </div>
      </div>

      {/* Main Dual-Pane Inbox Container */}
      <div className="bg-white rounded-3xl border border-[#E8EBF8] shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT PANE: Email List (5 cols on lg) */}
        <div className="lg:col-span-5 border-r border-[#E8EBF8] flex flex-col justify-between">
          <div>
            {/* Filter Tabs Header */}
            <div className="p-3 border-b border-[#E8EBF8] flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                {(['All', 'Unread', 'Starred', 'Important'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                      filterTab === tab
                        ? 'text-[#635BFF] bg-purple-50'
                        : 'text-[#64748B] hover:text-[#13182E] hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Email List Items */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filtered.map((item) => {
                const isSelected = selectedEmail?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectEmail(item)}
                    className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#F4F2FF] border-l-4 border-[#635BFF]'
                        : item.isUnread
                        ? 'bg-purple-50/20 hover:bg-[#F8F9FE]'
                        : 'hover:bg-[#F8F9FE]'
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((i) => i !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      className="mt-1 w-3.5 h-3.5 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
                    />

                    {/* Sender Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full ${
                        item.avatarBg || 'bg-purple-100 text-[#635BFF]'
                      } text-xs font-bold flex items-center justify-center flex-shrink-0`}
                    >
                      {item.sender === 'Google' ? (
                        <GoogleLogo className="w-4 h-4" />
                      ) : (
                        item.avatarText || item.sender[0]
                      )}
                    </div>

                    {/* Content Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold truncate ${
                            item.isUnread ? 'text-[#13182E]' : 'text-slate-700'
                          }`}
                        >
                          {item.sender}
                        </span>
                        <span className="text-[10.5px] text-[#94A3B8] flex-shrink-0">
                          {item.time || item.date}
                        </span>
                      </div>
                      <h4
                        className={`text-xs truncate ${
                          item.isUnread ? 'font-bold text-[#13182E]' : 'font-semibold text-slate-800'
                        }`}
                      >
                        {item.subject}
                      </h4>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5 leading-tight">
                        {item.snippet}
                      </p>
                    </div>

                    {/* Star Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarInbox(item.id);
                      }}
                      className="mt-1 text-slate-300 hover:text-amber-400 p-0.5 transition-colors"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          item.isStarred ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Email Reader / Detail (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-white">
          {selectedEmail ? (
            <div className="flex flex-col gap-6">
              {/* Top Quick Actions Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    onClick={() => deleteInboxEmail(selectedEmail.id)}
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteInboxEmail(selectedEmail.id)}
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors" title="Label">
                    <Tag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleReadInbox(selectedEmail.id)}
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                    title="Mark Unread"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors" title="Snooze">
                    <Clock className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors" title="More">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <span>1 of 50</span>
                  <div className="flex items-center gap-0.5">
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Subject Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-[#13182E]">
                    {selectedEmail.subject}
                  </h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-[#505A74] text-[11px] font-semibold rounded-md">
                    Inbox ✕
                  </span>
                </div>

                <button
                  onClick={() => toggleStarInbox(selectedEmail.id)}
                  className="text-slate-300 hover:text-amber-400 p-1"
                >
                  <Star
                    className={`w-5 h-5 ${
                      selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Sender Details Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      selectedEmail.avatarBg || 'bg-purple-100 text-[#635BFF]'
                    } text-sm font-bold flex items-center justify-center`}
                  >
                    {selectedEmail.sender === 'Google' ? (
                      <GoogleLogo className="w-5 h-5" />
                    ) : (
                      selectedEmail.avatarText || selectedEmail.sender[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#13182E]">
                        {selectedEmail.sender}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        &lt;{selectedEmail.senderEmail}&gt;
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">to me ⌄</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8] hidden sm:inline">
                    {selectedEmail.fullDate || selectedEmail.date}
                  </span>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                    <CornerUpLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                    <CornerUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Email Content Body */}
              <div
                className="text-xs sm:text-sm text-[#13182E] leading-relaxed font-normal min-h-[140px] [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-[#635BFF] [&>a]:underline"
                dangerouslySetInnerHTML={{
                  __html: selectedEmail.body.includes('<')
                    ? selectedEmail.body
                    : selectedEmail.body.replace(/\n/g, '<br/>'),
                }}
              />

              {/* Attachment Card (if present) */}
              {selectedEmail.attachment && (
                <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>1 attachment • Scanned by Gmail</span>
                    <span className="text-slate-400">ⓘ</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8EBF8] shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-bold text-[10px] flex items-center justify-center border border-rose-100">
                        PDF
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#13182E]">
                          {selectedEmail.attachment.name}
                        </p>
                        <p className="text-[10px] text-[#94A3B8]">
                          {selectedEmail.attachment.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownloadAttachment(selectedEmail.attachment!.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#635BFF] hover:bg-purple-50 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reply CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert('Standard reply box opened!')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-[#505A74] rounded-xl border border-[#E8EBF8] transition-colors"
                >
                  <CornerUpLeft className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Forward box opened!')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-[#505A74] rounded-xl border border-[#E8EBF8] transition-colors"
                >
                  <CornerUpRight className="w-3.5 h-3.5" />
                  <span>Forward</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplyWithAI}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#635BFF] hover:bg-[#5346E0] text-white text-xs font-bold rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5 ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reply with AI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8 text-[#94A3B8]">
              Select an email to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
