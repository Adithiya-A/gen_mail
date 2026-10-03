import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FileText,
  Save,
  ChevronLeft,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { RichTextEditor } from '../../components/email/RichTextEditor';

export const CreateEditTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { templates, addTemplate, updateTemplate } = useEmailContext();

  const existing = id ? templates.find((t) => t.id === id) : null;

  const [templateName, setTemplateName] = useState(existing ? existing.name : 'Leave Request');
  const [category, setCategory] = useState<'Academic' | 'Professional' | 'Personal'>(
    existing ? existing.category : 'Academic'
  );
  const [subject, setSubject] = useState(existing ? existing.subject : 'Request for Leave');
  const [body, setBody] = useState(
    existing
      ? existing.body
      : `Dear Sir/Madam,\n\nI am writing to request permission for leave on [date] due to [reason].\n\nI will make sure to complete any pending work.\n\nThank you for your understanding.\n\nYours sincerely,\n[Your Name]`
  );
  const [isDefault, setIsDefault] = useState(existing ? !!existing.isDefault : true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill out all template fields.');
      return;
    }

    if (id && existing) {
      updateTemplate(id, {
        name: templateName,
        category,
        subject,
        body,
        isDefault,
      });
    } else {
      addTemplate({
        name: templateName,
        category,
        subject,
        description: `Custom ${category.toLowerCase()} template`,
        body,
        isDefault,
        iconBg: 'bg-purple-100 text-[#635BFF]',
      });
    }

    navigate('/templates');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Main Form Container */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Create / Edit Template
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Design your reusable email template.
            </p>
          </div>
        </div>

        {/* Template Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Leave Request"
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-[#13182E] mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Academic">Academic</option>
                  <option value="Professional">Professional</option>
                  <option value="Personal">Personal</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
              </div>
            </div>
          </div>

          {/* Row 2: Subject */}
          <div>
            <label className="block text-xs font-bold text-[#13182E] mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Request for Leave"
              required
              className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Row 3: Rich Text Editor with Template Variables */}
          <div className="mt-1">
            <RichTextEditor
              value={body}
              onChange={setBody}
              showVariables={true}
              maxChars={2000}
            />
          </div>

          {/* Row 4: Default Toggle and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultTpl"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
              />
              <label htmlFor="defaultTpl" className="text-xs font-semibold text-[#13182E] select-none cursor-pointer">
                Save as default template
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/templates"
                className="px-5 py-2.5 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 text-xs font-semibold text-[#505A74] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
