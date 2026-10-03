import React from 'react';
import { Link } from 'react-router-dom';

interface GenMailLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  to?: string;
  className?: string;
}

export const GenMailLogo: React.FC<GenMailLogoProps> = ({
  size = 'md',
  showTagline = true,
  to = '/',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#635BFF] via-[#7C3AED] to-[#9333EA] shadow-md ${iconSizes[size]} text-white flex-shrink-0`}>
        {/* Sparkle badge on top-left of icon */}
        <span className="absolute -top-1.5 -left-1.5 text-xs text-indigo-300">✦</span>
        {/* Envelope Icon with check fold */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white transform -rotate-1"
        >
          <rect width="20" height="15" x="2" y="4.5" rx="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
          <path d="m22 7.5-8.97 5.7a2 2 0 0 1-2.06 0L2 7.5" stroke="currentColor" />
          <path d="m8.5 12.5 2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-[#13182E] leading-none ${textSizes[size]}`}>
          Gen<span className="text-[#635BFF]">Mail</span>
        </span>
        {showTagline && (
          <span className="text-[10.5px] font-medium text-[#64748B] tracking-normal mt-0.5">
            Write Smarter. Send Faster.
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
