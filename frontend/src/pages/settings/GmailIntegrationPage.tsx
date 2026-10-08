import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { GmailAppIcon, SecurityShieldGraphic } from '../../components/illustrations/FeatureIllustrations';
import { StatusBadge } from '../../components/common/StatusBadge';

export const GmailIntegrationPage: React.FC = () => {
  const { user, isGmailConnected, connectGmail, disconnectGmail, showToast } = useEmailContext();

  const permissions = [
    {
      title: 'Read your emails',
      description: 'View and analyze your inbox emails.',
    },
    {
      title: 'Compose and send emails',
      description: 'Send emails directly from GenMail.',
    },
    {
      title: 'Manage drafts and labels',
      description: 'Create, edit and organize your drafts and labels.',
    },
    {
      title: 'Access email metadata (for tracking)',
      description: 'Track opens, clicks and other email activity.',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
            Gmail Integration
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your Gmail connection.
          </p>
        </div>
      </div>

      {/* Main Split Container */}
      <div className="bg-white rounded-3xl shadow-card border border-[#E8EBF8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column (Connected Card & Permissions) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            {/* Connection Status Card */}
            {isGmailConnected ? (
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8EBF8]">
                <div className="flex items-center gap-4">
                  <GmailAppIcon size={40} className="w-14 h-14" />
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status="connected" size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-[#13182E] mt-1">
                      {user.connectedGmail || 'Gmail account'}
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      {user.connectedDate ? `Connected on ${user.connectedDate}` : 'Connected'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await disconnectGmail();
                    } catch {
                      // Error is already handled by EmailContext.
                    }
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Gmail Not Connected</h4>
                    <p className="text-[11px] text-amber-700">Connect to send and sync emails.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const authorizationUrl = await connectGmail();

                      window.location.href = authorizationUrl;
                    } catch (error) {
                      console.error('Failed to connect Gmail:', error);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#635BFF] text-white hover:bg-[#5346E0] text-xs font-bold shadow-xs transition-colors"
                >
                  Connect Now
                </button>
              </div>
            )}

            {/* 4 Permissions List */}
            <div className="flex flex-col gap-4 mt-2">
              {permissions.map((perm, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#13182E]">{perm.title}</h4>
                    <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{perm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Security Trust Panel) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#EDE9FE]/50 via-[#F5F3FF] to-white p-10 flex-col items-center justify-center text-center relative border-l border-[#E8EBF8]">
          <SecurityShieldGraphic className="mb-6" />

          <h3 className="text-xl font-bold text-[#13182E] mb-3">
            Your Data is Safe
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mb-3">
            We use Google's secure OAuth 2.0 authentication.
          </p>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
            We never store your password or email content without your permission.
          </p>
        </div>
      </div>
    </div>
  );
};
