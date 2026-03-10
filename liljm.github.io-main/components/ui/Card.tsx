import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-md p-6 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
