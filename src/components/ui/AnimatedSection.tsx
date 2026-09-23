"use client";

import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";

// Expo-out easing shared by every scroll-reveal on the site
export const EASE_EXPO_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Level 2 motion (brand). Under prefers-reduced-motion we drop the travel and
// keep a short fade, so content still reads as "arriving" without the vestibular
// trigger of scroll-linked movement (WCAG 2.2 SC 2.3.3).
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_EXPO_OUT },
  },
};

const itemVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className, ...props }: AnimatedSectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedItem({ children, className, ...props }: AnimatedItemProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={reduceMotion ? itemVariantsReduced : itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
