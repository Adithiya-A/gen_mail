import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Edit3,
  Trash2,
  Plus,
} from 'lucide-react';

import { useEmailContext } from '../../context/EmailContext';

export const DraftsPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    draftEmails,
    deleteDraft,
  } = useEmailContext();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this draft?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDraft(id);
    } catch (error) {
      console.error(
        'Failed to delete draft:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete draft'
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13182E]">
            Drafts
          </h1>

          <p className="text-sm text-[#64748B] mt-1">
            Continue editing emails you have saved.
          </p>
        </div>

        <Link
          to="/compose"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Compose with AI
        </Link>
      </div>

      {/* Draft list */}
      <div className="bg-white rounded-3xl border border-[#E8EBF8] shadow-card overflow-hidden">

        {draftEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>

            <h2 className="text-base font-bold text-[#13182E]">
              No drafts yet
            </h2>

            <p className="text-sm text-[#64748B] mt-1 max-w-sm">
              Emails you save as drafts will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {draftEmails.map((draft) => (
              <div
                key={draft.id}
                className="p-5 hover:bg-[#FAFBFF] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                        Draft
                      </span>

                      <span className="text-[11px] text-[#94A3B8]">
                        {draft.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#13182E] mt-2 truncate">
                      {draft.subject || '(No subject)'}
                    </h3>

                    <p className="text-xs text-[#64748B] mt-1 truncate">
                      To: {draft.recipient}
                    </p>

                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                      {draft.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => {
                        navigate('/review', {
                          state: {
                            draftId: draft.id,
                            draft: {
                              to: draft.recipient,
                              subject: draft.subject,
                              body: draft.body,
                            },
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5346E0] text-white text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(draft.id)
                      }
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};