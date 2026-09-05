'use client';

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseClasses = "rounded-2xl font-medium transition-all duration-200 px-6 py-3 flex items-center justify-center";

  const primaryClasses = `
    bg-primary text-white border-b-4 border-b-primary-dark 
    hover:bg-primary-hover active:bg-primary-active active:translate-y-1 
    active:border-b-2 disabled:opacity-50 disabled:pointer-events-none
  `;

  const secondaryClasses = `
    border-2 border-primary text-primary hover:bg-primary/10 
    active:bg-primary/20 disabled:opacity-50 disabled:pointer-events-none
  `;

  const classes = `${baseClasses} ${
    variant === "primary" ? primaryClasses : secondaryClasses
  } ${className}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}