export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  connectedGmail: string;
  connectedDate: string;
  isConnected: boolean;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  snippet: string;
  body: string;
  time: string;
  date: string;
  fullDate?: string;
  status: 'sent' | 'scheduled' | 'opened' | 'replied' | 'pending' | 'draft';
  isStarred?: boolean;
  isUnread?: boolean;
  isImportant?: boolean;
  avatarBg?: string;
  avatarText?: string;
  iconType?: 'team' | 'doc' | 'grad' | 'star' | 'mail' | 'google' | 'heart' | 'speaker';
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'doc' | 'image';
  };
  scheduledTime?: string;
  scheduledAt?: string;
  sentTime?: string;
  lastActivity?: string;
  type?: string;
}

export interface IntentData {
  recipient: string;
  purpose: string;
  tone: string;
  dateTime: string;
  keyPoints: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: 'Academic' | 'Professional' | 'Personal';
  body: string;
  isDefault?: boolean;
  iconBg?: string;
}

export interface ActivityItem {
  id: string;
  type: 'sent' | 'opened' | 'draft' | 'scheduled' | 'template';
  title: string;
  description: string;
  timestamp: string;
  iconBg: string;
}

export const initialUser: UserProfile = {
  name: 'Aarthi M',
  email: 'aarthi@example.com',
  role: 'Student',
  bio: 'Final year CSE student | AI Enthusiast',
  avatar: 'A',
  connectedGmail: 'aarthi@gmail.com',
  connectedDate: '10 Sep 2026',
  isConnected: true,
};

export const initialStats = {
  emailsSent: 12,
  emailsSentGrowth: 20,
  scheduled: 5,
  scheduledGrowth: 50,
  drafts: 8,
  draftsGrowth: 33,
  timeSaved: '4.8 hrs',
  timeSavedGrowth: 60,
  tracking: {
    sent: 12,
    opened: 8,
    replied: 3,
    pending: 1,
  },
};

export const initialScheduledEmails: EmailItem[] = [
  {
    id: 'sch-1',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'team@company.com',
    subject: 'Meeting Invitation',
    snippet: 'Invite team members for the weekly sprint sync.',
    body: 'Hi Team,\n\nPlease join us for our weekly project planning and sync meeting today.\n\nBest regards,\nAarthi',
    time: '5:00 PM',
    date: 'Today',
    scheduledTime: 'Today, 5:00 PM',
    status: 'scheduled',
    iconType: 'team',
    type: 'Scheduled Email',
  },
  {
    id: 'sch-2',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'mentor@pec.edu.in',
    subject: 'Project Update',
    snippet: 'Latest milestones reached for the capstone system.',
    body: 'Dear Mentor,\n\nHere is the latest progress report on our project development. All modules are proceeding on track.\n\nRegards,\nAarthi',
    time: '10:00 AM',
    date: '22 Sep 2026',
    scheduledTime: '22 Sep 2026, 10:00 AM',
    status: 'scheduled',
    iconType: 'doc',
    type: 'Scheduled Email',
  },
  {
    id: 'sch-3',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'hr@company.com',
    subject: 'Follow Up',
    snippet: 'Following up on the interview feedback and status.',
    body: 'Dear Hiring Team,\n\nI hope you are having a wonderful week. I am following up regarding my recent interview discussion.\n\nThank you,\nAarthi',
    time: '9:00 AM',
    date: '23 Sep 2026',
    scheduledTime: '23 Sep 2026, 9:00 AM',
    status: 'scheduled',
    iconType: 'team',
    type: 'Scheduled Email',
  },
  {
    id: 'sch-4',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'professor@pec.edu.in',
    subject: 'Leave Request',
    snippet: 'Request for medical leave permission for tomorrow.',
    body: 'Dear Professor,\n\nI am writing to request permission for leave tomorrow due to health reasons.\n\nSincerely,\nAarthi',
    time: '9:00 AM',
    date: '24 Sep 2026',
    scheduledTime: '24 Sep 2026, 9:00 AM',
    status: 'scheduled',
    iconType: 'grad',
    type: 'Scheduled Email',
  },
  {
    id: 'sch-5',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'recruiter@xyz.com',
    subject: 'Thank You',
    snippet: 'Appreciation email following our technical round.',
    body: 'Dear Recruiter,\n\nThank you for the opportunity to interview with your team today. I look forward to the next steps.\n\nBest,\nAarthi',
    time: '4:00 PM',
    date: '25 Sep 2026',
    scheduledTime: '25 Sep 2026, 4:00 PM',
    status: 'scheduled',
    iconType: 'star',
    type: 'Scheduled Email',
  },
];

