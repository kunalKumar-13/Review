"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  floatDuration?: number;
  floatDistance?: number;
}

export function FloatingCard({
  children,
  delay = 0,
  className = "",
  floatDuration = 4,
  floatDistance = 12,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      <motion.div
        animate={{
          y: [-floatDistance / 2, floatDistance / 2, -floatDistance / 2],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 2,
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
