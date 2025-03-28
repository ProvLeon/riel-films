import React from 'react';
import Skeleton from '../Skeleton';

interface NewsletterSkeletonProps {
  simplified?: boolean;
  className?: string;
}

export const NewsletterSkeleton: React.FC<NewsletterSkeletonProps> = ({
  simplified = false,
  className = "",
}) => {
  return (
    <div className={`bg-gray-50 dark:bg-film-black-800/50 rounded-xl p-6 ${className}`}>
      <Skeleton height={32} width="70%" className="mx-auto mb-4" />
      <Skeleton height={18} width="90%" className="mx-auto mb-2" />
      {!simplified && (
        <Skeleton height={18} width="80%" className="mx-auto mb-6" />
      )}

      <div className="flex items-center gap-2 max-w-md mx-auto">
        <Skeleton height={42} width="70%" className="rounded-full" />
        <Skeleton height={42} width="30%" className="rounded-full" backgroundColor="primary" />
      </div>

      {!simplified && (
        <Skeleton height={14} width="60%" className="mx-auto mt-4" />
      )}
    </div>
  );
};