export const initialSentEmails: EmailItem[] = [
  {
    id: 'sent-1',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'team@company.com',
    subject: 'Project Update',
    snippet: 'Review and update document for capstone architecture.',
    body: 'Hi Team,\n\nPlease review the updated architecture documentation and provide your comments.\n\nBest,\nAarthi',
    time: '10:20 AM',
    date: '18 Sep 2026',
    sentTime: '18 Sep 2026, 10:20 AM',
    status: 'sent',
    iconType: 'doc',
  },
  {
    id: 'sent-2',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'hr@xyz.com',
    subject: 'Morning Follow Up',
    snippet: 'Morning sync regarding schedule confirmation.',
    body: 'Dear HR Team,\n\nConfirming my availability for tomorrow morning discussion.\n\nRegards,\nAarthi',
    time: '03:15 PM',
    date: '17 Sep 2026',
    sentTime: '17 Sep 2026, 03:15 PM',
    status: 'sent',
    iconType: 'team',
  },
  {
    id: 'sent-3',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'mentor@pec.edu.in',
    subject: 'Meeting Invitation',
    snippet: 'Review slot booking for project demo.',
    body: 'Respected Mentor,\n\nRequested a 15-minute slot for demonstrating the current frontend build.\n\nThank you,\nAarthi',
    time: '11:09 AM',
    date: '16 Sep 2026',
    sentTime: '16 Sep 2026, 11:09 AM',
    status: 'sent',
    iconType: 'team',
  },
  {
    id: 'sent-4',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'recruiter@abc.com',
    subject: 'Thank You',
    snippet: 'Grateful for the insightful discussion.',
    body: 'Dear Hiring Manager,\n\nThank you for sharing valuable insights about the engineering culture.\n\nBest regards,\nAarthi',
    time: '09:30 AM',
    date: '15 Sep 2026',
    sentTime: '15 Sep 2026, 09:30 AM',
    status: 'sent',
    iconType: 'star',
  },
  {
    id: 'sent-5',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'professor@pec.edu.in',
    subject: 'Leave Request',
    snippet: 'Prior absence approval submitted.',
    body: 'Respected Professor,\n\nSubmitting my leave application for the previous lab session.\n\nSincerely,\nAarthi',
    time: '05:10 PM',
    date: '14 Sep 2026',
    sentTime: '14 Sep 2026, 05:10 PM',
    status: 'sent',
    iconType: 'grad',
  },
];

export const initialTrackingEmails: EmailItem[] = [
  {
    id: 'trk-1',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'team@company.com',
    subject: 'Project Update',
    snippet: 'Capstone project progress review.',
    body: 'Hi Team,\n\nHere is the latest update on our project...',
    time: '10:45 AM',
    date: '18 Sep 2026',
    lastActivity: '18 Sep 2026, 10:45 AM',
    status: 'opened',
    iconType: 'doc',
  },
  {
    id: 'trk-2',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'client@company.com',
    subject: 'Meeting Invitation',
    snippet: 'Client sync session agenda.',
    body: 'Dear Client,\n\nLooking forward to meeting you tomorrow at 3 PM.\n\nBest,\nAarthi',
    time: '04:20 PM',
    date: '17 Sep 2026',
    lastActivity: '17 Sep 2026, 04:20 PM',
    status: 'replied',
    iconType: 'team',
  },
  {
    id: 'trk-3',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'hr@xyz.com',
    subject: 'Follow Up',
    snippet: 'Application status inquiry.',
    body: 'Dear HR,\n\nFollowing up on my profile review.\n\nSincerely,\nAarthi',
    time: '11:30 AM',
    date: '16 Sep 2026',
    lastActivity: '16 Sep 2026, 11:30 AM',
    status: 'opened',
    iconType: 'doc',
  },
  {
    id: 'trk-4',
    sender: 'Aarthi M',
    senderEmail: 'aarthi@example.com',
    recipient: 'recruiter@abc.com',
    subject: 'Thank You',
    snippet: 'Post-interview note.',
    body: 'Dear Recruiter,\n\nThank you for the opportunity.\n\nBest,\nAarthi',
    time: '09:20 AM',
    date: '15 Sep 2026',
    lastActivity: '15 Sep 2025, 09:20 AM',
    status: 'pending',
    iconType: 'star',
  },
];

