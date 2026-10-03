import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  GraduationCap,
  Briefcase,
  User,
  Heart,
  Calendar,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates, deleteTemplate, setPromptConfig } = useEmailContext();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Academic' | 'Professional' | 'Personal'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    return tpl.category === activeCategory;
  });

  const getTemplateIcon = (tpl: typeof templates[0]) => {
    if (tpl.name.toLowerCase().includes('leave')) {
      return <FileText className="w-5 h-5 text-amber-500" />;
    }
    if (tpl.name.toLowerCase().includes('meeting')) {
      return <Calendar className="w-5 h-5 text-rose-500" />;
    }
    if (tpl.name.toLowerCase().includes('project')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    if (tpl.name.toLowerCase().includes('follow')) {
      return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
    }
    return <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />;
  };

  const handleUseTemplate = (tpl: typeof templates[0]) => {
    setPromptConfig((prev) => ({
      ...prev,
      promptText: `Use the ${tpl.name} template: ${tpl.body}`,
      purpose: tpl.category === 'Academic' ? 'Request' : 'Update',
    }));
    navigate('/compose');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Email Templates
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Use ready-made templates or create your own.
            </p>
          </div>
        </div>

        <Link
          to="/templates/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </Link>
      </div>

      {/* Main Templates Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8F9FE] focus:bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeCategory === 'All'
                ? 'bg-purple-50 text-[#635BFF]'
                : 'text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('Academic')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'Academic'
                ? 'bg-purple-50 text-[#635BFF]'
                : 'text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic</span>
          </button>
          <button
            onClick={() => setActiveCategory('Professional')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'Professional'
                ? 'bg-purple-50 text-[#635BFF]'
                : 'text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional</span>
          </button>
          <button
            onClick={() => setActiveCategory('Personal')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'Personal'
                ? 'bg-purple-50 text-[#635BFF]'
                : 'text-[#64748B] hover:text-[#13182E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>
        </div>

        {/* Template List Cards */}
        <div className="flex flex-col gap-3.5">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleUseTemplate(tpl)}
              className="flex items-center justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-300 hover:bg-[#FAFBFF] transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#E8EBF8] group-hover:border-purple-200 flex items-center justify-center shadow-xs flex-shrink-0">
                  {getTemplateIcon(tpl)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#13182E] group-hover:text-[#635BFF] transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{tpl.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <StatusBadge status={tpl.category} size="sm" />
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === tpl.id ? null : tpl.id)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {menuOpenId === tpl.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-1 z-30 flex flex-col gap-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          handleUseTemplate(tpl);
                          setMenuOpenId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Use with AI</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/templates/${tpl.id}/edit`);
                          setMenuOpenId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-[#505A74] hover:bg-purple-50 hover:text-[#635BFF] rounded-xl flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Template</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteTemplate(tpl.id);
                          setMenuOpenId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
