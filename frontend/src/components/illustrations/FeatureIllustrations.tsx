import React from 'react';
import { PenSquare, Calendar, Send, BarChart2 } from 'lucide-react';

export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const GmailAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-12 h-12',
  size = 48,
}) => (
  <div className={`flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm border border-slate-100 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M44 24V9.5C44 6.74 41.76 4.5 39 4.5H9C6.24 4.5 4 6.74 4 9.5V24" stroke="#EA4335" strokeWidth="2.5" />
      <path d="M4 11.5L24 26.5L44 11.5" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 24V38.5C4 41.26 6.24 43.5 9 43.5H39C41.76 43.5 44 41.26 44 38.5V24" fill="#4285F4" fillOpacity="0.1" stroke="#4285F4" strokeWidth="2.5" />
      <path d="M4 14L18.5 25.5L4 37" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 14L29.5 25.5L44 37" stroke="#FBBC05" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

export const EnvelopeHeroGraphic: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background radial glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-purple-300/40 via-indigo-200/40 to-pink-200/30 blur-3xl -z-10" />

      {/* Floating Sparkles & Dots */}
      <span className="absolute -top-6 right-16 text-purple-400 text-2xl animate-pulse">✦</span>
      <span className="absolute top-1/3 -left-4 text-indigo-400 text-lg">✦</span>
      <span className="absolute -bottom-4 right-10 text-purple-300 text-xl">✦</span>

      {/* Flying Paper Airplane */}
      <div className="absolute -top-10 right-2 w-16 h-16 transform rotate-12 animate-bounce duration-1000">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
          <path d="M8 32L56 12L36 56L28 36L8 32Z" fill="url(#plane-grad)" />
          <path d="M56 12L28 36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="plane-grad" x1="8" y1="12" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#635BFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3D Envelope container */}
      <div className="relative w-80 h-72 rounded-3xl bg-gradient-to-b from-[#8B5CF6]/20 to-[#635BFF]/30 p-4 backdrop-blur-sm border border-white/60 shadow-soft-lg flex flex-col justify-end">
        {/* Enclosed Letter Sheet */}
        <div className="absolute top-4 left-6 right-6 h-48 bg-white rounded-2xl shadow-md border border-purple-100/80 p-4 flex flex-col gap-2.5 transform -translate-y-4">
          <div className="w-2/5 h-2.5 rounded-full bg-indigo-200/80" />
          <div className="w-full h-2 rounded-full bg-purple-100" />
          <div className="w-4/5 h-2 rounded-full bg-purple-100" />
          <div className="w-3/4 h-2 rounded-full bg-purple-100" />
        </div>

        {/* Envelope Body Fold */}
        <div className="relative z-10 w-full h-40 bg-gradient-to-tr from-[#635BFF] via-[#7C3AED] to-[#8B5CF6] rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-purple-300/40">
          <svg viewBox="0 0 300 160" fill="none" className="w-full h-full">
            <path d="M0 0 L150 100 L300 0 V160 H0 Z" fill="#6D5DF6" />
            <path d="M0 160 L150 75 L300 160 Z" fill="#7C4DFF" fillOpacity="0.8" />
            <path d="M0 0 L150 90 L300 0" stroke="#A78BFA" strokeWidth="2" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Floating Feature Pills (Right side pill card from Screenshot 1) */}
        <div className="absolute -right-12 top-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-lg border border-purple-100/90 p-3 flex flex-col gap-2.5 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#635BFF] flex items-center justify-center">
              <PenSquare className="w-3.5 h-3.5" />
            </div>
            <span>Draft with AI</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>Schedule</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
            <span>Send</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
            <span>Track</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityShieldGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="absolute w-48 h-48 rounded-full bg-purple-300/30 blur-2xl -z-10" />
    <span className="absolute -top-3 right-6 text-purple-400 text-lg">✦</span>
    <span className="absolute top-1/2 -left-4 text-indigo-400 text-sm">✦</span>
    <span className="absolute -bottom-2 right-4 text-purple-300 text-base">✦</span>

    {/* Shield Graphic */}
    <div className="w-28 h-32 rounded-3xl bg-gradient-to-tr from-[#635BFF] via-[#7C3AED] to-[#3B82F6] p-1 shadow-soft-lg flex items-center justify-center border-2 border-white">
      <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#5346E0] to-[#7C3AED] flex items-center justify-center shadow-inner">
        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-white">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="currentColor"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m9 12 2 2 4-4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  </div>
);

export const TimingCalendarGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="absolute w-52 h-52 rounded-full bg-purple-300/30 blur-2xl -z-10" />
    <span className="absolute -top-2 right-8 text-purple-400 text-base">✦</span>
    <span className="absolute bottom-6 -left-2 text-indigo-400 text-sm">✦</span>

    <div className="relative w-40 h-36 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-soft-lg border border-purple-200/80 p-3 flex flex-col">
      {/* Calendar Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-purple-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
        </div>
        <div className="w-10 h-2 rounded-full bg-purple-200" />
      </div>

      {/* Grid lines */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 pt-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-3 rounded ${i === 3 ? 'bg-[#635BFF]' : 'bg-purple-100/70'}`} />
        ))}
      </div>

      {/* Overlapping Clock Sphere */}
      <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#7C3AED] shadow-md border-2 border-white flex items-center justify-center text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>
  </div>
);
