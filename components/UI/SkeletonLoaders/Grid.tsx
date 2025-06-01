import React from 'react';
import { CardSkeleton } from './Card';

interface GridSkeletonProps {
  columns?: number;
  count?: number;
  className?: string;
  cardProps?: React.ComponentProps<typeof CardSkeleton>;
  component?: React.ReactNode;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  columns = 3,
  count = 6,
  className = "",
  cardProps,
  component
}) => {
  const gridClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns as 1 | 2 | 3 | 4] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridClassName} gap-8 ${className}`}>
      {[...Array(count)].map((_, index) => (
        component ? React.cloneElement(component as React.ReactElement, { key: index }) : (
          <CardSkeleton
            key={index}
            animation={index % 2 === 0 ? "shimmer" : "pulse"}
            {...cardProps}
          />
        )
      ))}
    </div>
  );
};