export const initialTemplates: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Leave Request',
    subject: 'Request for Leave',
    description: 'Request leave from professor or manager',
    category: 'Academic',
    body: 'Dear Sir/Madam,\n\nI am writing to request permission for leave on [date] due to [reason].\n\nI will make sure to complete any pending work.\n\nThank you for your understanding.\n\nYours sincerely,\n[Your Name]',
    isDefault: true,
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'tpl-2',
    name: 'Meeting Invitation',
    subject: 'Meeting Invitation: [Topic]',
    description: 'Invite teammates or clients for a meeting',
    category: 'Professional',
    body: 'Hi [Name],\n\nI would like to invite you for a discussion regarding [Topic] on [Date] at [Time].\n\nPlease let me know if this time works for you.\n\nBest regards,\n[Your Name]',
    isDefault: false,
    iconBg: 'bg-rose-100 text-rose-600',
  },
  {
    id: 'tpl-3',
    name: 'Project Update',
    subject: 'Project Update - [Project Name]',
    description: 'Share project progress',
    category: 'Professional',
    body: 'Hi Team,\n\nHere is the latest progress update for [Project Name]. We have achieved [Milestone] and next steps include [Next Steps].\n\nBest regards,\n[Your Name]',
    isDefault: false,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'tpl-4',
    name: 'Follow Up',
    subject: 'Following Up on [Subject]',
    description: 'Polite follow up email',
    category: 'Professional',
    body: 'Hi [Name],\n\nI wanted to gently follow up on my previous message regarding [Subject]. Looking forward to hearing from you.\n\nBest regards,\n[Your Name]',
    isDefault: false,
    iconBg: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'tpl-5',
    name: 'Thank You',
    subject: 'Thank You - [Context]',
    description: 'Express gratitude',
    category: 'Personal',
    body: 'Dear [Name],\n\nThank you so much for your support and guidance regarding [Context]. I truly appreciate your time and help.\n\nWarm regards,\n[Your Name]',
    isDefault: false,
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'sent',
    title: 'Email sent',
    description: 'Project Update to team@company.com',
    timestamp: '2 hrs ago',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    id: 'act-2',
    type: 'opened',
    title: 'Email opened',
    description: 'Meeting Invitation by client@company.com',
    timestamp: '5 hrs ago',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'act-3',
    type: 'draft',
    title: 'Draft saved',
    description: 'Leave Request',
    timestamp: '1 day ago',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'act-4',
    type: 'scheduled',
    title: 'Email scheduled',
    description: 'Follow Up to hr@xyz.com',
    timestamp: '1 day ago',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'act-5',
    type: 'template',
    title: 'Template created',
    description: 'Thank You Template',
    timestamp: '2 days ago',
    iconBg: 'bg-rose-100 text-rose-600',
  },
];

