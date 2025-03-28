import React from 'react';
import Skeleton from '../Skeleton';

interface TabsSkeletonProps {
  tabCount?: number;
  selectedIndex?: number;
  withContent?: boolean;
  className?: string;
}

export const TabsSkeleton: React.FC<TabsSkeletonProps> = ({
  tabCount = 3,
  selectedIndex = 0,
  withContent = false,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex border-b border-gray-200 dark:border-film-black-800 mb-6">
        {Array.from({ length: tabCount }).map((_, i) => (
          <div key={i} className={`mr-6 pb-4 ${i === selectedIndex ? 'relative' : ''}`}>
            <Skeleton
              width={80}
              height={20}
              backgroundColor={i === selectedIndex ? "primary" : "default"}
            />
            {i === selectedIndex && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-film-red-600 dark:bg-film-red-500"></div>
            )}
          </div>
        ))}
      </div>

      {withContent && (
        <div className="space-y-4">
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="95%" />
          <Skeleton height={20} width="90%" />
          <Skeleton height={20} width="97%" />
        </div>
      )}
    </div>
  );
};
