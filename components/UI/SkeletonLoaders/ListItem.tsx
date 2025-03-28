import React from 'react';
import Skeleton from '../Skeleton';

interface ListItemSkeletonProps {
  hasImage?: boolean;
  imageSize?: number;
  hasAction?: boolean;
  className?: string;
}

export const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({
  hasImage = true,
  imageSize = 64,
  hasAction = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center p-4 border-b border-gray-100 dark:border-film-black-800 ${className}`}>
      {hasImage && (
        <Skeleton
          variant={imageSize > 40 ? "rectangular" : "circular"}
          width={imageSize}
          height={imageSize}
          className={`${imageSize > 40 ? 'rounded-md' : 'rounded-full'} mr-4 flex-shrink-0`}
        />
      )}

      <div className="flex-1">
        <Skeleton height={20} width="60%" className="mb-2" />
        <Skeleton height={16} width="85%" />
      </div>

      {hasAction && (
        <div className="flex-shrink-0 ml-4">
          <Skeleton variant="circular" width={36} height={36} />
        </div>
      )}
    </div>
  );
};
