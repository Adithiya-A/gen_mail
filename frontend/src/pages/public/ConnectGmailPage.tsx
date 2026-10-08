import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { GenMailLogo } from '../../components/common/GenMailLogo';
import { GmailAppIcon, GoogleLogo, SecurityShieldGraphic } from '../../components/illustrations/FeatureIllustrations';
import { useEmailContext } from '../../context/EmailContext';

export const ConnectGmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { connectGmail, showToast } = useEmailContext();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectGmail = async () => {
    try {
      setIsConnecting(true);

      const authorizationUrl = await connectGmail();

      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Failed to connect Gmail:', error);

      showToast(
        'Gmail Connection Failed',
        error instanceof Error
          ? error.message
          : 'Unable to start Gmail connection.',
        'error'
      );

      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg border border-[#E8EBF8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] relative">
      {/* Left Column */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
        <div>
          {/* Top Logo & Back */}
          <div className="flex items-center justify-between mb-6">
            <GenMailLogo to="/" />
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#635BFF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* Title & Description */}
          <div className="mt-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13182E] tracking-tight">
              Connect Your <span className="text-[#635BFF]">Gmail</span> Account
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              To send and schedule emails, connect your Gmail account securely using Google OAuth 2.0.
            </p>
          </div>

          {/* Gmail App Icon Badge */}
          <div className="flex items-center gap-4 my-6">
            <GmailAppIcon size={44} className="w-16 h-16 shadow-xs border border-purple-100/80" />
            <div className="h-px flex-1 bg-gradient-to-r from-purple-100 to-transparent" />
          </div>

          {/* 3 Security Checkmarks */}
          <div className="flex flex-col gap-3.5 my-6">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#13182E]">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Secure & Encrypted</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#13182E]">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Read, compose and send emails</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#13182E]">
              <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>We never store your password</span>
            </div>
          </div>

          {/* Connect Button */}
          <button
            type="button"
            onClick={handleConnectGmail}
            className="w-full py-3.5 px-4 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 mt-2"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <GoogleLogo className="w-3.5 h-3.5" />
            </div>
            <span>Connect with Google</span>
          </button>
        </div>

        {/* Subtext */}
        <p className="text-center text-xs text-[#94A3B8] mt-6">
          You can disconnect anytime from settings.
        </p>
      </div>

      {/* Right Column (Privacy & Trust Graphic) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#EDE9FE]/50 via-[#F5F3FF] to-white p-10 flex-col items-center justify-center text-center relative border-l border-[#E8EBF8]">
        {/* Glowing Shield Graphic */}
        <SecurityShieldGraphic className="mb-6" />

        <h3 className="text-xl font-bold text-[#13182E] mb-2">
          Your privacy is our priority.
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mb-8">
          We use Google's secure OAuth 2.0 authentication.
        </p>

        {/* Handwritten signature */}
        <div className="font-handwritten text-2xl font-bold text-[#635BFF] rotate-[-2deg]">
          Less Time Typing. <br />
          More Time Doing.
        </div>
      </div>
    </div>
  );
};
