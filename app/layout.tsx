import { ThemeProvider } from "@/context/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

// Define fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Real Films - Creative Production MA",
  description: "Professional film and creative production education",
};

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
      <head>
        {/* Add this script that runs before page renders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Get theme from localStorage or use system preference
                const storageKey = "real-fi-theme";
                const savedTheme = localStorage.getItem(storageKey);

                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (savedTheme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  // If theme is "system" or not set
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  document.documentElement.classList.add(systemTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
