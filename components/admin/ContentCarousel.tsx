import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Play, Edit, Calendar, Clock, Star } from 'lucide-react';
import { Film, Production, Story } from '@/types/mongodbSchema';

interface ContentCarouselProps {
  title: string;
  items: (Film | Production | Story)[];
  type: 'film' | 'production' | 'story';
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, type }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const updateArrows = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setScrollPosition(scrollLeft);
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    const newPosition = direction === 'left'
      ? scrollPosition - scrollAmount
      : scrollPosition + scrollAmount;

    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  const getAdminUrl = (item: Film | Production | Story) => {
    return `/admin/${type}s/edit/${item.id}`;
  };

  const getPublicUrl = (item: Film | Production | Story) => {
    return `/${type}s/${item.slug}`;
  };

  // Use typeguard to check what type of item we have
  const isFilm = (item: Film | Production | Story): item is Film => {
    return 'year' in item;
  };

  const isProduction = (item: Film | Production | Story): item is Production => {
    return 'status' in item;
  };

  const isStory = (item: Film | Production | Story): item is Story => {
    return 'author' in item;
  };

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <Link
          href={`/admin/${type}s`}
          className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center text-sm"
        >
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="relative">
        {/* Left navigation arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={() => updateArrows()}
        >
          {items.map(item => (
            <motion.div
              key={item.id}
              className="flex-none w-72 relative"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <div className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-film-black-800">
                {/* Card image */}
                <div className="relative h-40 overflow-hidden">
                  <CldImage
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    format="auto" quality="auto" // Add optimizations
                    sizes="300px" // Rough size estimate for carousel item
                    onError={(e: any) => { e.target.src = '/images/placeholder.jpg'; }}
                  />

                  {/* Hover overlay with actions */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end justify-between p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={getPublicUrl(item)}
                      className="bg-white text-film-black-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      target="_blank"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                    </Link>

                    <Link
                      href={getAdminUrl(item)}
                      className="bg-film-red-600 text-white p-2 rounded-full hover:bg-film-red-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>

                {/* Card content */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>

                  <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
                    {isFilm(item) && (
                      <>
                        <span className="flex items-center mr-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.year}
                        </span>
                        {item.rating && (
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-amber-500" />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </>
                    )}

                    {isProduction(item) && (
                      <>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${item.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : item.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                          {item.status}
                        </span>
                        <span className="ml-2">{item.category}</span>
                      </>
                    )}

                    {isStory(item) && (
                      <>
                        <span className="flex items-center mr-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.readTime}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {isStory(item) ? item.excerpt : item.description} {/* Use excerpt for Story */}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right navigation arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentCarousel;
