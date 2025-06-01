'use client';

import { trackContentInteraction } from "@/lib/analytics-client";
import { ContentType } from "@/types/analytics";
import React, { useCallback } from "react";

interface EngagementTrackerProps {
  contentType: ContentType;
  contentId: string;
  contentTitle: string;
  contentCategory?: string;
  children: React.ReactNode;
  action?: 'click' | 'view' | 'play' | 'share';
  details?: Record<string, any>;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function EngagementTracker({
  contentType,
  contentId,
  contentTitle,
  contentCategory,
  children,
  action = 'click',
  details = {},
  className,
  onClick,
  ...props
}: EngagementTrackerProps & React.HTMLAttributes<HTMLDivElement>) {
  const handleInteraction = useCallback((e: React.MouseEvent) => {
    // Track the content interaction
    trackContentInteraction(
      contentType,
      action,
      {
        id: contentId,
        title: contentTitle,
        category: contentCategory
      },
      details
    );

    // Call original onClick if provided
    if (onClick) onClick(e);
  }, [contentType, action, contentId, contentTitle, contentCategory, details, onClick]);

  return (
    <div
      className={className}
      onClick={handleInteraction}
      {...props}
    >
      {children}
    </div>
  );
}
