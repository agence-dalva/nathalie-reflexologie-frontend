"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealVariant = "up" | "fade" | "blur";

const variantMap: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blur: {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variantMap[variant]}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrap several <RevealItem> to reveal them in a soft cascade as the group
 * scrolls into view.
 */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  variant = "up",
  duration = 0.8,
  className = "",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={variantMap[variant]}
      transition={{ duration, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
