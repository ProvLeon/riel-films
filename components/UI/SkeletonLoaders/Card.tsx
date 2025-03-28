import React from 'react';
import Skeleton from '../Skeleton';

interface CardSkeletonProps {
  hasImage?: boolean;
  hasFooter?: boolean;
  imageHeight?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: "pulse" | "shimmer" | "none";
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasImage = true,
  hasFooter = true,
  imageHeight = 220,
  rounded = 'xl',
  animation = "shimmer",
  className = "",
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div className={`h-full flex flex-col overflow-hidden bg-white dark:bg-film-black-900 shadow-sm ${roundedClass} ${className}`}>
      {hasImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          width="100%"
          className={`rounded-t-${rounded}`}
          animation={animation}
        />
      )}
      <div className="p-6 flex-grow">
        <Skeleton height={28} width="80%" className="mb-2" />
        <Skeleton height={16} width="40%" className="mb-4" />
        <Skeleton height={18} width="100%" className="mb-2" />
        <Skeleton height={18} width="95%" className="mb-2" />
        <Skeleton height={18} width="90%" className="mb-4" />
        {hasFooter && (
          <div className="mt-4 flex items-center justify-between">
            <Skeleton height={20} width={120} backgroundColor="primary" />
            <Skeleton variant="circular" height={32} width={32} />
          </div>
        )}
      </div>
    </div>
  );
};
