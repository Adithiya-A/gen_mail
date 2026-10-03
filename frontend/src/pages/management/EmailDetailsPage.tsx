import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  ChevronLeft,
  MoreVertical,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EmailDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scheduledEmails, sentEmails, trackingEmails, inboxEmails, deleteScheduledEmail, showToast } =
    useEmailContext();

  const [activeTab, setActiveTab] = useState<'content' | 'activity'>('content');
  const [showMenu, setShowMenu] = useState(false);

  // Find email across collections
  const allEmails = [...scheduledEmails, ...sentEmails, ...trackingEmails, ...inboxEmails];
  const email = allEmails.find((e) => e.id === id) || scheduledEmails[0] || sentEmails[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(email.body);
    showToast('Copied', 'Email body copied to clipboard.');
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteScheduledEmail(email.id);
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Main Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 flex items-center justify-center text-[#505A74] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#635BFF]" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
                Email Details
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                View complete details of the email.
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-1 z-30 flex flex-col gap-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Body</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Key-Value Grid Card */}
        <div className="p-6 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
          <div>
            <span className="text-[#94A3B8] font-medium block mb-1">Subject</span>
            <span className="text-sm font-bold text-[#13182E]">{email.subject}</span>
          </div>

          <div>
            <span className="text-[#94A3B8] font-medium block mb-1">Recipient</span>
            <span className="font-semibold text-[#505A74]">{email.recipient || email.senderEmail}</span>
          </div>

          <div>
            <span className="text-[#94A3B8] font-medium block mb-1">Type</span>
            <span className="font-semibold text-[#505A74]">{email.type || 'Automated Email'}</span>
          </div>

          <div>
            <span className="text-[#94A3B8] font-medium block mb-1">
              {email.status === 'scheduled' ? 'Scheduled Time' : 'Sent Time'}
            </span>
            <span className="font-semibold text-[#505A74]">
              {email.scheduledTime || email.sentTime || `${email.date}, ${email.time}`}
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[#94A3B8] font-medium">Status</span>
            <StatusBadge status={email.status} size="sm" />
          </div>
        </div>

        {/* Tabs (Email Content vs Activity Log) */}
        <div>
          <div className="flex items-center gap-6 border-b border-slate-100 pb-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`text-xs font-bold transition-all relative pb-2 -mb-2 ${
                activeTab === 'content'
                  ? 'text-[#635BFF] border-b-2 border-[#635BFF]'
                  : 'text-[#64748B] hover:text-[#13182E]'
              }`}
            >
              Email Content
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`text-xs font-bold transition-all relative pb-2 -mb-2 ${
                activeTab === 'activity'
                  ? 'text-[#635BFF] border-b-2 border-[#635BFF]'
                  : 'text-[#64748B] hover:text-[#13182E]'
              }`}
            >
              Activity Log
            </button>
          </div>

          {/* Content Pane */}
          {activeTab === 'content' ? (
            <div
              className="mt-4 p-6 rounded-2xl bg-white border border-[#E8EBF8] text-sm text-[#13182E] leading-relaxed font-normal [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-[#635BFF] [&>a]:underline"
              dangerouslySetInnerHTML={{
                __html: email.body.includes('<') ? email.body : email.body.replace(/\n/g, '<br/>'),
              }}
            />
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-xs text-[#505A74]">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                <span>Email created via Gemini AI flow</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-xs text-[#505A74]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified with connected Gmail OAuth 2.0</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
