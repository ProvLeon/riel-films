import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return 'N/A'; // Handle null or undefined

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    // Check if the date is valid after conversion/directly
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return 'Invalid Date';
  }
}

// Keep other utility functions like getStatusColor, debounce etc.
export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'in production': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'pre-production': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'post-production': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'; // Example color
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  // Use an arrow function for the setTimeout callback
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    // The arrow function captures the 'this' from the outer scope where debounce was called
    timeout = setTimeout(() => {
      func.apply(this, args); // 'this' will be correct here
    }, wait);
  }) as T;
}
