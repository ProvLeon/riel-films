import React from 'react';
import Skeleton from '../Skeleton';

interface PageHeaderSkeletonProps {
  withSubtitle?: boolean;
  titleWidth?: string;
  subtitleWidth?: string;
  className?: string;
}

export const PageHeaderSkeleton: React.FC<PageHeaderSkeletonProps> = ({
  withSubtitle = true,
  titleWidth = "60%",
  subtitleWidth = "80%",
  className = "",
}) => {
  return (
    <div className={`mb-12 ${className}`}>
      <Skeleton height={48} width={titleWidth} className="mb-4" />
      {withSubtitle && (
        <>
          <Skeleton height={24} width={subtitleWidth} className="mb-2" />
          <Skeleton height={24} width="70%" />
        </>
      )}
    </div>
  );
};
