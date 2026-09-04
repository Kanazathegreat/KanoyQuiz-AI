import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border-2 border-border-warm ${className}`}>
      {children}
    </div>
  );
}