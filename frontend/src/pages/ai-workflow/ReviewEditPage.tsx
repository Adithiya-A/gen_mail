import React, { useState } from 'react';
import {
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import {createEmail, } from '../../services/emailService';
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
    updateDraft,
    setCurrentEmailId,
  } = useEmailContext();

const location = useLocation();

const draftId = location.state?.draftId as | string | undefined;

const draftFromNavigation =
  location.state?.draft as {
    to: string;
    subject: string;
    body: string;
  } | undefined;

  const [to, setTo] = useState(draftFromNavigation?.to ?? generatedDraft.to);
  const [subject, setSubject] = useState(draftFromNavigation?.subject ?? generatedDraft.subject);
  const [body, setBody] = useState(draftFromNavigation?.body ?? generatedDraft.body);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

const handleSaveDraft = async () => {
  if (!to.trim()) {
    alert('Please enter a recipient.');
    return;
  }

  if (!subject.trim()) {
    alert('Please enter a subject.');
    return;
  }

  if (!body.trim()) {
    alert('Please enter the email body.');
    return;
  }

  setIsSavingDraft(true);

  try {
    if (draftId) {
      // Existing Firestore draft
      await updateDraft(draftId, {
        to,
        subject,
        body,
      });
    } else {
      // New draft
      const result = await createEmail({
        to,
        subject,
        body,
        scheduled_at: null,
      });

      console.log(
        'New draft created:',
        result
      );
    }

    setGeneratedDraft({
      to,
      subject,
      body,
    });

    navigate('/drafts');

  } catch (error) {
    console.error(
      'Failed to save draft:',
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : 'Failed to save draft'
    );
  } finally {
    setIsSavingDraft(false);
  }
};

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


  const handleContinue = () => {
    setGeneratedDraft({
      to,
      subject,
      body,
    });

    setCurrentEmailId(draftId ?? null);

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
          showSendButton={false}
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

            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-purple-50/50 text-xs font-semibold text-[#635BFF] transition-colors disabled:opacity-50"
            >
              {isSavingDraft ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {draftId ? 'Update Draft' : 'Save Draft'}
                  </span>
                </>
              )}
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
