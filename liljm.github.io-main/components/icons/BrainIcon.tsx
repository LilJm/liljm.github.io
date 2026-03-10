import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 5a3.5 3.5 0 0 0-3.5 3.5c0 1.3.5 2.5 1.4 3.2.9.7 2.1 1.1 3.4 1.1h1.4a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 12 5Z" />
    <path d="M4.5 13a3.5 3.5 0 0 1 0-7 .5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5Z" />
    <path d="M19.5 13a3.5 3.5 0 0 0 0-7 .5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5Z" />
    <path d="M12 13a8.5 8.5 0 0 0-8.5 8.5" />
    <path d="M12 13a8.5 8.5 0 0 1 8.5 8.5" />
    <path d="M12 2v3" />
    <path d="m6.5 6.5-1-1" />
    <path d="m17.5 6.5 1-1" />
  </svg>
);