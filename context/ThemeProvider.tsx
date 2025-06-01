"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "dark", // Safer default for SSR
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to get the actual theme based on system preference
function getActualTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "dark"; // Default fallback for SSR
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "real-fi-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== "undefined"
      ? (localStorage.getItem(storageKey) as Theme) || defaultTheme
      : defaultTheme)
  );

  // Track the resolved theme separately from the preference
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getActualTheme(theme));

  // Apply theme immediately during initial client-side render to prevent flash
  useEffect(() => {
    // Add script to head to prevent flash of incorrect theme
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const storedTheme = localStorage.getItem("${storageKey}");
          const theme = storedTheme || "${defaultTheme}";
          const root = document.documentElement;

          root.classList.remove("light", "dark");

          if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
            root.classList.add(systemTheme);
          } else {
            root.classList.add(theme);
          }
        } catch (e) {
          console.error("Failed to set initial theme", e);
        }
      })();
    `;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // This useEffect will handle changes in theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const actualTheme = getActualTheme(theme);
    root.classList.add(actualTheme);
    setResolvedTheme(actualTheme);
  }, [theme]);

  // Listen for changes in system color scheme
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial setup
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    const isDark = mediaQuery.matches;
    root.classList.add(isDark ? "dark" : "light");
    setResolvedTheme(isDark ? "dark" : "light");

    // Handle system theme changes
    const handleChange = () => {
      if (theme === "system") {
        root.classList.remove("light", "dark");
        const newTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
