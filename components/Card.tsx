'use client';

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(234, 88, 12, 0.08), 0 8px 10px -6px rgba(234, 88, 12, 0.04)" }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(234,88,12,0.05)] border-2 border-border-warm ${className}`}
    >
      {children}
    </motion.div>
  );
}