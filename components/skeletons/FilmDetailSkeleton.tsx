import React from 'react';
import { HeroSkeleton } from '../UI/SkeletonLoaders/Hero';
import { TabsSkeleton } from '../UI/SkeletonLoaders/Tabs';
import Skeleton from '../UI/Skeleton';

export const FilmDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
      {/* Hero section skeleton */}
      <HeroSkeleton />

      {/* Content section skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation tabs skeleton */}
        <TabsSkeleton tabCount={3} selectedIndex={0} />

        {/* Tab content skeleton */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content area skeleton */}
          <div className="lg:w-2/3">
            <div className="mb-10">
              <Skeleton height={40} width="40%" className="mb-6" />
              <Skeleton height={24} width="100%" className="mb-3" />
              <Skeleton height={24} width="95%" className="mb-3" />
              <Skeleton height={24} width="90%" className="mb-3" />
              <Skeleton height={24} width="97%" className="mb-3" />
              <Skeleton height={24} width="85%" className="mb-3" />
            </div>

            {/* Awards section skeleton */}
            <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
              <Skeleton height={40} width="50%" className="mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton variant="circular" height={32} width={32} className="mr-3" backgroundColor="primary" />
                    <Skeleton height={20} width="80%" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews section skeleton */}
            <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
              <Skeleton height={40} width="45%" className="mb-6" />
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border-l-4 border-film-red-500 pl-6 py-2">
                    <Skeleton height={24} width="90%" className="mb-2" />
                    <Skeleton height={24} width="85%" className="mb-2" />
                    <Skeleton height={16} width="30%" className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:w-1/3">
            {/* Implementation of sidebar skeleton... */}
          </div>
        </div>
      </div>

      {/* Related Films section skeleton */}
      <div className="bg-gray-50 dark:bg-film-black-900 py-16">
        {/* Implementation of related films skeleton... */}
      </div>
    </div>
  );
};
