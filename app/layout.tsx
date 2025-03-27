import { Providers } from "./providers";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css"
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { Suspense } from "react";

// Define fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: "Riel Films - Creative Production MA",
  description: "Professional film and creative production education",
};

const AnalyticsFallback = () => null;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Suspense fallback={<AnalyticsFallback />}>
          <PageViewTracker pageType="other" />
        </Suspense>
      </body>
    </html >
  );
}
