import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image'; // Import standard Image component
import { CldImage } from 'next-cloudinary';
import { UploadCloud, X, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label: string;
  currentImageUrl: string | null | undefined;
  onUploadComplete: (url: string) => void;
  onRemoveComplete: () => void;
  required?: boolean;
  recommendedText?: string;
  aspectRatio?: string;
  className?: string;
  enablePreview?: boolean; // Keep this prop if needed elsewhere
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  label,
  currentImageUrl,
  onUploadComplete,
  onRemoveComplete,
  required = false,
  recommendedText,
  enablePreview = true, // Default to true
  aspectRatio = 'aspect-video',
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Preview state holds *what to display*, which might be local or the final URL
  const [displayPreview, setDisplayPreview] = useState<string | null>(currentImageUrl || null);

  // Update internal preview if the prop changes from parent
  useEffect(() => {
    setDisplayPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    const localPreviewUrl = URL.createObjectURL(file);
    setDisplayPreview(localPreviewUrl); // Show local preview immediately

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      console.log(`Upload successful for ${label}, URL: ${data.url}`); // Debug log

      onUploadComplete(data.url); // CRITICAL: Pass the final Cloudinary URL back up
      // Parent will update currentImageUrl, which triggers useEffect above to update displayPreview
      // setDisplayPreview(data.url); // Update display preview AFTER successful upload and parent update

    } catch (error: any) {
      console.error(`Upload failed for ${label}:`, error);
      setUploadError(error.message || 'Upload failed. Please try again.');
      setDisplayPreview(currentImageUrl || null); // Revert preview on error
    } finally {
      setIsUploading(false);
      // Revoke the local URL *after* potential state updates
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    }
  }, [onUploadComplete, currentImageUrl, label]); // Added currentImageUrl

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering dropzone
    setDisplayPreview(null);
    setUploadError(null);
    onRemoveComplete(); // Notify parent to clear its state
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading || !!displayPreview, // Disable dropzone when uploading or preview exists
  });

  // Determine if the preview URL is a Cloudinary URL
  const isCloudinaryUrl = displayPreview && displayPreview.includes('res.cloudinary.com');
  // Determine if it's a local static path
  const isLocalStaticPath = displayPreview && displayPreview.startsWith('/');

  return (
    <div className={cn("image-uploader", className)}>
      <label className="label-style">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={cn(`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors h-52 md:h-64
          ${isUploading ? 'cursor-not-allowed opacity-70' : ''}
          ${displayPreview ? 'border-solid border-gray-300 dark:border-film-black-700 p-0 hover:border-gray-400 dark:hover:border-film-black-600' : 'border-gray-300 dark:border-film-black-700 hover:border-film-red-400 cursor-pointer'}
          ${isDragActive ? 'border-film-red-500 bg-film-red-50 dark:bg-film-red-900/10' : 'bg-gray-50 dark:bg-film-black-800/50'}
        `)}
      >
        {/* Input needs to be present but can be hidden */}
        <input {...getInputProps()} className="hidden" />

        {isUploading && (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-white/80 dark:bg-film-black-900/80 z-20">
            <Loader2 className="h-10 w-10 text-film-red-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        )}

        {displayPreview && !isUploading && enablePreview ? (
          <div className={`relative w-full h-full ${aspectRatio}`}>
            {/* Conditionally render CldImage or next/image */}
            {isCloudinaryUrl ? (
              <CldImage
                src={displayPreview} // Cloudinary URL or Public ID
                alt="Preview"
                fill
                className="object-contain rounded" // Use contain to see the whole logo
                sizes="(max-width: 768px) 100vw, 50vw"
                format="auto"
                quality="auto"
                onError={(e: any) => { console.warn(`CldImage failed: ${displayPreview}`); setDisplayPreview(null); setUploadError("Invalid image."); onRemoveComplete(); }}
              />
            ) : isLocalStaticPath ? (
              <Image
                src={displayPreview} // Local path like /images/logo.png
                alt="Preview"
                fill
                className="object-contain rounded" // Use contain
                onError={(e: any) => { console.warn(`Image failed: ${displayPreview}`); setDisplayPreview(null); setUploadError("Invalid image path."); onRemoveComplete(); }}
              />
            ) : (
              // Render nothing or a placeholder if it's a blob URL (during upload transition) or other invalid type
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-film-black-800 rounded text-gray-400 text-sm">
                Image Loading...
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          !isUploading && ( // Show upload prompt only if no preview and not uploading
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <UploadCloud className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs mt-1">
                {recommendedText || 'PNG, JPG, GIF up to 5MB'}
              </p>
            </div>
          )
        )}
      </div>
      {uploadError && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" /> {uploadError}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
