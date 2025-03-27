"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilmsList } from "@/hooks/useFilmsList";

const HeroSection = () => {
  const { films, isLoading } = useFilmsList({ limit: 5 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-rotate featured content
  useEffect(() => {
    if (films.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % films.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [films.length]);

  if (isLoading || films.length === 0) {
    return (
      <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] h-[70vh] bg-gradient-to-r from-film-black-950 to-film-black-900 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-film-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const featuredFilm = films[currentSlide];

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Featured backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featuredFilm.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={featuredFilm.image || "/images/shade.png"}
              alt={featuredFilm.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />

            {/* Netflix-style gradient overlay that's stronger at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/90 to-transparent"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content area */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredFilm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Netflix-style large title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-none">
                {featuredFilm.title}
              </h1>

              {/* Film metadata row */}
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm">
                <span className="text-film-red-500 font-semibold">{featuredFilm.year}</span>
                <span className="bg-white/20 px-1 rounded">{featuredFilm.rating || "PG"}</span>
                <span>{featuredFilm.duration || "1h 45m"}</span>
                <span>{featuredFilm.category}</span>
              </div>

              {/* Description */}
              <p className="text-white text-lg mb-8 line-clamp-3 md:line-clamp-none">
                {featuredFilm.description || "Experience authentic African storytelling through our award-winning documentary films that capture the essence of the continent's diverse cultures and rich heritage."}
              </p>

              {/* Call-to-action buttons */}
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  <Link href={`/films/${featuredFilm.slug}`} className="flex items-center">
                    <Play className="mr-2 h-5 w-5" fill="currentColor" />
                    Watch Now
                  </Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href={`/films/${featuredFilm.slug}`} className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    More Info
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators (Netflix style dots) */}
      <div className="absolute bottom-10 right-10 flex space-x-2">
        {films.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
              ? "bg-white scale-110"
              : "bg-white/50 hover:bg-white/80"
              }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`View slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
