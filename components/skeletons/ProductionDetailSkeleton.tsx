import React from 'react';
import { HeroSkeleton } from '../UI/SkeletonLoaders/Hero';
import { TabsSkeleton } from '../UI/SkeletonLoaders/Tabs';
import Skeleton from '../UI/Skeleton';
import { GridSkeleton } from '../UI/SkeletonLoaders/Grid'; // Import GridSkeleton

export const ProductionDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950 pt-20 pb-20 animate-pulse"> {/* Reduced pt */}
      {/* Hero section skeleton */}
      <HeroSkeleton height="60vh" withGradient={true} withBadge={true} />

      {/* Progress Bar Section Skeleton */}
      <div className="bg-gray-50 dark:bg-film-black-900 py-10 border-b border-gray-200 dark:border-film-black-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <Skeleton height={28} width="40%" />
              <Skeleton height={28} width="15%" backgroundColor="primary" />
            </div>
            <Skeleton height={12} width="100%" className="rounded-full" />
            <div className="flex flex-wrap justify-between items-center mt-6 text-sm gap-y-3 gap-x-6">
              <Skeleton height={16} width="30%" />
              <Skeleton height={16} width="30%" />
              <Skeleton height={16} width="30%" />
            </div>
          </div>
        </div>
      </div>

      {/* Content section skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation tabs skeleton */}
        <TabsSkeleton tabCount={4} selectedIndex={0} className="mb-12 sticky top-[73px] bg-white dark:bg-film-black-950 z-20" /> {/* Made sticky */}

        {/* Tab content skeleton */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content area skeleton (Showing 'About' tab structure) */}
          <div className="lg:w-2/3 space-y-10">
            {/* About Section */}
            <div>
              <Skeleton height={40} width="50%" className="mb-6" />
              <Skeleton height={20} width="100%" className="mb-3" />
              <Skeleton height={20} width="95%" className="mb-3" />
              <Skeleton height={20} width="90%" className="mb-8" />
            </div>
            {/* Logline */}
            <div>
              <Skeleton height={28} width="30%" className="mb-4" />
              <Skeleton height={24} width="80%" />
            </div>
            {/* Synopsis */}
            <div>
              <Skeleton height={28} width="35%" className="mb-4" />
              <Skeleton height={18} width="100%" className="mb-2" />
              <Skeleton height={18} width="95%" className="mb-2" />
              <Skeleton height={18} width="98%" className="mb-2" />
              <Skeleton height={18} width="90%" />
            </div>
            {/* Production Details */}
            <div className="pt-8 border-t border-gray-200 dark:border-film-black-800">
              <Skeleton height={40} width="45%" className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton height={14} width="40%" className="mb-2" />
                    <Skeleton height={18} width="70%" />
                  </div>
                ))}
              </div>
            </div>
            {/* Production Process (Timeline) */}
            <div className="pt-8 border-t border-gray-200 dark:border-film-black-800">
              <Skeleton height={40} width="55%" className="mb-8" />
              <div className="relative pl-6 border-l-2 border-gray-200 dark:border-film-black-700 space-y-10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-film-black-950"></div>
                    <Skeleton height={28} width="40%" className="mb-3 rounded-full" />
                    <div className="space-y-2 pl-2">
                      <Skeleton height={16} width="80%" />
                      <Skeleton height={16} width="70%" />
                      <Skeleton height={16} width="75%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* FAQ */}
            <div className="pt-8 border-t border-gray-200 dark:border-film-black-800">
              <Skeleton height={40} width="30%" className="mb-6" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} height={76} width="100%" className="rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="lg:w-1/3">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Key Team Card */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <Skeleton height={30} width="40%" className="mb-5 pb-3 border-b border-gray-200 dark:border-film-black-700" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton variant="circular" width={40} height={40} className="mr-3" />
                      <div className='flex-1'>
                        <Skeleton height={16} width="70%" className="mb-1" />
                        <Skeleton height={12} width="50%" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton height={40} width="100%" className="mt-6 rounded-full" />
              </div>
              {/* Milestones Card */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <Skeleton height={30} width="60%" className="mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="pl-4 border-l-2 border-gray-300 dark:border-gray-700">
                      <Skeleton height={18} width="80%" className="mb-1" />
                      <Skeleton height={14} width="50%" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Support CTA Card */}
              <div className="bg-gradient-to-br from-film-red-600 to-film-red-800 dark:from-film-red-800 dark:to-film-black-900 rounded-xl p-6">
                <Skeleton height={30} width="50%" className="mb-4 bg-white/30" />
                <Skeleton height={16} width="90%" className="mb-2 bg-white/30" />
                <Skeleton height={16} width="80%" className="mb-6 bg-white/30" />
                <Skeleton height={44} width="100%" className="rounded-full bg-white/30" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Productions section skeleton */}
      <div className="bg-gray-50 dark:bg-film-black-900 py-16 mt-12">
        <div className="container mx-auto px-4">
          <Skeleton height={40} width="40%" className="mb-10" />
          <GridSkeleton columns={3} count={3} cardProps={{ hasImage: true, imageHeight: 200 }} />
          <div className="mt-10 text-center">
            <Skeleton height={44} width={180} className="rounded-full mx-auto" />
          </div>
        </div>
      </div>

      {/* Newsletter Section Skeleton */}
      <div className="bg-white dark:bg-film-black-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton height={40} width="60%" className="mb-4 mx-auto" />
            <Skeleton height={20} width="90%" className="mb-2 mx-auto" />
            <Skeleton height={20} width="80%" className="mb-8 mx-auto" />
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Skeleton height={48} width="70%" className="rounded-full" />
              <Skeleton height={48} width="30%" className="rounded-full" backgroundColor="primary" />
            </div>
            <Skeleton height={14} width="50%" className="mt-4 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
