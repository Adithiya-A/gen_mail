import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Headphones,
  FileQuestion,
  PlaySquare,
  BookOpen,
  Shield,
  ArrowRight,
  Sparkles,
  Bot,
  Calendar,
  Send,
  FileText,
} from 'lucide-react';

export const HelpGuidancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'how-it-works' | 'faqs' | 'videos' | 'guide' | 'privacy'>('how-it-works');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
    { id: 'faqs', label: 'FAQs', icon: FileQuestion },
    { id: 'videos', label: 'Video Tutorials', icon: PlaySquare },
    { id: 'guide', label: 'User Guide', icon: BookOpen },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'contact', label: 'Contact Support', icon: Headphones },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Help & Guidance
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Learn how to make the most of GenMail.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none shadow-xs"
            />
          </div>

          <button
            onClick={() => alert('Support ticket modal opened!')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#635BFF] hover:bg-[#5346E0] text-white text-xs font-bold rounded-xl shadow-soft transition-all flex-shrink-0"
          >
            <Headphones className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Menu on left, Content on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Sidebar */}
        <div className="lg:col-span-3 p-4 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDirectActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'contact') {
                    alert('Support ticket modal opened!');
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  isDirectActive
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'text-[#505A74] hover:bg-[#F4F2FF] hover:text-[#635BFF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-8">
            {/* Header in Content Panel */}
            <div>
              <h2 className="text-2xl font-bold text-[#13182E] tracking-tight">
                How GenMail Works
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Turn your ideas into professional emails in just a few simple steps.
              </p>
            </div>

            {/* 4 Connected Step Cards with Illustrations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] flex flex-col justify-between text-center relative group hover:border-purple-200 hover:shadow-xs transition-all">
                <div className="flex flex-col items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#635BFF] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center my-2">
                    <FileText className="w-8 h-8 text-[#635BFF]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#13182E]">
                    Tell Us What You Need
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Type your email request in natural language.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] flex flex-col justify-between text-center relative group hover:border-purple-200 hover:shadow-xs transition-all">
                <div className="flex flex-col items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center my-2">
                    <Bot className="w-8 h-8 text-pink-500" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#13182E]">
                    AI Generates Email
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    GenMail creates a professional draft for you using advanced AI.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] flex flex-col justify-between text-center relative group hover:border-purple-200 hover:shadow-xs transition-all">
                <div className="flex flex-col items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center my-2">
                    <Calendar className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#13182E]">
                    Schedule & Review
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Choose a time and make edits if needed.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8] flex flex-col justify-between text-center relative group hover:border-purple-200 hover:shadow-xs transition-all">
                <div className="flex flex-col items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center my-2">
                    <Send className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#13182E]">
                    Send Automatically
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Let GenMail handle the delivery through Gmail.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Purple Inspirational Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#EDE9FE] via-[#F5F3FF] to-[#EDE9FE] p-6 sm:p-8 border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-[#635BFF] flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#13182E]">
                    "Smarter emails. A more productive you."
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Save time, communicate better, and focus on what matters.
                  </p>
                </div>
              </div>

              {/* Envelope illustration */}
              <div className="w-16 h-12 rounded-xl bg-[#635BFF] text-white flex items-center justify-center shadow-sm">
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
