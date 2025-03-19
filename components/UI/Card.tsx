import React from "react";
import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import Image from "next/image";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  variant?: "default" | "outline" | "ghost";
  isHoverable?: boolean;
  isInteractive?: boolean;
  isAnimated?: boolean;
  motionProps?: MotionProps;
  children?: React.ReactNode;
}

const cardVariants = {
  default: "bg-film-warmWhite-100 dark:bg-film-black-800 shadow-lg",
  outline:
    "bg-film-warmWhite-50 dark:bg-film-black-800 border border-film-warmWhite-300 dark:border-film-black-700",
  ghost: "bg-film-warmWhite-200 dark:bg-film-black-900/60",
};

// Create a non-typed wrapper for motion.div to bypass TypeScript errors
// This is an escape hatch for the type system
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.FC<any>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      isHoverable = false,
      isInteractive = false,
      isAnimated = false,
      motionProps,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "rounded-xl overflow-hidden transition-all duration-300",
      cardVariants[variant],
      {
        "transform hover:-translate-y-1 hover:shadow-xl": isHoverable,
        "cursor-pointer active:scale-[0.98]": isInteractive,
      },
      className
    );

    if (isAnimated) {
      // Use the non-typed wrapper component
      return (
        <MotionDiv
          ref={ref}
          className={baseStyles}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          {...motionProps}
          {...props}
        >
          {children}
        </MotionDiv>
      );
    }

    return (
      <div ref={ref} className={baseStyles} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold text-film-black-900 dark:text-white",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-300", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string;
    alt: string;
    aspectRatio?: string;
    overlay?: boolean;
  }
>(
  (
    {
      className,
      src,
      alt,
      aspectRatio = "aspect-video",
      overlay = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", aspectRatio, className)}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-film-black-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
  )
);

CardImage.displayName = "CardImage";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
};
