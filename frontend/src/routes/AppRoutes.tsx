import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { SignInPage } from '../pages/public/SignInPage';
import { SignUpPage } from '../pages/public/SignUpPage';
import { ConnectGmailPage } from '../pages/public/ConnectGmailPage';

// Authenticated Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { InboxPage } from '../pages/dashboard/InboxPage';
import { ActivityHistoryPage } from '../pages/dashboard/ActivityHistoryPage';
import { ContactsPage } from '../pages/dashboard/ContactsPage';

// AI Workflow Pipeline
import { ComposePage } from '../pages/ai-workflow/ComposePage';
import { IntentExtractionPage } from '../pages/ai-workflow/IntentExtractionPage';
import { GeneratedEmailPage } from '../pages/ai-workflow/GeneratedEmailPage';
import { ReviewEditPage } from '../pages/ai-workflow/ReviewEditPage';
import { ScheduleEmailPage } from '../pages/ai-workflow/ScheduleEmailPage';

// Management & Tracking
import { ScheduledEmailsPage } from '../pages/management/ScheduledEmailsPage';
import { SentEmailsPage } from '../pages/management/SentEmailsPage';
import { EmailTrackingPage } from '../pages/management/EmailTrackingPage';
import { TemplatesPage } from '../pages/management/TemplatesPage';
import { CreateEditTemplatePage } from '../pages/management/CreateEditTemplatePage';
import { EmailDetailsPage } from '../pages/management/EmailDetailsPage';

// Settings & Help
import { SettingsPage } from '../pages/settings/SettingsPage';
import { GmailIntegrationPage } from '../pages/settings/GmailIntegrationPage';
import { HelpGuidancePage } from '../pages/help/HelpGuidancePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* 2. Authentication & Onboarding */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/connect-gmail" element={<ConnectGmailPage />} />
      </Route>

      {/* 3. Authenticated Dashboard Application */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/activity" element={<ActivityHistoryPage />} />
        <Route path="/contacts" element={<ContactsPage />} />

        {/* AI Workflow Pipeline */}
        <Route path="/compose" element={<ComposePage />} />
        <Route path="/intent" element={<IntentExtractionPage />} />
        <Route path="/generate" element={<GeneratedEmailPage />} />
        <Route path="/review" element={<ReviewEditPage />} />
        <Route path="/schedule" element={<ScheduleEmailPage />} />

        {/* Management & Analytics */}
        <Route path="/scheduled" element={<ScheduledEmailsPage />} />
        <Route path="/sent" element={<SentEmailsPage />} />
        <Route path="/tracking" element={<EmailTrackingPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/new" element={<CreateEditTemplatePage />} />
        <Route path="/templates/:id/edit" element={<CreateEditTemplatePage />} />
        <Route path="/emails/:id" element={<EmailDetailsPage />} />

        {/* Settings & Help */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/profile" element={<SettingsPage />} />
        <Route path="/settings/gmail" element={<GmailIntegrationPage />} />
        <Route path="/help" element={<HelpGuidancePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
