import { Providers } from "./providers";
// Correct font imports
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { Suspense } from "react";

// Font configuration
const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // CSS variable for body font
});

const fontHeading = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', // CSS variable for headings
  weight: ['400', '500', '600', '700', '800'], // Include needed weights
});

export const metadata = {
  title: "Riel Films - Authentic African Storytelling", // Updated title
  description: "Crafting unforgettable cinematic experiences celebrating African narratives.", // Updated description
};

// Fallback for Suspense
const AnalyticsFallback = () => null;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Apply font variables to the html tag
      className={`${fontBody.variable} ${fontHeading.variable}`}
      suppressHydrationWarning
    >
      {/* Body tag should not have className here if fonts applied to html */}
      <body>
        <Providers>{children}</Providers>
        <Suspense fallback={<AnalyticsFallback />}>
          {/* Default tracker, page-specific trackers override */}
          <PageViewTracker pageType="other" />
        </Suspense>
      </body>
    </html>
  );
}
