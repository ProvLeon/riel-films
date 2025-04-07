import React from 'react';

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

// Function to extract YouTube Video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Standard watch URL
    if (hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      videoId = urlObj.searchParams.get('v');
    }
    // Shortened URL
    else if (hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
    // Embed URL
    else if (hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      videoId = urlObj.pathname.split('/')[2];
    }
  } catch (e) {
    // Fallback for URLs without protocol (less reliable)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      console.warn("Could not extract YouTube ID from URL:", url);
    }
  }
  return videoId;
};


const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, title = "YouTube video player", className = "aspect-video" }) => {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    console.warn("Invalid YouTube URL provided for embed:", videoUrl);
    return <div className={`w-full bg-black text-white flex items-center justify-center ${className}`}>Invalid Video URL</div>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1`; // Added autoplay and modestbranding

  return (
    <div className={`relative w-full overflow-hidden ${className}`}> {/* Ensure container maintains aspect ratio */}
      <iframe
        width="560" // Default width, but CSS will override
        height="315" // Default height, but CSS will override
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full" // Make iframe fill the container
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
