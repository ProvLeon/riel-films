import React from 'react';
import Skeleton from '../Skeleton';

interface HeroSkeletonProps {
  height?: string;
  withGradient?: boolean;
  withBadge?: boolean;
  className?: string;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({
  height = "70vh",
  withGradient = true,
  withBadge = true,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <Skeleton
        variant="rectangular"
        height="100%"
        width="100%"
        className="absolute inset-0"
        animation="shimmer"
        backgroundColor="dark"
      />
      {withGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <div className="max-w-4xl">
              {withBadge && (
                <Skeleton height={28} width={80} className="rounded-full mb-4" />
              )}
              <Skeleton height={60} width="80%" className="mb-3" />
              <Skeleton height={60} width="60%" className="mb-6" />
              <Skeleton height={24} width="90%" className="mb-2" />
              <Skeleton height={24} width="85%" className="mb-2" />
              <Skeleton height={24} width="70%" className="mb-8" />
              <div className="flex flex-wrap gap-4">
                <Skeleton height={48} width={160} className="rounded-full" backgroundColor="primary" />
                <Skeleton height={48} width={120} className="rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
