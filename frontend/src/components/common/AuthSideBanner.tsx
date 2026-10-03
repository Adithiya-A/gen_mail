import React, { useState, useEffect } from 'react';
import { PenSquare, Calendar, ShieldCheck } from 'lucide-react';

interface AuthSideBannerProps {
  initialQuoteIndex?: number;
}

export const AuthSideBanner: React.FC<AuthSideBannerProps> = ({ initialQuoteIndex = 0 }) => {
  const [activeSlide, setActiveSlide] = useState(initialQuoteIndex);

  const quotes = [
    {
      title: 'A smarter way to communicate.',
      author: 'GenMail AI',
    },
    {
      title: 'Same words. Bigger opportunities.',
      author: 'GenMail AI',
    },
    {
      title: 'Less Time Typing. More Time Doing.',
      author: 'GenMail AI',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="relative w-full h-full min-h-[580px] rounded-3xl bg-gradient-to-br from-[#818CF8] via-[#635BFF] to-[#7C3AED] p-8 md:p-10 text-white flex flex-col justify-between overflow-hidden shadow-soft-lg">
      {/* Background Decorative Blur & Sparkles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-900/20 blur-2xl pointer-events-none" />
      <span className="absolute top-10 right-10 text-white/40 text-xl">✦</span>
      <span className="absolute top-1/2 left-6 text-white/30 text-sm">✦</span>

      {/* Top Quote Section */}
      <div className="relative z-10">
        <span className="text-4xl md:text-5xl font-serif text-white/80 leading-none">❝</span>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1 leading-snug">
          {quotes[activeSlide].title}
        </h3>
      </div>

      {/* Middle Envelope Artwork */}
      <div className="relative z-10 flex items-center justify-center my-6">
        <div className="relative w-48 h-40">
          {/* Flying Airplane */}
          <div className="absolute -top-4 right-0 w-12 h-12 transform rotate-12 drop-shadow-md animate-pulse">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <path d="M8 32L56 12L36 56L28 36L8 32Z" fill="#FFFFFF" fillOpacity="0.9" />
              <path d="M56 12L28 36" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Envelope */}
          <div className="w-full h-full rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-3 shadow-lg flex flex-col justify-end">
            <div className="absolute top-3 left-4 right-4 h-24 bg-white/90 rounded-xl p-2.5 flex flex-col gap-2 shadow-sm transform -translate-y-2">
              <div className="w-1/3 h-2 rounded-full bg-indigo-200" />
              <div className="w-full h-1.5 rounded-full bg-slate-200" />
              <div className="w-3/4 h-1.5 rounded-full bg-slate-200" />
            </div>
            <div className="relative z-10 w-full h-24 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 200 100" fill="none" className="w-full h-full">
                <path d="M0 0 L100 65 L200 0" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature List & Carousel Dots */}
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 text-sm font-medium text-white/95">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PenSquare className="w-4 h-4 text-white" />
            </div>
            <span>AI assisted writing</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-white/95">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span>Smart scheduling</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-white/95">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span>Secure & private</span>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
