import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  FileText,
  Copy,
  Check,
  RotateCw,
  Edit3,
  ArrowRight,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const GeneratedEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDraft, generateEmailFromPrompt, isGeneratingAI, showToast } = useEmailContext();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `To: ${generatedDraft.to}\nSubject: ${generatedDraft.subject}\n\n${generatedDraft.body}`
    );
    setCopied(true);
    showToast('Copied to Clipboard', 'Email text copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    await generateEmailFromPrompt();
    showToast('Email Regenerated', 'Generated an updated version with AI.');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Main Container Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              AI Generated Email
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Here's your AI-generated email based on the extracted intent.
            </p>
          </div>
        </div>

        {/* Form Metadata Fields */}
        <div className="flex flex-col gap-3">
          {/* To Field */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="w-16 text-xs font-bold text-[#64748B]">To</span>
            <div className="flex-1 relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                readOnly
                value={generatedDraft.to}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#FAFBFF] text-[#13182E] rounded-xl border border-[#E8EBF8] focus:outline-none"
              />
            </div>
          </div>

          {/* Subject Field */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="w-16 text-xs font-bold text-[#64748B]">Subject</span>
            <div className="flex-1 relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                readOnly
                value={generatedDraft.subject}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#FAFBFF] text-[#13182E] rounded-xl border border-[#E8EBF8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email Body Card */}
        <div className="relative rounded-2xl border border-[#E8EBF8] bg-[#FAFBFF] p-6 sm:p-8">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white hover:bg-purple-50 text-[#64748B] hover:text-[#635BFF] border border-[#E8EBF8] transition-colors shadow-xs"
            title="Copy email text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Body Content */}
          <div className="whitespace-pre-wrap text-sm text-[#13182E] leading-relaxed font-normal pr-8">
            {generatedDraft.body}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isGeneratingAI}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-purple-50/50 text-xs font-semibold text-[#635BFF] transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => navigate('/review')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-purple-50/50 text-xs font-semibold text-[#635BFF] transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/schedule')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Proceed to Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
