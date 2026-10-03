import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createEmail,
  getEmails,
  updateEmail,
  deleteEmail,
} from '../services/emailService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  UserProfile,
  EmailItem,
  IntentData,
  EmailTemplate,
  ActivityItem,
  initialUser,
  initialStats,
  initialScheduledEmails,
  initialSentEmails,
  initialTrackingEmails,
  initialTemplates,
  initialActivities,
  initialInboxEmails,
} from '../data/mockData';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface PromptConfig {
  promptText: string;
  tone: string;
  length: string;
  purpose: string;
  attachmentName?: string;
}

export interface ScheduleConfig {
  sendType: 'now' | 'later';
  date: string;
  time: string;
  timeZone: string;
  sendReminder: boolean;
}

interface EmailContextType {
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;
  stats: typeof initialStats;
  
  // Prompt & AI Generation Pipeline
  promptConfig: PromptConfig;
  setPromptConfig: React.Dispatch<React.SetStateAction<PromptConfig>>;
  intentData: IntentData;
  setIntentData: React.Dispatch<React.SetStateAction<IntentData>>;
  updateIntentItem: (key: keyof IntentData, val: any) => void;
  
  generatedDraft: { to: string; subject: string; body: string };
  setGeneratedDraft: React.Dispatch<React.SetStateAction<{ to: string; subject: string; body: string }>>;
  
  scheduleConfig: ScheduleConfig;
  setScheduleConfig: React.Dispatch<React.SetStateAction<ScheduleConfig>>;
  
  // Data lists
  inboxEmails: EmailItem[];
  selectedInboxEmail: EmailItem | null;
  setSelectedInboxEmail: (email: EmailItem | null) => void;
  toggleStarInbox: (id: string) => void;
  toggleReadInbox: (id: string) => void;
  deleteInboxEmail: (id: string) => void;
  syncInbox: () => void;
  isSyncing: boolean;

  scheduledEmails: EmailItem[];
  addScheduledEmail: (email: Omit<EmailItem, 'id'>) => void;
  deleteScheduledEmail: (id: string) => void;

  draftEmails: EmailItem[];
  updateDraft: (
    id: string,
    email: {
      to: string;
      subject: string;
      body: string;
    }
  ) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;

  sentEmails: EmailItem[];
  addSentEmail: (email: Omit<EmailItem, 'id'>) => void;

