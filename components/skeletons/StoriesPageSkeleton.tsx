import React from 'react';
import { PageHeaderSkeleton } from '../UI/SkeletonLoaders/PageHeader';
import { GridSkeleton } from '../UI/SkeletonLoaders/Grid';
import { CardSkeleton } from '../UI/SkeletonLoaders/Card';

export const StoriesPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <PageHeaderSkeleton
          withSubtitle={true}
          titleWidth="50%"
          className="mb-10"
        />

        {/* Search and filters skeleton */}
        <div className="mb-8">
          <div className="max-w-xl mb-8">
            <div className="h-14 w-full bg-gray-200 dark:bg-film-black-800 rounded-xl animate-pulse"></div>
          </div>

          <div className="flex space-x-4 mb-10 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-none h-10 w-24 bg-gray-200 dark:bg-film-black-800 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Stories grid skeleton */}
        <GridSkeleton
          columns={3}
          count={9}
          cardProps={{
            hasImage: true,
            imageHeight: 200,
            hasFooter: true,
          }}
        />

        {/* Pagination skeleton */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 bg-gray-200 dark:bg-film-black-800 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
