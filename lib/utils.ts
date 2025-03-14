import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRevealClass(
  { id, isVisible }: { id: string; isVisible: Record<string, boolean> },
) {
  if (!id) return "";

  // Default to showing content if not tracked by intersection observer
  return isVisible[id] !== false
    ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 translate-y-5 transition-all duration-700 ease-out";
}
