"use client";
import React from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: string | number;
  format?: string;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: any; // For additional Cloudinary transformations
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  quality = "auto",
  format = "auto",
  loading,
  placeholder,
  blurDataURL,
  style,
  onLoad,
  onError,
  ...rest
}) => {
  // Determine if the image is from Cloudinary or local
  const isCloudinaryImage = () => {
    // Check if src contains cloudinary patterns
    if (typeof src !== 'string') return false;

    return (
      src.includes('cloudinary.com') ||
      src.includes('res.cloudinary.com') ||
      src.startsWith('riel-films/') ||
      (!src.startsWith('/') && !src.startsWith('http') && !src.includes('.'))
    );
  };

  // Clean props for Next.js Image component
  const getNextImageProps = () => {
    const nextProps: any = {
      src,
      alt,
      className,
      priority,
      sizes,
      loading,
      placeholder,
      blurDataURL,
      style,
      onLoad,
      onError,
    };

    if (fill) {
      nextProps.fill = true;
    } else {
      nextProps.width = width;
      nextProps.height = height;
    }

    // Handle quality for Next.js Image
    if (quality && typeof quality === 'number') {
      nextProps.quality = quality;
    }

    return nextProps;
  };

  // Clean props for CldImage component
  const getCloudinaryProps = () => {
    const cldProps: any = {
      src,
      alt,
      className,
      priority,
      sizes,
      quality,
      format,
      style,
      onLoad,
      onError,
      ...rest, // Include any additional Cloudinary transformations
    };

    if (fill) {
      cldProps.fill = true;
    } else {
      cldProps.width = width;
      cldProps.height = height;
    }

    return cldProps;
  };

  // Handle error fallback
  const handleImageError = () => {
    if (onError) {
      onError();
    }
    console.warn(`Failed to load image: ${src}`);
  };

  try {
    if (isCloudinaryImage()) {
      // Use CldImage for Cloudinary images
      return (
        <CldImage
          {...getCloudinaryProps()}
          onError={handleImageError}
        />
      );
    } else {
      // Use Next.js Image for local/external images
      return (
        <Image
          {...getNextImageProps()}
          onError={handleImageError}
        />
      );
    }
  } catch (error) {
    console.error('SmartImage error:', error);

    // Fallback to a simple div with background color
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{
          width: !fill ? width : '100%',
          height: !fill ? height : '100%',
          ...style
        }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }
};

export default SmartImage;