export const initialInboxEmails: EmailItem[] = [
  {
    id: 'inbox-1',
    sender: 'Project Guide',
    senderEmail: 'professor@pec.edu.in',
    recipient: 'me',
    subject: 'Project Update',
    snippet: 'Please check the updated project document and make the required changes...',
    body: `Hi Aarthi,\n\nPlease check the updated project document and make the required changes before tomorrow. Also, include the latest references in the report.\n\nLet me know if you have any doubts.\n\nRegards,\nDr. K. Sharma\nProject Guide\nPrathyusha Engineering College`,
    time: '10:32 AM',
    date: 'Today',
    fullDate: '20 Sep 2026, 10:32 AM',
    status: 'opened',
    isStarred: false,
    isUnread: true,
    isImportant: true,
    avatarBg: 'bg-purple-100 text-purple-700',
    avatarText: 'PG',
    attachment: {
      name: 'Project_Document.pdf',
      size: '1.2 MB',
      type: 'pdf',
    },
  },
  {
    id: 'inbox-2',
    sender: 'Placement Cell',
    senderEmail: 'placement@pec.edu.in',
    recipient: 'me',
    subject: 'Internship Opportunity',
    snippet: 'Applications are now open for summer internship drives with leading tech firms...',
    body: `Dear Students,\n\nApplications are now officially open for summer 2026 internship programs. Eligible students should register on the portal before Friday 5 PM.\n\nBest,\nPlacement Cell`,
    time: '9:15 AM',
    date: 'Today',
    fullDate: '20 Sep 2026, 9:15 AM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-indigo-100 text-indigo-700',
    avatarText: 'PC',
  },
  {
    id: 'inbox-3',
    sender: 'Project Team',
    senderEmail: 'team@pec.edu.in',
    recipient: 'me',
    subject: 'Meeting Tomorrow',
    snippet: 'Our meeting is scheduled for tomorrow at 11 AM in Lab 3...',
    body: `Hey Aarthi,\n\nQuick reminder that our sprint coordination meeting is scheduled for tomorrow at 11 AM. Let's wrap up the UI modules.\n\nCheers,\nProject Team`,
    time: 'Yesterday',
    date: 'Yesterday',
    fullDate: '19 Sep 2026, 04:15 PM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-cyan-100 text-cyan-700',
    avatarText: 'PT',
  },
  {
    id: 'inbox-4',
    sender: 'Google',
    senderEmail: 'no-reply@accounts.google.com',
    recipient: 'me',
    subject: 'Security alert',
    snippet: 'A new sign-in was detected on your account...',
    body: `Hi Aarthi,\n\nYour Google Account was recently linked to GenMail via OAuth 2.0. If you authorized this action, you don't need to do anything.\n\nGoogle Security Team`,
    time: 'Yesterday',
    date: 'Yesterday',
    fullDate: '19 Sep 2026, 02:30 PM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-amber-100 text-amber-700',
    avatarText: 'G',
  },
  {
    id: 'inbox-5',
    sender: 'Friend - Divya',
    senderEmail: 'divya@student.pec.edu.in',
    recipient: 'me',
    subject: 'Notes for AI Exam',
    snippet: 'Here are the notes you asked for from unit 4 & 5...',
    body: `Hey Aarthi,\n\nAttached are my lecture summary notes and formula sheets for the upcoming AI test. Good luck studying!\n\nDivya`,
    time: '18 Sep',
    date: '18 Sep',
    fullDate: '18 Sep 2026, 06:10 PM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-blue-100 text-blue-700',
    avatarText: 'FR',
  },
  {
    id: 'inbox-6',
    sender: 'HR Team',
    senderEmail: 'webinars@techcorp.com',
    recipient: 'me',
    subject: 'Webinar Invitation',
    snippet: 'You are invited to join our upcoming webinar on Generative AI pipelines...',
    body: `Hello,\n\nJoin industry experts this Thursday as we explore modern generative AI applications and agentic architectures.\n\nWarm regards,\nHR & Campus Outreach`,
    time: '17 Sep',
    date: '17 Sep',
    fullDate: '17 Sep 2026, 11:00 AM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-orange-100 text-orange-700',
    avatarText: 'HR',
  },
  {
    id: 'inbox-7',
    sender: 'Lab Coordinator',
    senderEmail: 'lab@pec.edu.in',
    recipient: 'me',
    subject: 'Lab Record Submission',
    snippet: 'Please submit your lab records before Friday...',
    body: `Dear Students,\n\nAll pending lab observation notebooks and digital reports must be submitted before Friday 4:00 PM for grading.\n\nLab Coordinator`,
    time: '16 Sep',
    date: '16 Sep',
    fullDate: '16 Sep 2026, 03:00 PM',
    status: 'opened',
    isStarred: true,
    isUnread: false,
    avatarBg: 'bg-fuchsia-100 text-fuchsia-700',
    avatarText: 'LC',
  },
  {
    id: 'inbox-8',
    sender: 'Noreply@pec.edu.in',
    senderEmail: 'noreply@pec.edu.in',
    recipient: 'me',
    subject: 'Exam Time Table',
    snippet: 'The end semester examination timetable is now published...',
    body: `Greetings,\n\nThe provisional end-semester exam timetable for semester 7 has been released on the university notice board.\n\nController of Examinations`,
    time: '15 Sep',
    date: '15 Sep',
    fullDate: '15 Sep 2026, 09:00 AM',
    status: 'opened',
    isStarred: false,
    isUnread: false,
    avatarBg: 'bg-purple-100 text-purple-700',
    avatarText: 'N',
  },
];
