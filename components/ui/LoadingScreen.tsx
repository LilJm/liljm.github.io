import React from 'react';

interface LoadingScreenProps {
  label: string;
  compact?: boolean;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ label, compact = false, overlay = false }) => {
  const containerClassName = overlay
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'
    : compact
      ? 'flex items-center justify-center p-8'
      : 'flex min-h-screen items-center justify-center bg-background dark:bg-gray-900';

  return (
    <div className={containerClassName}>
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;