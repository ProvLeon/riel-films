
import React, { Suspense } from 'react';
import { FilmDetailSkeleton } from '../skeletons/FilmDetailSkeleton';
import { FilmsPageSkeleton } from '../skeletons/FilmsPageSkeleton';
import { StoriesPageSkeleton } from '../skeletons/StoriesPageSkeleton';
import { StoryDetailSkeleton } from '../skeletons/StoryDetailSkeleton';

type SkeletonType = 'filmDetail' | 'films' | 'stories' | 'storyDetail' | 'default';

interface PageSkeletonProviderProps {
  children: React.ReactNode;
  type: SkeletonType;
}

const getSkeletonByType = (type: SkeletonType) => {
  switch (type) {
    case 'filmDetail':
      return <FilmDetailSkeleton />;
    case 'films':
      return <FilmsPageSkeleton />;
    case 'stories':
      return <StoriesPageSkeleton />;
    case 'storyDetail':
      return <StoryDetailSkeleton />;
    default:
      return <div className="p-8 text-center animate-pulse">Loading...</div>;
  }
};

export const PageSkeletonProvider: React.FC<PageSkeletonProviderProps> = ({
  children,
  type
}) => {
  return (
    <Suspense fallback={getSkeletonByType(type)}>
      {children}
    </Suspense>
  );
};
