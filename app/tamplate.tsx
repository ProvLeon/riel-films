"use client";

import { motion } from "framer-motion";

// This template applies a transition effect to routes wrapped by it
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} // Start slightly lower and faded out
      animate={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
      exit={{ opacity: 0, y: -8 }} // Animate out slightly higher and faded
      transition={{
        type: "spring", // Use spring physics for a slightly bouncier feel
        damping: 25,
        stiffness: 120,
        duration: 0.3 // Adjust duration for speed
      }}
    >
      {children}
    </motion.div>
  );
}
