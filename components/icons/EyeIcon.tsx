import React from 'react';

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.41 8.15 7.36 5 12 5s8.59 3.15 9.94 6.65a1 1 0 0 1 0 .7C20.59 15.85 16.64 19 12 19s-8.59-3.15-9.94-6.65" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
