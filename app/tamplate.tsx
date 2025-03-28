"use client";

import { motion } from "framer-motion";

// This template allows for page transitions when navigating between routes
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
