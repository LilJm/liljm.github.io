import React from 'react';

export const ReplaceIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M14 22v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" />
    <path d="m18 16-3-3-3 3" />
    <path d="M10 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="m6 8 3 3 3-3" />
  </svg>
);
