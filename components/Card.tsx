import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl p-6 shadow-sm border-2 border-border-warm ${className}`}
    >
      {children}
    </motion.div>
  );
}