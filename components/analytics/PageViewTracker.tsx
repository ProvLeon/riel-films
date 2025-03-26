'use client';

import { initializeAnalytics, trackPageView } from "@/lib/analytics-client";
import { ContentType } from "@/types/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface PageViewTrackerProps {
  pageType: ContentType;
  itemId?: string;
  excludeRegex?: RegExp;
}

export default function PageViewTracker({
  pageType,
  itemId,
  excludeRegex = /^\/admin/ // Default: exclude admin paths
}: PageViewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewTracked = useRef(false);
  const initialized = useRef(false);
  const lastPathRef = useRef(pathname);

  // Initialize analytics system once per page load
  useEffect(() => {
    if (!initialized.current) {
      initializeAnalytics();
      initialized.current = true;
    }
  }, []);

  // Reset tracking flag when path or search params change
  useEffect(() => {
    // Don't track admin routes or excluded patterns
    if (excludeRegex && excludeRegex.test(pathname)) {
      viewTracked.current = true; // Mark as tracked to prevent tracking
      return;
    }

    // Only reset tracking when the main path changes (not just search params)
    if (pathname !== lastPathRef.current) {
      viewTracked.current = false;
      lastPathRef.current = pathname;
    }
  }, [pathname, searchParams, excludeRegex]);

  // Track the actual page view
  useEffect(() => {
    // Skip if already tracked or should be excluded
    if (viewTracked.current || (excludeRegex && excludeRegex.test(pathname))) {
      return;
    }

    // Use a slight delay to ensure content is loaded and allow browser to settle
    const timer = setTimeout(() => {
      // Determine the dynamic page type based on the URL if not provided
      let effectivePageType = pageType;

      if (pageType === 'other') {
        if (pathname === '/') effectivePageType = 'home';
        else if (pathname.startsWith('/films/')) effectivePageType = 'film';
        else if (pathname.startsWith('/productions/')) effectivePageType = 'production';
        else if (pathname.startsWith('/stories/')) effectivePageType = 'story';
        else if (pathname.startsWith('/about')) effectivePageType = 'about';
      }

      trackPageView(effectivePageType, itemId);
      viewTracked.current = true;
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, pageType, itemId]);

  return null; // This component doesn't render anything
}
