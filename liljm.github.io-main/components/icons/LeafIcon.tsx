
import React from 'react';

export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h1" />
    <path d="M12 10a5.2 5.2 0 0 0-5.2-5.2A6.2 6.2 0 0 1 12 2a6.2 6.2 0 0 1 5.2 2.8A5.2 5.2 0 0 0 12 10Z" />
    <path d="M13 20a7 7 0 0 0 7-7V8a2 2 0 0 0-2-2h-1" />
  </svg>
);
