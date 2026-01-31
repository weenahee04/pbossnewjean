import React from 'react';

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'horizontal' | 'list';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/50 ${className}`}>
        <div className="size-20 bg-gray-200 rounded-lg shrink-0 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`p-5 flex gap-4 border-b border-gray-100 ${className}`}>
        <div className="size-12 rounded-full bg-gray-200 shrink-0 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 rounded-xl ${className}`}>
      <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonCard;
