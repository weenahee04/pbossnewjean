import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false, message = 'กำลังโหลด...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl animate-pulse">loyalty</span>
        </div>
      </div>
      {message && <p className="text-dark-green font-bold text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
