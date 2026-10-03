import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  PenSquare,
  Calendar,
  ShieldCheck,
  BarChart2,
  MessageSquare,
  Send,
} from 'lucide-react';
import { EnvelopeHeroGraphic } from '../../components/illustrations/FeatureIllustrations';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 py-8 px-6 md:px-12 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6 md:pt-12">
        {/* Left Hero Content */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#635BFF] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
            <span>Powered by Gemini AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#13182E] leading-[1.12]">
            Write Smarter. <br />
            <span className="text-[#635BFF]">Send Faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#505A74] max-w-lg leading-relaxed">
            Compose, schedule and send professional emails with the power of AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold rounded-2xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => alert('Demo video walkthrough opened!')}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-[#13182E] font-semibold rounded-2xl border border-[#E8EBF8] shadow-card hover:shadow-md transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#635BFF]">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-[#13182E]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Smart Scheduling</span>
            </div>
          </div>
        </div>

        {/* Right Hero Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="font-handwritten text-2xl md:text-3xl font-bold text-[#635BFF] mb-2 -rotate-3 select-none flex items-center gap-1">
            <span>Less Time Typing. More Time Doing.</span>
            <span className="text-xl">~</span>
          </div>
          <EnvelopeHeroGraphic className="w-full max-w-md" />
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="flex flex-col items-center text-center gap-12 pt-10">
        <div className="flex flex-col items-center gap-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
            FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13182E] tracking-tight">
            Everything You Need in <span className="text-[#635BFF]">One Place</span>
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            Powerful tools to make your email communication effortless.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#635BFF] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <PenSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#13182E] mb-2">AI Email Generation</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Create clear, professional emails effortlessly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#13182E] mb-2">Smart Scheduling</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Send emails at the perfect time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#13182E] mb-2">Secure & Private</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Your data stays safe with Gmail's OAuth 2.0.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8EBF8] shadow-card hover:shadow-soft transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#13182E] mb-2">Email Tracking</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Know when your emails are sent and opened.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="flex flex-col items-center text-center gap-12 pt-6">
        <div className="flex flex-col items-center gap-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13182E] tracking-tight">
            From Your Thoughts to the <span className="text-[#635BFF]">Inbox</span>
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            Just a few steps to smarter communication.
          </p>
        </div>

        {/* 4 Connected Step Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-[#635BFF] shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#635BFF] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                1
              </span>
            </div>
            <h4 className="text-base font-bold text-[#13182E] mt-2">Tell Us What You Need</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              Type your email request in natural language.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-600 shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <h4 className="text-base font-bold text-[#13182E] mt-2">AI Generates Email</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              Gemini creates a professional draft for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <h4 className="text-base font-bold text-[#13182E] mt-2">Schedule & Review</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              Choose a time and make edits if needed.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Send className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                4
              </span>
            </div>
            <h4 className="text-base font-bold text-[#13182E] mt-2">Send Automatically</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              We'll handle the delivery through Gmail.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA BANNER */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#635BFF] via-[#7C3AED] to-[#818CF8] p-8 md:p-12 text-white overflow-hidden shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-8 my-6">
        <div className="absolute top-0 right-0 w-80 h-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="absolute top-6 right-1/3 text-white/30 text-xl">✦</span>
        <span className="absolute bottom-4 left-1/4 text-white/30 text-sm">✦</span>

        {/* Text */}
        <div className="relative z-10 flex flex-col items-start gap-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
            GET STARTED TODAY
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Simplify Your Emails?
          </h3>
          <p className="text-sm text-purple-100/90 mt-1">
            Join thousands of users who communicate smarter with GenMail.
          </p>
        </div>

        {/* Action & Graphic */}
        <div className="relative z-10 flex items-center gap-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#13182E] hover:bg-slate-50 font-bold text-sm rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 text-[#635BFF]" />
          </Link>

          {/* Mini Envelope artwork */}
          <div className="hidden sm:flex w-24 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-2 items-center justify-center">
            <div className="w-12 h-10 bg-white/80 rounded-lg shadow-sm" />
          </div>
        </div>
      </section>
    </div>
  );
};
