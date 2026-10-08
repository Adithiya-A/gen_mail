import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Play,
  User,
  FileText,
  Target,
  Paperclip,
  ArrowRight,
  Mail,
  Calendar,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { extractEmailIntent } from '../../services/emailService';

export const ComposePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    promptConfig,
    setPromptConfig,
    setGeneratedDraft,
    generateEmailFromPrompt,
    isGeneratingAI,
  } = useEmailContext();

  const [promptText, setPromptText] = useState(promptConfig.promptText);
  const [tone, setTone] = useState(promptConfig.tone);
  const [length, setLength] = useState(promptConfig.length);
  const [purpose, setPurpose] = useState(promptConfig.purpose);
  const [attachment, setAttachment] = useState<string | null>(promptConfig.attachmentName || null);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    size: number;
    type?: string;
    data: string;
  } | null>(null);

  const suggestedPrompts = [
    {
      id: 'leave',
      label: 'Request leave',
      icon: Mail,
      text: 'Write an email to my professor requesting permission for leave tomorrow due to health issues.',
      tone: 'Professional',
      purpose: 'Request',
    },
    {
      id: 'meeting',
      label: 'Schedule a meeting',
      icon: Calendar,
      text: 'Draft an invitation to schedule a sprint review meeting with the project team tomorrow at 10 AM.',
      tone: 'Professional',
      purpose: 'Meeting',
    },
    {
      id: 'followup',
      label: 'Follow up',
      icon: Users,
      text: 'Write a polite follow up email to the HR team inquiring about my interview results for the software role.',
      tone: 'Formal',
      purpose: 'Follow Up',
    },
    {
      id: 'update',
      label: 'Project update',
      icon: FileText,
      text: 'Write a comprehensive weekly project progress report to team members highlighting milestone completion.',
      tone: 'Professional',
      purpose: 'Update',
    },
  ];

  const handleSelectSuggested = (item: typeof suggestedPrompts[0]) => {
    setPromptText(item.text);
    setTone(item.tone);
    setPurpose(item.purpose);
  };

const handleGenerate = async () => {
  if (!promptText.trim()) {
    alert('Please enter an email prompt.');
    return;
  }

  setPromptConfig({
    promptText,
    tone,
    length,
    purpose,
    attachmentName: attachment || '',
  });

  try {
    const extractedIntent = await extractEmailIntent({
      prompt: promptText,
      tone,
      length,
      purpose,
    });

    console.log(
      'Gemini extracted intent:',
      extractedIntent
    );

    navigate('/intent', {
      state: {
        intent: extractedIntent,
        originalPrompt: promptText,
      },
    });
  } catch (error) {
    console.error(
      'Intent extraction failed:',
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : 'Failed to understand your email request. Please try again.'
    );
  }
};

  const handleAttachSim = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: any) => {
      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result;

        if (typeof data !== 'string') {
          return;
        }

        const newAttachment = {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          data,
        };

        setAttachment(file.name);
        setSelectedAttachment(newAttachment);

        setGeneratedDraft((prev) => ({
          ...prev,
          attachments: [newAttachment],
        }));
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Main Compose Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
                Compose with <span className="text-[#635BFF]">AI</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Just type what you want to say, and GenMail will draft a professional email for you.
              </p>
            </div>
          </div>

          <Link
            to="/help"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#635BFF] text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>How it works?</span>
          </Link>
        </div>

        {/* Big Prompt Textarea Card */}
        <div className="relative rounded-2xl border border-[#E8EBF8] bg-[#FAFBFF] focus-within:bg-white focus-within:border-[#635BFF] focus-within:shadow-xs transition-all p-4">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="Type your email request in natural language (e.g. Write an email to my professor requesting leave...)"
            className="w-full resize-none bg-transparent text-sm text-[#13182E] placeholder-[#94A3B8] focus:outline-none leading-relaxed"
          />
          <div className="flex justify-end text-[11px] font-semibold text-[#94A3B8] pt-2">
            {promptText.length}/1000
          </div>
        </div>

        {/* 4 Controls Row (Tone, Length, Purpose, Add attachment) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Tone Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
              Tone
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635BFF]" />
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-200 focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Formal">Formal</option>
                <option value="Urgent">Urgent</option>
                <option value="Casual">Casual</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* 2. Length Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
              Length
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635BFF]" />
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-200 focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Detailed">Detailed</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* 3. Purpose Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
              Purpose
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635BFF]" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] hover:border-purple-200 focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Request">Request</option>
                <option value="Meeting">Meeting</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Update">Update</option>
                <option value="Thank You">Thank You</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* 4. Add Attachment */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
              Add attachment
            </label>
            <button
              type="button"
              onClick={handleAttachSim}
              className={`w-full px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 truncate ${
                attachment
                  ? 'bg-purple-50 text-[#635BFF] border-purple-300'
                  : 'bg-white hover:bg-slate-50 text-[#505A74] border-[#E8EBF8]'
              }`}
            >
              <Paperclip className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
              <span className="truncate">{attachment || 'Add attachment'}</span>
            </button>
          </div>
        </div>

        {/* Generate Button Action */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-75"
          >
            {isGeneratingAI ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Extracting Intent & Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Suggested Prompts Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-[#13182E] uppercase tracking-wider mb-3">
            Suggested Prompts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {suggestedPrompts.map((item) => {
              const Icon = item.icon;
              const isSelected = promptText === item.text;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggested(item)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-purple-50 border-[#635BFF] text-[#635BFF] shadow-xs'
                      : 'bg-white hover:bg-[#F8F9FE] border-[#E8EBF8] text-[#505A74] hover:text-[#13182E]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-purple-200 text-[#635BFF]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
