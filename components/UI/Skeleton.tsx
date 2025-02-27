import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  let variantClasses = "";

  switch (variant) {
    case "text":
      variantClasses = "rounded";
      height = height || "1em";
      width = width || "100%";
      break;
    case "rectangular":
      variantClasses = "rounded-md";
      height = height || "100px";
      width = width || "100%";
      break;
    case "circular":
      variantClasses = "rounded-full";
      height = height || "40px";
      width = width || "40px";
      break;
  }

  const styles = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={styles}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
