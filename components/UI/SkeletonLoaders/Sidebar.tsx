import React from 'react';
import Skeleton from '../Skeleton';

interface SidebarSkeletonProps {
  sections?: number;
  withHeader?: boolean;
  className?: string;
}

export const SidebarSkeleton: React.FC<SidebarSkeletonProps> = ({
  sections = 3,
  withHeader = true,
  className = "",
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {withHeader && (
        <div className="mb-6">
          <Skeleton height={32} width="70%" className="mb-2" />
          <Skeleton height={16} width="90%" />
        </div>
      )}

      {Array.from({ length: sections }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton height={24} width="60%" className="mb-4" />

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center">
                <Skeleton variant="rectangular" width={64} height={64} className="rounded-md mr-3" />
                <div className="flex-1">
                  <Skeleton height={16} width="100%" className="mb-1" />
                  <Skeleton height={14} width="60%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
