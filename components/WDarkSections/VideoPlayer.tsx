import React from "react";
import Image from "next/image";

interface VideoPlayerProps {
  thumbnailSrc: string;
  videoId?: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (
  { thumbnailSrc, videoId, title },
) => {
  // State to track if the video is playing
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="w-full aspect-video bg-black/30 mb-8 overflow-hidden rounded-lg relative">
      {!isPlaying
        ? (
          <>
            <Image
              src={thumbnailSrc}
              width={1111}
              height={600}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={playVideo}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play video"
            >
              <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg group-hover:bg-yellow-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </button>
          </>
        )
        : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          >
          </iframe>
        )}
    </div>
  );
};

export default VideoPlayer;
