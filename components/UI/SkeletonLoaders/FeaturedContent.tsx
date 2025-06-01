import React from 'react';
import Skeleton from '../Skeleton';

interface FeaturedContentSkeletonProps {
  withImage?: boolean;
  withBadge?: boolean;
  className?: string;
}

export const FeaturedContentSkeleton: React.FC<FeaturedContentSkeletonProps> = ({
  withImage = true,
  withBadge = true,
  className = "",
}) => {
  return (
    <div className={`bg-white dark:bg-film-black-900 overflow-hidden rounded-xl shadow-sm ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {withImage && (
          <div className="relative">
            <Skeleton variant="rectangular" height={400} width="100%" />
            {withBadge && (
              <div className="absolute top-4 left-4">
                <Skeleton height={28} width={120} className="rounded-full" backgroundColor="primary" />
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton height={16} width={80} />
            <Skeleton height={16} width={80} />
          </div>

          <Skeleton height={40} width="90%" className="mb-4" />
          <Skeleton height={20} width="100%" className="mb-2" />
          <Skeleton height={20} width="95%" className="mb-2" />
          <Skeleton height={20} width="90%" className="mb-6" />

          <div className="flex items-center mb-6">
            <Skeleton variant="circular" height={40} width={40} className="mr-3" />
            <Skeleton height={16} width={120} />
          </div>

          <Skeleton height={48} width={160} className="rounded-full" backgroundColor="primary" />
        </div>
      </div>
    </div>
  );
};
