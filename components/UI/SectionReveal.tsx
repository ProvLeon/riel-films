"use client";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  duration?: number;
}

const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.5
}) => {
  // Set initial and animate values based on direction
  const getDirectionVariants = () => {
    switch (direction) {
      case "up":
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 }
        };
      case "down":
        return {
          initial: { opacity: 0, y: -40 },
          animate: { opacity: 1, y: 0 }
        };
      case "left":
        return {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 }
        };
      case "right":
        return {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 }
        };
    }
  };

  const variants = getDirectionVariants();

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
