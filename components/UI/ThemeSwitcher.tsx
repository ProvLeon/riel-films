"use client";

import { useTheme } from "@/context/ThemeProvider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Use resolvedTheme to determine which icon to show
  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-film-black-800 text-film-red-500 dark:text-film-red-400 hover:bg-film-red-50 dark:hover:bg-film-black-700 transition-colors focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:focus:ring-film-red-400 dark:focus:ring-offset-film-black-950"
      aria-label={isDark
        ? "Switch to light mode"
        : "Switch to dark mode"}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 45 : 0,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 0.5, ease: "easeInOut" },
          scale: { duration: 0.3 },
        }}
      >
        {isDark
          ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
          : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}
      </motion.div>
    </motion.button>
  );
}
