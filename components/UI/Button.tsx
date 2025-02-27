import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-film-red-600 text-white hover:bg-film-red-700 focus:ring-film-red-500 dark:bg-film-red-600 dark:hover:bg-film-red-500",
        secondary:
          "bg-transparent border-2 border-film-black-900 text-film-black-900 hover:bg-film-black-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-film-black-900 focus:ring-film-black-900 dark:focus:ring-white",
        outline:
          "bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 focus:ring-white",
        ghost:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-film-black-800 text-film-black-900 dark:text-white",
        link:
          "bg-transparent underline-offset-4 hover:underline text-film-black-900 dark:text-white hover:bg-transparent",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-6 py-2.5",
        lg: "h-12 px-8 py-3 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {!isLoading && icon && (
          <span className={cn("mr-2", { "mr-0": !children })}>{icon}</span>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
