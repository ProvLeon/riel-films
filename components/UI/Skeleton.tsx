import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names

const skeletonVariants = cva(
  "animate-pulse relative overflow-hidden",
  {
    variants: {
      variant: {
        text: "rounded",
        rectangular: "rounded-md",
        circular: "rounded-full",
        card: "rounded-lg",
      },
      shimmer: {
        true: "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/70 dark:before:via-gray-700/70 before:to-transparent",
        false: "",
      },
      backgroundColor: {
        default: "bg-gray-200 dark:bg-gray-700",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        light: "bg-gray-100 dark:bg-gray-800",
        dark: "bg-gray-300 dark:bg-gray-600",
      },
    },
    defaultVariants: {
      variant: "text",
      shimmer: true,
      backgroundColor: "default",
    },
  }
);

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
  VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "shimmer" | "none";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  shimmer = true,
  backgroundColor = "default",
  width,
  height,
  animation = "pulse",
  ...props
}) => {
  // Set default dimensions based on variant
  let defaultWidth, defaultHeight;

  switch (variant) {
    case "text":
      defaultWidth = "100%";
      defaultHeight = "1em";
      break;
    case "rectangular":
      defaultWidth = "100%";
      defaultHeight = "100px";
      break;
    case "circular":
      defaultWidth = "40px";
      defaultHeight = "40px";
      break;
    case "card":
      defaultWidth = "100%";
      defaultHeight = "200px";
      break;
  }

  const styles: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width || defaultWidth,
    height: typeof height === "number" ? `${height}px` : height || defaultHeight,
    ...(animation === "none" && { animation: "none" }),
  };

  return (
    <div
      className={cn(
        skeletonVariants({ variant, shimmer: animation === "shimmer", backgroundColor }),
        className
      )}
      style={styles}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
