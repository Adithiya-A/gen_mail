import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createEmail,
  getEmails,
  updateEmail,
  deleteEmail,
  sendEmail,
} from '../services/emailService';

import {
  connectGmail as requestGmailConnection,
  getGmailStatus,
  disconnectGmail as requestGmailDisconnection,
} from '../services/gmailService';

import {
  createTemplate,
  getTemplates,
  updateTemplate as updateTemplateRequest,
  deleteTemplate as deleteTemplateRequest,
} from '../services/templateService';

import {
  Contact,
  ContactCreate,
  ContactUpdate,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contactsService';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import {
  UserProfile,
  IntentData,
  EmailItem,
  EmailTemplate,
  ActivityItem,
  initialUser,
  initialStats,
  initialScheduledEmails,
  initialSentEmails,
  initialTrackingEmails,
  initialTemplates,
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
  scheduledAt?: string;
  sendReminder: boolean;
}

interface EmailAttachment {
  name: string;
  size: number;
  type?: string;
  data: string;
}

type BackendEmailItem = Omit<EmailItem, 'attachment'> & {
  attachments: EmailAttachment[];
};

interface EmailContextType {
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => Promise<void>;
  stats: typeof initialStats;

  // Prompt & AI Generation Pipeline
  promptConfig: PromptConfig;
  setPromptConfig: React.Dispatch<React.SetStateAction<PromptConfig>>;
  intentData: IntentData;
  setIntentData: React.Dispatch<React.SetStateAction<IntentData>>;
  updateIntentItem: (key: keyof IntentData, val: any) => void;

  generatedDraft: {
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{
      name: string;
      size: number;
      type?: string;
      data: string;
    }>;
  };

  setGeneratedDraft: React.Dispatch<
    React.SetStateAction<{
      to: string;
      subject: string;
      body: string;
      attachments?: Array<{
        name: string;
        size: number;
        type?: string;
        data: string;
      }>;
    }>
  >;

  scheduleConfig: ScheduleConfig;
  setScheduleConfig: React.Dispatch<React.SetStateAction<ScheduleConfig>>;

  // Data lists
  inboxEmails: BackendEmailItem[];
  selectedInboxEmail: BackendEmailItem | null;
  setSelectedInboxEmail: (email: BackendEmailItem | null) => void;
  toggleStarInbox: (id: string) => void;
  toggleReadInbox: (id: string) => void;
  deleteInboxEmail: (id: string) => void;
  syncInbox: () => void;
  isSyncing: boolean;

  scheduledEmails: BackendEmailItem[];
  addScheduledEmail: (email: Omit<BackendEmailItem, 'id'>) => void;
  deleteScheduledEmail: (id: string) => Promise<void>;

  draftEmails: BackendEmailItem[];
  updateDraft: (
    id: string,
    email: {
      to: string;
      subject: string;
      body: string;
      attachments?: EmailAttachment[];
    }
  ) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;

  sentEmails: BackendEmailItem[];
  addSentEmail: (email: Omit<BackendEmailItem, 'id'>) => void;
  deleteSentEmail: (id: string) => Promise<void>;

  trackingEmails: BackendEmailItem[];

  templates: EmailTemplate[];

  addTemplate: (
    tpl: Omit<EmailTemplate, 'id'>
  ) => Promise<void>;

  updateTemplate: (
    id: string,
    tpl: Partial<EmailTemplate>
  ) => Promise<void>;

  deleteTemplate: (
    id: string
  ) => Promise<void>;

  activities: ActivityItem[];
  addActivity: (act: Omit<ActivityItem, 'id'>) => void;

  contacts: Contact[];
  loadContacts: () => Promise<void>;
  addContact: (data: ContactCreate) => Promise<Contact>;
  editContact: (
    id: string,
    data: ContactUpdate
  ) => Promise<Contact>;
  removeContact: (id: string) => Promise<void>;

