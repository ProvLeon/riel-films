"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface VideoSectionProps {
  videoThumbnail?: string;
  videoTitle?: string;
  videoDescription?: string;
  className?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoThumbnail = "/images/video-thumbnail.jpg",
  videoTitle = "Creative Production (Film) MA at Catalyst in Berlin",
  videoDescription = "Discover our unique approach to film education",
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // In a real implementation, you would trigger the video to play here
  };

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 ${className}`}
    >
      <motion.div
        className="rounded-xl overflow-hidden shadow-xl bg-film-black-900"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative aspect-video">
          {!isPlaying
            ? (
              <>
                <Image
                  src={videoThumbnail}
                  className="object-cover absolute inset-0 w-full h-full"
                  alt={videoTitle}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-film-black-900/80 via-film-black-900/30 to-transparent">
                  <div className="absolute top-6 left-6 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-film-red-600 flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5Z"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <path
                          d="M10 12V9L13 10.5L10 12Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                        {videoTitle}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {videoDescription}
                      </p>
                    </div>
                  </div>
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-film-red-600 hover:bg-film-red-700 text-white w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-film-red-500 focus:ring-opacity-50"
                    onClick={handlePlay}
                    aria-label="Play video"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-6 left-6 text-xs text-gray-400">
                    Watching this video may reveal your IP address to others.
                  </div>
                </div>
              </>
            )
            : (
              <div className="absolute inset-0 bg-film-black-900 flex items-center justify-center">
                <p className="text-white">
                  Video player would be embedded here
                </p>
                {/* In a real implementation, you would embed your video player here */}
              </div>
            )}
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
