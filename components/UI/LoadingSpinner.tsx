import React from 'react';

const LoadingSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-t-primary border-r-transparent border-b-gray-300 border-l-gray-300 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
