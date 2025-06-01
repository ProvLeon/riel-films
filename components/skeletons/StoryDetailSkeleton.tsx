import React from 'react';
import Skeleton from '../UI/Skeleton';

export const StoryDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
      {/* Story header section */}
      <div className="bg-gray-50 dark:bg-film-black-900/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Skeleton height={12} width="30%" className="mb-6" backgroundColor="primary" />
            <Skeleton height={48} width="90%" className="mb-4" />
            <Skeleton height={48} width="75%" className="mb-8" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Skeleton variant="circular" height={50} width={50} className="mr-4" />
                <div>
                  <Skeleton height={16} width={120} className="mb-2" />
                  <Skeleton height={12} width={80} />
                </div>
              </div>
              <div>
                <Skeleton height={14} width={150} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton
            variant="rectangular"
            height={450}
            width="100%"
            className="rounded-xl mb-12"
          />

          {/* Article content */}
          <div className="max-w-3xl mx-auto space-y-6">
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton height={20} width={`${Math.random() * 30 + 70}%`} className="mb-2" />
                <Skeleton height={20} width={`${Math.random() * 20 + 80}%`} className="mb-2" />
                <Skeleton height={20} width={`${Math.random() * 40 + 60}%`} className="mb-8" />
              </React.Fragment>
            ))}

            <Skeleton height={300} width="100%" className="rounded-lg my-8" />

            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton height={20} width={`${Math.random() * 30 + 70}%`} className="mb-2" />
                <Skeleton height={20} width={`${Math.random() * 20 + 80}%`} className="mb-2" />
                <Skeleton height={20} width={`${Math.random() * 40 + 60}%`} className="mb-8" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Related stories */}
      <div className="bg-gray-50 dark:bg-film-black-900/30 py-16 mt-12">
        <div className="container mx-auto px-4">
          <Skeleton height={36} width={200} className="mb-10 mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="card"
                height={320}
                className="rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
