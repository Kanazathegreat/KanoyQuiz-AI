import React from 'react';

interface MascotProps {
  className?: string;
}

export default function Mascot({ className = 'w-48 h-48' }: MascotProps) {
  return (
    <svg
      viewBox="0 0 380 380"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Maskot QuizAI</title>
      <path d="M70 90 L76 104 L90 110 L76 116 L70 130 L64 116 L50 110 L64 104 Z" fill="var(--secondary)"/>
      <path d="M310 130 L315 141 L326 146 L315 151 L310 162 L305 151 L294 146 L305 141 Z" fill="var(--secondary)"/>
      <path d="M300 260 L304 268 L312 272 L304 276 L300 284 L296 276 L288 272 L296 268 Z" fill="var(--secondary)"/>
      <ellipse cx="160" cy="322" rx="20" ry="12" fill="var(--primary-dark)"/>
      <ellipse cx="220" cy="322" rx="20" ry="12" fill="var(--primary-dark)"/>
      <path d="M105 195 Q60 165 55 120" fill="none" stroke="var(--primary-dark)" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="55" cy="112" r="14" fill="var(--primary)" stroke="var(--primary-dark)" strokeWidth="3"/>
      <path d="M270 210 Q305 225 300 255" fill="none" stroke="var(--primary-dark)" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="300" cy="262" r="14" fill="var(--primary)" stroke="var(--primary-dark)" strokeWidth="3"/>
      <ellipse cx="190" cy="205" rx="115" ry="105" fill="var(--primary)"/>
      <path d="M120 150 Q145 130 170 150" fill="none" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M200 145 Q225 122 255 140" fill="none" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M110 190 Q130 205 115 225" fill="none" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M265 185 Q280 200 268 220" fill="none" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M140 255 Q190 275 240 255" fill="none" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="150" cy="150" rx="30" ry="18" fill="var(--background)" opacity="0.5"/>
      <ellipse cx="140" cy="220" rx="16" ry="10" fill="var(--secondary)" opacity="0.55"/>
      <ellipse cx="240" cy="220" rx="16" ry="10" fill="var(--secondary)" opacity="0.55"/>
      <circle cx="158" cy="195" r="26" fill="var(--background)"/>
      <circle cx="222" cy="195" r="26" fill="var(--background)"/>
      <circle cx="164" cy="198" r="11" fill="var(--foreground)"/>
      <circle cx="228" cy="198" r="11" fill="var(--foreground)"/>
      <circle cx="160" cy="192" r="4" fill="var(--background)" opacity="0.5"/>
      <circle cx="224" cy="192" r="4" fill="var(--background)" opacity="0.5"/>
      <path d="M165 235 Q190 258 215 235" fill="none" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
