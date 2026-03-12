import React from 'react';

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
    <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c4.64 0 8.59 3.15 9.94 6.65a1 1 0 0 1 0 .7 11 11 0 0 1-4.12 5.06" />
    <path d="M6.61 6.61A11 11 0 0 0 2.06 11.65a1 1 0 0 0 0 .7C3.41 15.85 7.36 19 12 19a10.95 10.95 0 0 0 5.39-1.39" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);