  trackingEmails: EmailItem[];
  templates: EmailTemplate[];
  addTemplate: (tpl: Omit<EmailTemplate, 'id'>) => void;
  updateTemplate: (id: string, tpl: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;

  activities: ActivityItem[];
  addActivity: (act: Omit<ActivityItem, 'id'>) => void;

  // Gmail OAuth State
  isGmailConnected: boolean;
  connectGmail: (email?: string) => void;
  disconnectGmail: () => void;

  // AI Pipeline Actions
  generateEmailFromPrompt: (customPrompt?: string) => Promise<void>;
  isGeneratingAI: boolean;
  completeScheduleOrSend: (overrideConfig?: Partial<ScheduleConfig>) => Promise<string>;

  // Toasts
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  saveDraft: (
  email: {
    to: string;
    subject: string;
    body: string;
  }
) => Promise<string>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<UserProfile>(initialUser);
  const [stats, setStats] = useState(initialStats);
  const [isGmailConnected, setIsGmailConnected] = useState<boolean>(true);

  // Workflow states
  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    promptText: 'Write an email to my professor requesting permission for leave tomorrow due to health issues.',
    tone: 'Professional',
    length: 'Medium',
    purpose: 'Request',
    attachmentName: '',
  });

  const [intentData, setIntentData] = useState<IntentData>({
    recipient: 'professor@pec.edu.in',
    purpose: 'Request for leave',
    tone: 'Professional',
    dateTime: 'Tomorrow (Auto-detected)',
    keyPoints: ['Health issues', 'Need rest', 'Will complete pending work'],
  });

  const [generatedDraft, setGeneratedDraft] = useState({
    to: 'professor@pec.edu.in',
    subject: 'Request for Leave Tomorrow',
    body: `Dear Sir/Madam,\n\nI hope you are doing well. I am writing to request permission for leave tomorrow due to health issues. I am currently not feeling well and need to take rest for a speedy recovery.\n\nI will make sure to complete any pending work and stay updated with the class materials.\n\nThank you for your understanding.\n\nYours sincerely,\nAarthi`,
  });

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    sendType: 'later',
    date: todayFormatted,
    time: '06:00 PM',
    timeZone: '(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi',
    sendReminder: true,
  });

  // Collections
  const [inboxEmails, setInboxEmails] = useState<EmailItem[]>(initialInboxEmails);
  const [selectedInboxEmail, setSelectedInboxEmail] = useState<EmailItem | null>(initialInboxEmails[0]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [scheduledEmails, setScheduledEmails] = useState<EmailItem[]>(initialScheduledEmails);
  const [draftEmails, setDraftEmails] = useState<EmailItem[]>([]);
  const [sentEmails, setSentEmails] = useState<EmailItem[]>(initialSentEmails);
  const [trackingEmails, setTrackingEmails] = useState<EmailItem[]>(initialTrackingEmails);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const convertBackendEmail = (email: any): EmailItem => {
    const createdAt = email.created_at
      ? new Date(email.created_at)
      : new Date();

    return {
      id: email.id,
      sender: user.name,
      senderEmail: user.email,

      recipient: email.to,

      subject: email.subject,

      snippet:
        email.body?.slice(0, 80) +
          (email.body?.length > 80 ? '...' : '') || '',

      body: email.body,

      time: createdAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),

      date: createdAt.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),

      fullDate: createdAt.toISOString(),

      status:
        email.status?.toLowerCase() === 'scheduled'
          ? 'scheduled'
          : email.status?.toLowerCase() === 'sent'
            ? 'sent'
            : 'draft',

      iconType: 'mail',

      scheduledTime: email.scheduled_at
        ? new Date(email.scheduled_at).toLocaleString()
        : undefined,

      sentTime: email.sent_at
        ? new Date(email.sent_at).toLocaleString()
        : undefined,
    };
  };

  const loadEmailsFromBackend = async () => {
    try {
      const result = await getEmails();

      const backendEmails = result.emails || [];

      const convertedEmails =
        backendEmails.map(convertBackendEmail);

      const drafts = convertedEmails.filter(
        (email) => email.status === 'draft'
      );

      const scheduled = convertedEmails.filter(
        (email) => email.status === 'scheduled'
      );

      const sent = convertedEmails.filter(
        (email) => email.status === 'sent'
      );

      setDraftEmails(drafts);
      setScheduledEmails(scheduled);
      setSentEmails(sent);

      setStats((prev) => ({
        ...prev,
        drafts: drafts.length,
        scheduled: scheduled.length,
        emailsSent: sent.length,
      }));
    } catch (error) {
      console.error(
        'Failed to load emails from backend:',
        error
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          return;
        }

        await loadEmailsFromBackend();
      }
    );

    return unsubscribe;
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
    showToast('Profile Updated', 'Your profile changes have been saved successfully.');
  };

  const connectGmail = (email = 'aarthi@gmail.com') => {
    setIsGmailConnected(true);
    setUser((prev) => ({
      ...prev,
      connectedGmail: email,
      connectedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      isConnected: true,
    }));
    showToast('Gmail Connected', `Successfully linked to ${email}`);
  };

  const disconnectGmail = () => {
    setIsGmailConnected(false);
    setUser((prev) => ({ ...prev, isConnected: false, connectedGmail: '' }));
    showToast('Gmail Disconnected', 'Your Gmail account has been disconnected.', 'info');
  };

  const updateIntentItem = (key: keyof IntentData, val: any) => {
    setIntentData((prev) => ({ ...prev, [key]: val }));
  };

  const generateEmailFromPrompt = async (customPrompt?: string) => {
    setIsGeneratingAI(true);
    const text = customPrompt || promptConfig.promptText;

    // Simulate smart AI intent extraction and generation based on keywords
    let rec = 'professor@pec.edu.in';
    let pur = 'Request for leave';
    let subj = 'Request for Leave Tomorrow';
    let points = ['Health issues', 'Need rest', 'Will complete pending work'];
    let dt = 'Tomorrow (Auto-detected)';
    let bodyText = `Dear Sir/Madam,\n\nI hope you are doing well. I am writing to request permission for leave tomorrow due to health issues. I am currently not feeling well and need to take rest for a speedy recovery.\n\nI will make sure to complete any pending work and stay updated with the class materials.\n\nThank you for your understanding.\n\nYours sincerely,\n${user.name}`;

    const lower = text.toLowerCase();
    if (lower.includes('meeting') || lower.includes('schedule a meeting')) {
      rec = 'team@company.com';
      pur = 'Schedule Team Meeting';
      subj = 'Meeting Invitation: Sprint Review & Planning';
      points = ['Sprint deliverables review', 'Upcoming milestone timelines', 'Q&A session'];
      dt = 'Tomorrow at 10:00 AM';
      bodyText = `Hi Team,\n\nI would like to invite everyone for our sprint review meeting scheduled for tomorrow at 10:00 AM.\n\nAgenda items include checking deliverables, unblocking hurdles, and scheduling upcoming milestones.\n\nPlease confirm your availability.\n\nBest regards,\n${user.name}`;
    } else if (lower.includes('follow up') || lower.includes('follow-up')) {
      rec = 'hr@company.com';
      pur = 'Follow Up on Interview';
      subj = 'Following Up on Recent Interview - Application Status';
      points = ['Inquire on next steps', 'Reiterate enthusiasm', 'Available for further details'];
      dt = 'This week';
      bodyText = `Dear Hiring Team,\n\nI hope you are doing well. I am following up on my recent interview round for the Software Engineer role.\n\nI remain very enthusiastic about joining the team and would love to hear about the next steps.\n\nThank you for your time.\n\nWarm regards,\n${user.name}`;
    } else if (lower.includes('project update') || lower.includes('update')) {
      rec = 'team@company.com';
      pur = 'Share Project Progress';
      subj = 'Project Update: Milestone 3 Completed';
      points = ['Core frontend architecture ready', 'API integration in progress', 'Deployment ahead of schedule'];
      dt = 'Today';
      bodyText = `Hi Team,\n\nHere is the latest progress report on our project. Milestone 3 has been completed and test runs have passed without blockers.\n\nPlease let me know if you have any suggestions.\n\nBest regards,\n${user.name}`;
    }

    await new Promise((r) => setTimeout(r, 700));

    setIntentData({
      recipient: rec,
      purpose: pur,
      tone: promptConfig.tone,
      dateTime: dt,
      keyPoints: points,
    });

    setGeneratedDraft({
      to: rec,
      subject: subj,
      body: bodyText,
    });

    setIsGeneratingAI(false);
  };

  const saveDraft = async (email: {
    to: string;
    subject: string;
    body: string;
  }) => {
    const result = await createEmail({
      to: email.to,
      subject: email.subject,
      body: email.body,
      scheduled_at: null,
    });

    showToast(
      'Draft Saved',
      'Your email draft has been saved successfully.'
    );

    return result.email.id;
  };

    const updateDraft = async (
    id: string,
    email: {
      to: string;
      subject: string;
      body: string;
    }
  ) => {
    await updateEmail(id, {
      to: email.to,
      subject: email.subject,
      body: email.body,
    });

    await loadEmailsFromBackend();

    showToast(
      'Draft Updated',
      'Your draft has been updated successfully.'
    );
  };

  const deleteDraft = async (id: string) => {
    await deleteEmail(id);

    await loadEmailsFromBackend();

    showToast(
      'Draft Deleted',
      'The draft has been deleted.',
      'info'
    );
  };

  const completeScheduleOrSend = async (overrideConfig?: Partial<ScheduleConfig>): Promise<string> => {
    const effective = { ...scheduleConfig, ...(overrideConfig || {}) };
    const isNow = effective.sendType === 'now';
    const newId = `email-${Date.now()}`;

    if (isNow) {
      const newSent: EmailItem = {
        id: newId,
        sender: user.name,
        senderEmail: user.email,
        recipient: generatedDraft.to,
        subject: generatedDraft.subject,
        snippet: generatedDraft.body.slice(0, 60) + '...',
        body: generatedDraft.body,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        sentTime: `${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        status: 'sent',
        iconType: 'mail',
      };
      setSentEmails((prev) => [newSent, ...prev]);
      setStats((prev) => ({ ...prev, emailsSent: prev.emailsSent + 1 }));

      addActivity({
        type: 'sent',
        title: 'Email sent',
        description: `${generatedDraft.subject} to ${generatedDraft.to}`,
        timestamp: 'Just now',
        iconBg: 'bg-emerald-100 text-emerald-600',
      });
      showToast('Email Sent Successfully!', `Delivered to ${generatedDraft.to} via Gmail.`);
    } else {
      const newScheduled: EmailItem = {
        id: newId,
        sender: user.name,
        senderEmail: user.email,
        recipient: generatedDraft.to,
        subject: generatedDraft.subject,
        snippet: generatedDraft.body.slice(0, 60) + '...',
        body: generatedDraft.body,
        time: effective.time,
        date: effective.date,
        scheduledTime: `${effective.date}, ${effective.time}`,
        status: 'scheduled',
        iconType: 'team',
        type: 'Scheduled Email',
      };
      setScheduledEmails((prev) => [newScheduled, ...prev]);
      setStats((prev) => ({ ...prev, scheduled: prev.scheduled + 1 }));

      addActivity({
        type: 'scheduled',
        title: 'Email scheduled',
        description: `${generatedDraft.subject} to ${generatedDraft.to}`,
        timestamp: 'Just now',
        iconBg: 'bg-purple-100 text-purple-600',
      });
      showToast('Email Scheduled!', `Queued for ${effective.date} at ${effective.time}`);
    }

    return newId;
  };

  const toggleStarInbox = (id: string) => {
    setInboxEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
    if (selectedInboxEmail?.id === id) {
      setSelectedInboxEmail((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
  };

  const toggleReadInbox = (id: string) => {
    setInboxEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: !item.isUnread } : item))
    );
  };

  const deleteInboxEmail = (id: string) => {
    setInboxEmails((prev) => prev.filter((item) => item.id !== id));
    if (selectedInboxEmail?.id === id) {
      const remaining = inboxEmails.filter((i) => i.id !== id);
      setSelectedInboxEmail(remaining.length > 0 ? remaining[0] : null);
    }
    showToast('Email Deleted', 'Email moved to Trash.', 'info');
  };

  const syncInbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Inbox Synced', 'All latest emails fetched from Gmail.');
    }, 900);
  };

  const addScheduledEmail = (email: Omit<EmailItem, 'id'>) => {
    const item: EmailItem = { ...email, id: `sch-${Date.now()}` };
    setScheduledEmails((prev) => [item, ...prev]);
  };

  const deleteScheduledEmail = (id: string) => {
    setScheduledEmails((prev) => prev.filter((e) => e.id !== id));
    showToast('Scheduled Email Cancelled', 'The email was removed from queue.', 'info');
  };

  const addSentEmail = (email: Omit<EmailItem, 'id'>) => {
    const item: EmailItem = { ...email, id: `sent-${Date.now()}` };
    setSentEmails((prev) => [item, ...prev]);
  };

  const addTemplate = (tpl: Omit<EmailTemplate, 'id'>) => {
    const item: EmailTemplate = { ...tpl, id: `tpl-${Date.now()}` };
    setTemplates((prev) => [item, ...prev]);
    addActivity({
      type: 'template',
      title: 'Template created',
      description: `${tpl.name} Template`,
      timestamp: 'Just now',
      iconBg: 'bg-rose-100 text-rose-600',
    });
    showToast('Template Saved', `"${tpl.name}" is now available in your template library.`);
  };

  const updateTemplate = (id: string, tpl: Partial<EmailTemplate>) => {
    setTemplates((prev) => prev.map((item) => (item.id === id ? { ...item, ...tpl } : item)));
    showToast('Template Updated', 'Template changes have been saved.');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((item) => item.id !== id));
    showToast('Template Deleted', 'Template removed.', 'info');
  };

  const addActivity = (act: Omit<ActivityItem, 'id'>) => {
    const item: ActivityItem = { ...act, id: `act-${Date.now()}` };
    setActivities((prev) => [item, ...prev]);
  };

  return (
    <EmailContext.Provider
      value={{
        user,
        updateUser,
        stats,
        promptConfig,
        setPromptConfig,
        intentData,
        setIntentData,
        updateIntentItem,
        generatedDraft,
        setGeneratedDraft,
        scheduleConfig,
        setScheduleConfig,
        inboxEmails,
        selectedInboxEmail,
        setSelectedInboxEmail,
        toggleStarInbox,
        toggleReadInbox,
        deleteInboxEmail,
        syncInbox,
        isSyncing,
        scheduledEmails,
        addScheduledEmail,
        deleteScheduledEmail,
        draftEmails,
        updateDraft,
        deleteDraft,
        sentEmails,
        addSentEmail,
        trackingEmails,
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        activities,
        addActivity,
        isGmailConnected,
        connectGmail,
        disconnectGmail,
        generateEmailFromPrompt,
        isGeneratingAI,
        completeScheduleOrSend,
        saveDraft,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};
