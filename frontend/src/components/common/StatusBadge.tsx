import React from 'react';
import { Send, Calendar, Eye, MessageSquare, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const norm = status.toLowerCase();

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  if (norm === 'sent') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses} ${className}`}>
        <Send className="w-3 h-3 text-emerald-600" />
        <span>Sent</span>
      </span>
    );
  }

  if (norm === 'scheduled') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses} ${className}`}>
        <Calendar className="w-3 h-3 text-blue-600" />
        <span>Scheduled</span>
      </span>
    );
  }

  if (norm === 'opened') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 ${sizeClasses} ${className}`}>
        <Eye className="w-3 h-3 text-sky-600" />
        <span>Opened</span>
      </span>
    );
  }

  if (norm === 'replied') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses} ${className}`}>
        <MessageSquare className="w-3 h-3 text-emerald-600" />
        <span>Replied</span>
      </span>
    );
  }

  if (norm === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses} ${className}`}>
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Pending</span>
      </span>
    );
  }

  if (norm === 'draft') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200/80 ${sizeClasses} ${className}`}>
        <FileText className="w-3 h-3 text-slate-600" />
        <span>Draft</span>
      </span>
    );
  }

  if (norm === 'connected') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses} ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Connected</span>
      </span>
    );
  }

  // Category tags
  if (norm === 'academic') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 font-medium ${sizeClasses} ${className}`}>
        Academic
      </span>
    );
  }

  if (norm === 'professional') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 font-medium ${sizeClasses} ${className}`}>
        Professional
      </span>
    );
  }

  if (norm === 'personal') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 font-medium ${sizeClasses} ${className}`}>
        Personal
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses} ${className}`}>
      {status}
    </span>
  );
};
