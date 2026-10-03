import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Send,
  User,
  FileText,
  ChevronLeft,
  Bookmark,
  ArrowRight,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { RichTextEditor } from '../../components/email/RichTextEditor';

export const ReviewEditPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    generatedDraft,
    setGeneratedDraft,
    addTemplate,
    completeScheduleOrSend,
    setScheduleConfig,
    showToast,
  } = useEmailContext();

  const [to, setTo] = useState(generatedDraft.to);
  const [subject, setSubject] = useState(generatedDraft.subject);
  const [body, setBody] = useState(generatedDraft.body);

  const handleSaveAsTemplate = () => {
    addTemplate({
      name: subject.replace('Request for Leave Tomorrow', 'Leave Request') || 'Custom Template',
      subject: subject,
      description: 'Custom saved template from review & edit',
      category: 'Academic',
      body: body,
      iconBg: 'bg-purple-100 text-[#635BFF]',
    });
  };

  const handleInstantSend = async () => {
    setGeneratedDraft({ to, subject, body });
    setScheduleConfig((prev) => ({ ...prev, sendType: 'now' }));
    await completeScheduleOrSend();
    navigate('/sent');
  };

  const handleContinue = () => {
    setGeneratedDraft({ to, subject, body });
    navigate('/schedule');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Main Container Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <Send className="w-5 h-5 text-[#635BFF] transform rotate-[-20deg]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Review & Edit
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Make any changes before scheduling or sending.
            </p>
          </div>
        </div>

        {/* Inputs (To & Subject) */}
        <div className="flex flex-col gap-3">
          {/* To */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="w-16 text-xs font-bold text-[#64748B]">To</span>
            <div className="flex-1 relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#FAFBFF] focus:bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="w-16 text-xs font-bold text-[#64748B]">Subject</span>
            <div className="flex-1 relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#FAFBFF] focus:bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor
          value={body}
          onChange={setBody}
          showSendButton={true}
          onSend={handleInstantSend}
          maxChars={2000}
        />

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 text-xs font-semibold text-[#505A74] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#635BFF]" />
              <span>Back</span>
            </Link>

            <button
              onClick={handleSaveAsTemplate}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-purple-50/50 text-xs font-semibold text-[#635BFF] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save as Template</span>
            </button>
          </div>

          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
