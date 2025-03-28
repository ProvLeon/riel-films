import React from 'react';
import { PageHeaderSkeleton } from '../UI/SkeletonLoaders/PageHeader';
import { GridSkeleton } from '../UI/SkeletonLoaders/Grid';

export const FilmsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <PageHeaderSkeleton
          withSubtitle={true}
          titleWidth="40%"
          className="mb-10"
        />

        {/* Filters skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-gray-200 dark:bg-film-black-800 rounded-full animate-pulse"
              ></div>
            ))}
          </div>

          <div className="h-10 w-40 bg-gray-200 dark:bg-film-black-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Films grid skeleton */}
        <GridSkeleton
          columns={4}
          count={12}
          cardProps={{
            hasImage: true,
            imageHeight: 250,
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