  // Gmail OAuth State
  isGmailConnected: boolean;
  connectGmail: () => Promise<string>;
  disconnectGmail: () => Promise<void>;

  // AI Pipeline Actions
  generateEmailFromPrompt: (customPrompt?: string) => Promise<void>;
  isGeneratingAI: boolean;
  currentEmailId: string | null;
  setCurrentEmailId: (id: string | null) => void;
  completeScheduleOrSend: (
    overrideConfig?: Partial<ScheduleConfig>
  ) => Promise<string>;

  // Toasts
  toasts: ToastNotification[];
  showToast: (
    title: string,
    message: string,
    type?: 'success' | 'info' | 'error'
  ) => void;
  removeToast: (id: string) => void;

  saveDraft: (
    email: {
      to: string;
      subject: string;
      body: string;
      attachments?: EmailAttachment[];
    }
  ) => Promise<string>;
}

const EmailContext = createContext<EmailContextType | undefined>(
  undefined
);

export const EmailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [stats, setStats] = useState(initialStats);
  const [isGmailConnected, setIsGmailConnected] =
    useState<boolean>(false);

  // Workflow states
  const [promptConfig, setPromptConfig] =
    useState<PromptConfig>({
      promptText:
        'Write an email to my professor requesting permission for leave tomorrow due to health issues.',
      tone: 'Professional',
      length: 'Medium',
      purpose: 'Request',
      attachmentName: '',
    });

  const [intentData, setIntentData] =
    useState<IntentData>({
      recipient: 'professor@pec.edu.in',
      purpose: 'Request for leave',
      tone: 'Professional',
      dateTime: 'Tomorrow (Auto-detected)',
      keyPoints: [
        'Health issues',
        'Need rest',
        'Will complete pending work',
      ],
    });

  const [generatedDraft, setGeneratedDraft] =
    useState({
      to: '',
      subject: '',
      body: '',
      attachments: [] as EmailAttachment[],
    });

  const [currentEmailId, setCurrentEmailId] =
    useState<string | null>(null);

  const todayFormatted =
    new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const [scheduleConfig, setScheduleConfig] =
    useState<ScheduleConfig>({
      sendType: 'later',
      date: todayFormatted,
      time: '06:00 PM',
      timeZone:
        '(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi',
      sendReminder: true,
    });

  // Collections
  const [inboxEmails, setInboxEmails] =
    useState<BackendEmailItem[]>([]);

  const [selectedInboxEmail, setSelectedInboxEmail] =
    useState<BackendEmailItem | null>(null);

  const [isSyncing, setIsSyncing] =
    useState(false);

  const [scheduledEmails, setScheduledEmails] =
    useState<BackendEmailItem[]>([]);

  const [draftEmails, setDraftEmails] =
    useState<BackendEmailItem[]>([]);

  const [sentEmails, setSentEmails] =
    useState<BackendEmailItem[]>([]);

  const [trackingEmails, setTrackingEmails] =
    useState<BackendEmailItem[]>([]);

  const [templates, setTemplates] =
    useState<EmailTemplate[]>(initialTemplates);

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [contacts, setContacts] =
    useState<Contact[]>([]);

  const [isGeneratingAI, setIsGeneratingAI] =
    useState(false);

  const [toasts, setToasts] =
    useState<ToastNotification[]>([]);

  const convertBackendEmail = (
    email: any
  ): BackendEmailItem => {
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

      attachments: email.attachments ?? [],

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
        ? new Date(
            email.scheduled_at
          ).toLocaleString()
        : undefined,

      scheduledAt: email.scheduled_at
        ? new Date(
            email.scheduled_at
          ).toISOString()
        : undefined,

      sentTime: email.sent_at
        ? new Date(
            email.sent_at
          ).toLocaleString()
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

  const loadActivitiesFromBackend = async () => {
    try {
      const result = await getEmails();

      const backendEmails = result.emails || [];

      const emailActivities: ActivityItem[] =
        backendEmails.flatMap((email: any) => {
          const activities: ActivityItem[] = [];

          if (email.sent_at) {
            activities.push({
              id: `sent-${email.id}`,
              type: 'sent',
              title: 'Email sent',
              description:
                `${email.subject} to ${email.to}`,
              timestamp:
                new Date(
                  email.sent_at
                ).toLocaleString(),
              iconBg:
                'bg-emerald-100 text-emerald-600',
            });
          }

          if (email.scheduled_at) {
            activities.push({
              id: `scheduled-${email.id}`,
              type: 'scheduled',
              title: 'Email scheduled',
              description:
                `${email.subject} to ${email.to}`,
              timestamp:
                new Date(
                  email.scheduled_at
                ).toLocaleString(),
              iconBg:
                'bg-purple-100 text-purple-600',
            });
          }

          if (
            email.status?.toLowerCase() === 'draft' &&
            email.created_at
          ) {
            activities.push({
              id: `draft-${email.id}`,
              type: 'draft',
              title: 'Draft saved',
              description: email.subject,
              timestamp:
                new Date(
                  email.created_at
                ).toLocaleString(),
              iconBg:
                'bg-amber-100 text-amber-600',
            });
          }

          return activities;
        });

      setActivities(emailActivities);
    } catch (error) {
      console.error(
        'Failed to load activities from backend:',
        error
      );
    }
  };

  const loadTemplatesFromBackend = async () => {
    try {
      const result = await getTemplates();

      const backendTemplates =
        result.templates || [];

      setTemplates(backendTemplates);
    } catch (error) {
      console.error(
        'Failed to load templates from backend:',
        error
      );
    }
  };

  const loadUserProfile = async (
    firebaseUser: any
  ) => {
    try {
      const profileRef = doc(
        db,
        'users',
        firebaseUser.uid,
        'profile',
        'data'
      );

      const profileSnapshot =
        await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        setUser((prev) => ({
          ...prev,
          name:
            firebaseUser.displayName ||
            prev.name,
          email:
            firebaseUser.email ||
            prev.email,
          avatar: firebaseUser.displayName
            ? firebaseUser.displayName
                .charAt(0)
                .toUpperCase()
            : prev.avatar,
        }));

        return;
      }

      const profileData =
        profileSnapshot.data();

      setUser((prev) => ({
        ...prev,
        ...profileData,
        name:
          profileData.name ||
          firebaseUser.displayName ||
          prev.name,
        email:
          profileData.email ||
          firebaseUser.email ||
          prev.email,
        avatar:
          profileData.avatar ||
          (firebaseUser.displayName
            ? firebaseUser.displayName
                .charAt(0)
                .toUpperCase()
            : prev.avatar),
      }));
    } catch (error) {
      console.error(
        'Failed to load user profile:',
        error
      );

      setUser((prev) => ({
        ...prev,
        name:
          firebaseUser.displayName ||
          prev.name,
        email:
          firebaseUser.email ||
          prev.email,
        avatar: firebaseUser.displayName
          ? firebaseUser.displayName
              .charAt(0)
              .toUpperCase()
          : prev.avatar,
      }));
    }
  };

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(
        'Failed to load contacts:',
        error
      );
    }
  };

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (!firebaseUser) {
            setIsGmailConnected(false);
            return;
          }

          await loadUserProfile(
            firebaseUser
          );

          await loadEmailsFromBackend();
          await loadActivitiesFromBackend();
          await loadTemplatesFromBackend();
          await loadContacts();

          try {
            const gmailStatus =
              await getGmailStatus();

            setIsGmailConnected(
              Boolean(
                gmailStatus.connected
              )
            );

            setUser((prev) => ({
              ...prev,
              isConnected: Boolean(
                gmailStatus.connected
              ),
              connectedGmail:
                gmailStatus.email || '',
              connectedDate:
                gmailStatus.connected_at
                  ? new Date(
                      gmailStatus.connected_at
                    ).toLocaleDateString(
                      'en-US',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )
                  : '',
            }));
          } catch (error) {
            console.error(
              'Failed to load Gmail connection status:',
              error
            );

            setIsGmailConnected(false);

            setUser((prev) => ({
              ...prev,
              isConnected: false,
            }));
          }
        }
      );

    return unsubscribe;
  }, []);

  const showToast = (
    title: string,
    message: string,
    type:
      | 'success'
      | 'info'
      | 'error' = 'success'
  ) => {
    const id = Date.now().toString();

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  const updateUser = async (
    fields: Partial<UserProfile>
  ) => {
    try {
      const firebaseUser =
        auth.currentUser;

      if (!firebaseUser) {
        throw new Error(
          'User is not authenticated'
        );
      }

      const updatedUser = {
        ...user,
        ...fields,
      };

      await setDoc(
        doc(
          db,
          'users',
          firebaseUser.uid,
          'profile',
          'data'
        ),
        {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          updated_at:
            new Date().toISOString(),
        },
        { merge: true }
      );

      setUser(updatedUser);

      showToast(
        'Profile Updated',
        'Your profile changes have been saved successfully.'
      );
    } catch (error) {
      console.error(
        'Failed to update profile:',
        error
      );

      showToast(
        'Profile Update Failed',
        error instanceof Error
          ? error.message
          : 'Unable to save your profile changes.',
        'error'
      );
    }
  };

  const connectGmail =
    async (): Promise<string> => {
      return await requestGmailConnection();
    };

  const disconnectGmail =
    async (): Promise<void> => {
      try {
        await requestGmailDisconnection();

        setIsGmailConnected(false);

        setUser((prev) => ({
          ...prev,
          isConnected: false,
          connectedGmail: '',
          connectedDate: '',
        }));

        showToast(
          'Gmail Disconnected',
          'Your Gmail account has been disconnected.',
          'info'
        );
      } catch (error) {
        console.error(
          'Failed to disconnect Gmail:',
          error
        );

        showToast(
          'Gmail Disconnect Failed',
          error instanceof Error
            ? error.message
            : 'Unable to disconnect Gmail.',
          'error'
        );

        throw error;
      }
    };

  const updateIntentItem = (
    key: keyof IntentData,
    val: any
  ) => {
    setIntentData((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const generateEmailFromPrompt =
    async (customPrompt?: string) => {
      setIsGeneratingAI(true);

      const text =
        customPrompt ||
        promptConfig.promptText;

      let rec =
        'professor@pec.edu.in';

      let pur =
        'Request for leave';

      let subj =
        'Request for Leave Tomorrow';

      let points = [
        'Health issues',
        'Need rest',
        'Will complete pending work',
      ];

      let dt =
        'Tomorrow (Auto-detected)';

      let bodyText = `Dear Sir/Madam,

I hope you are doing well. I am writing to request permission for leave tomorrow due to health issues. I am currently not feeling well and need to take rest for a speedy recovery.

I will make sure to complete any pending work and stay updated with the class materials.

Thank you for your understanding.

Yours sincerely,
${user.name}`;

      const lower =
        text.toLowerCase();

      if (
        lower.includes('meeting') ||
        lower.includes(
          'schedule a meeting'
        )
      ) {
        rec =
          'team@company.com';

        pur =
          'Schedule Team Meeting';

        subj =
          'Meeting Invitation: Sprint Review & Planning';

        points = [
          'Sprint deliverables review',
          'Upcoming milestone timelines',
          'Q&A session',
        ];

        dt =
          'Tomorrow at 10:00 AM';

        bodyText = `Hi Team,

I would like to invite everyone for our sprint review meeting scheduled for tomorrow at 10:00 AM.

Agenda items include checking deliverables, unblocking hurdles, and scheduling upcoming milestones.

Please confirm your availability.

Best regards,
${user.name}`;
      } else if (
        lower.includes('follow up') ||
        lower.includes('follow-up')
      ) {
        rec =
          'hr@company.com';

        pur =
          'Follow Up on Interview';

        subj =
          'Following Up on Recent Interview - Application Status';

        points = [
          'Inquire on next steps',
          'Reiterate enthusiasm',
          'Available for further details',
        ];

        dt =
          'This week';

        bodyText = `Dear Hiring Team,

I hope you are doing well. I am following up on my recent interview round for the Software Engineer role.

I remain very enthusiastic about joining the team and would love to hear about the next steps.

Thank you for your time.

Warm regards,
${user.name}`;
      } else if (
        lower.includes('project update') ||
        lower.includes('update')
      ) {
        rec =
          'team@company.com';

        pur =
          'Share Project Progress';

        subj =
          'Project Update: Milestone 3 Completed';

        points = [
          'Core frontend architecture ready',
          'API integration in progress',
          'Deployment ahead of schedule',
        ];

        dt = 'Today';

        bodyText = `Hi Team,

Here is the latest progress report on our project. Milestone 3 has been completed and test runs have passed without blockers.

Please let me know if you have any suggestions.

Best regards,
${user.name}`;
      }

      await new Promise((r) =>
        setTimeout(r, 700)
      );

      setIntentData({
        recipient: rec,
        purpose: pur,
        tone: promptConfig.tone,
        dateTime: dt,
        keyPoints: points,
      });

      setGeneratedDraft((prev) => ({
        ...prev,
        to: rec,
        subject: subj,
        body: bodyText,
        attachments: prev.attachments ?? [],
      }));

      setIsGeneratingAI(false);
    };

  const saveDraft = async (email: {
    to: string;
    subject: string;
    body: string;
    attachments?: EmailAttachment[];
  }) => {
    const result =
      await createEmail({
        to: email.to,
        subject: email.subject,
        body: email.body,
        attachments:
          email.attachments ?? [],
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
      attachments?: EmailAttachment[];
    }
  ) => {
    await updateEmail(id, {
      to: email.to,
      subject: email.subject,
      body: email.body,
      attachments:
        email.attachments,
    });

    await loadEmailsFromBackend();

    showToast(
      'Draft Updated',
      'Your draft has been updated successfully.'
    );
  };

  const deleteDraft = async (
    id: string
  ) => {
    await deleteEmail(id);

    await loadEmailsFromBackend();

    showToast(
      'Draft Deleted',
      'The draft has been deleted.',
      'info'
    );
  };

  const completeScheduleOrSend =
    async (
      overrideConfig?: Partial<ScheduleConfig>
    ): Promise<string> => {
      const effective = {
        ...scheduleConfig,
        ...(overrideConfig || {}),
      };

      console.log(
        'DEBUG generatedDraft before send/schedule:',
        generatedDraft
      );

      const isNow =
        effective.sendType === 'now';

      try {
        let emailId =
          currentEmailId;

        if (emailId) {
          await updateEmail(
            emailId,
            {
              to: generatedDraft.to,
              subject:
                generatedDraft.subject,
              body: generatedDraft.body,
              attachments:
                generatedDraft.attachments,
            }
          );
        }

        if (!emailId) {
          const result =
            await createEmail({
              to: generatedDraft.to,
              subject:
                generatedDraft.subject,
              body: generatedDraft.body,
              attachments:
                generatedDraft.attachments,
              scheduled_at: null,
            });

          emailId =
            result.email.id;

          setCurrentEmailId(
            emailId
          );
        }

        if (isNow) {
          await sendEmail(emailId);

          await loadEmailsFromBackend();

          setCurrentEmailId(null);

          addActivity({
            type: 'sent',
            title: 'Email sent',
            description:
              `${generatedDraft.subject} to ${generatedDraft.to}`,
            timestamp: 'Just now',
            iconBg:
              'bg-emerald-100 text-emerald-600',
          });

          showToast(
            'Email Sent Successfully!',
            `Delivered to ${generatedDraft.to} via Gmail.`
          );

          return emailId;
        }

        if (!effective.scheduledAt) {
          throw new Error(
            'Scheduled date and time are required.'
          );
        }

        await updateEmail(
          emailId,
          {
            to: generatedDraft.to,
            subject:
              generatedDraft.subject,
            body: generatedDraft.body,
            attachments:
              generatedDraft.attachments,
            scheduled_at:
              effective.scheduledAt,
            status: 'SCHEDULED',
          }
        );

        await loadEmailsFromBackend();

        setCurrentEmailId(null);

        addActivity({
          type: 'scheduled',
          title: 'Email scheduled',
          description:
            `${generatedDraft.subject} to ${generatedDraft.to}`,
          timestamp: 'Just now',
          iconBg:
            'bg-purple-100 text-purple-600',
        });

        showToast(
          'Email Scheduled!',
          `Queued for ${effective.date} at ${effective.time}`
        );

        return emailId;
      } catch (error) {
        console.error(
          'Failed to complete email action:',
          error
        );

        showToast(
          'Email Action Failed',
          error instanceof Error
            ? error.message
            : 'Failed to process email.',
          'error'
        );

        throw error;
      }
    };

  const toggleStarInbox = (
    id: string
  ) => {
    setInboxEmails((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isStarred:
                !item.isStarred,
            }
          : item
      )
    );

    if (
      selectedInboxEmail?.id === id
    ) {
      setSelectedInboxEmail(
        (prev) =>
          prev
            ? {
                ...prev,
                isStarred:
                  !prev.isStarred,
              }
            : null
      );
    }
  };

  const toggleReadInbox = (
    id: string
  ) => {
    setInboxEmails((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isUnread:
                !item.isUnread,
            }
          : item
      )
    );
  };

  const deleteInboxEmail = (
    id: string
  ) => {
    setInboxEmails((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    if (
      selectedInboxEmail?.id === id
    ) {
      setSelectedInboxEmail(
        null
      );
    }

    showToast(
      'Email Deleted',
      'Email moved to Trash.',
      'info'
    );
  };

  const syncInbox = () => {
    setIsSyncing(true);

    setTimeout(() => {
      setIsSyncing(false);

      showToast(
        'Inbox Synced',
        'All latest emails fetched from Gmail.'
      );
    }, 900);
  };

  const addScheduledEmail = (
    email: Omit<
      BackendEmailItem,
      'id'
    >
  ) => {
    const item: BackendEmailItem = {
      ...email,
      id: `sch-${Date.now()}`,
    };

    setScheduledEmails(
      (prev) => [item, ...prev]
    );
  };

  const deleteScheduledEmail =
    async (id: string) => {
      try {
        await deleteEmail(id);

        await loadEmailsFromBackend();

        showToast(
          'Scheduled Email Cancelled',
          'The email was removed from the schedule.',
          'info'
        );
      } catch (error) {
        console.error(
          'Failed to cancel scheduled email:',
          error
        );

        showToast(
          'Cancellation Failed',
          error instanceof Error
            ? error.message
            : 'Failed to cancel scheduled email.',
          'error'
        );
      }
    };

  const addSentEmail = (
    email: Omit<
      BackendEmailItem,
      'id'
    >
  ) => {
    const item: BackendEmailItem = {
      ...email,
      id: `sent-${Date.now()}`,
    };

    setSentEmails(
      (prev) => [item, ...prev]
    );
  };

  const deleteSentEmail =
    async (id: string) => {
      try {
        await deleteEmail(id);

        await loadEmailsFromBackend();

        showToast(
          'Sent Email Deleted',
          'The sent email has been deleted.',
          'info'
        );
      } catch (error) {
        console.error(
          'Failed to delete sent email:',
          error
        );

        showToast(
          'Delete Failed',
          error instanceof Error
            ? error.message
            : 'Failed to delete sent email.',
          'error'
        );
      }
    };

  const addTemplate = async (
    tpl: Omit<
      EmailTemplate,
      'id'
    >
  ) => {
    try {
      const response =
        await createTemplate({
          name: tpl.name,
          subject: tpl.subject,
          description:
            tpl.description,
          category: tpl.category,
          body: tpl.body,
          isDefault:
            tpl.isDefault,
          iconBg: tpl.iconBg,
        });

      const savedTemplate =
        response.template;

      setTemplates(
        (prev) => [
          savedTemplate,
          ...prev,
        ]
      );

      addActivity({
        type: 'template',
        title: 'Template created',
        description:
          `${tpl.name} Template`,
        timestamp:
          'Just now',
        iconBg:
          'bg-rose-100 text-rose-600',
      });

      showToast(
        'Template Saved',
        `"${tpl.name}" is now available in your template library.`
      );
    } catch (error) {
      console.error(
        'Failed to create template:',
        error
      );

      showToast(
        'Template Save Failed',
        error instanceof Error
          ? error.message
          : 'Unable to save template.',
        'error'
      );
    }
  };

  const updateTemplate = async (
    id: string,
    tpl: Partial<EmailTemplate>
  ) => {
    try {
      const response =
        await updateTemplateRequest(
          id,
          {
            name: tpl.name,
            subject:
              tpl.subject,
            description:
              tpl.description,
            category:
              tpl.category,
            body: tpl.body,
            isDefault:
              tpl.isDefault,
            iconBg:
              tpl.iconBg,
          }
        );

      const updatedTemplate =
        response.template;

      setTemplates(
        (prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedTemplate
              : item
          )
      );

      showToast(
        'Template Updated',
        'Template changes have been saved.'
      );
    } catch (error) {
      console.error(
        'Failed to update template:',
        error
      );

      showToast(
        'Template Update Failed',
        error instanceof Error
          ? error.message
          : 'Unable to update template.',
        'error'
      );
    }
  };

  const deleteTemplate = async (
    id: string
  ) => {
    try {
      await deleteTemplateRequest(
        id
      );

      setTemplates(
        (prev) =>
          prev.filter(
            (item) => item.id !== id
          )
      );

      showToast(
        'Template Deleted',
        'Template removed.',
        'info'
      );
    } catch (error) {
      console.error(
        'Failed to delete template:',
        error
      );

      showToast(
        'Template Delete Failed',
        error instanceof Error
          ? error.message
          : 'Unable to delete template.',
        'error'
      );
    }
  };

  const addActivity = (
    act: Omit<
      ActivityItem,
      'id'
    >
  ) => {
    const item: ActivityItem = {
      ...act,
      id: `act-${Date.now()}`,
    };

    setActivities(
      (prev) => [item, ...prev]
    );
  };

  const addContact = async (
    data: ContactCreate
  ) => {
    const contact =
      await createContact(data);

    setContacts(
      (prev) => [
        contact,
        ...prev,
      ]
    );

    return contact;
  };

  const editContact = async (
    id: string,
    data: ContactUpdate
  ) => {
    const updatedContact =
      await updateContact(
        id,
        data
      );

    setContacts(
      (prev) =>
        prev.map((contact) =>
          contact.id === id
            ? updatedContact
            : contact
        )
    );

    return updatedContact;
  };

  const removeContact = async (
    id: string
  ) => {
    await deleteContact(id);

    setContacts(
      (prev) =>
        prev.filter(
          (contact) =>
            contact.id !== id
        )
    );
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
        deleteSentEmail,
        trackingEmails,
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        activities,
        addActivity,
        contacts,
        loadContacts,
        addContact,
        editContact,
        removeContact,
        isGmailConnected,
        connectGmail,
        disconnectGmail,
        generateEmailFromPrompt,
        isGeneratingAI,
        currentEmailId,
        setCurrentEmailId,
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

export const useEmailContext =
  () => {
    const context =
      useContext(EmailContext);

    if (!context) {
      throw new Error(
        'useEmailContext must be used within an EmailProvider'
      );
    }

    return context;
  };