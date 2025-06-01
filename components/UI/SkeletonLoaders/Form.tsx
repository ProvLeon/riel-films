import React from 'react';
import Skeleton from '../Skeleton';

interface FormSkeletonProps {
  fields?: number;
  hasSubmitButton?: boolean;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  hasSubmitButton = true,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={16} width={100} />
          <Skeleton height={42} width="100%" className="rounded-md" />
        </div>
      ))}

      {hasSubmitButton && (
        <div className="pt-4">
          <Skeleton height={48} width={150} className="rounded-full" backgroundColor="primary" />
        </div>
      )}
    </div>
  );
};
