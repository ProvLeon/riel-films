"use client"
import { trackContentInteraction } from "@/lib/analytics-client";
import { ContentType } from "@/types/analytics";
import { Film } from "@/types/mongodbSchema";
import Link from "next/link";

export function LinkCard({
  data,
  href,
  className,
  children
}: {
  data: Film;
  href: string;
  className: string;
  children: React.ReactNode
}) {
  // Extract page type from href for analytics
  const getPageType = (): ContentType => {
    if (href.startsWith('/films')) return 'film';
    if (href.startsWith('/productions')) return 'production';
    if (href.startsWith('/stories')) return 'story';
    if (href === '/') return 'home';
    if (href.startsWith('/about')) return 'about';
    return 'other';
  };

  const pageType = getPageType();

  const handleClick = () => {
    trackContentInteraction(
      pageType,
      'click',
      {
        id: data.id,
        title: data.title,
        category: data.category
      },
      { linkDestination: href }
    );
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
