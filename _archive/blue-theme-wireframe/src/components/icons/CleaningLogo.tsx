import React from 'react';

interface CleaningLogoProps {
  size?: number;
  className?: string;
}

export function CleaningLogo({ size = 64, className = '' }: CleaningLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circular background */}
      <circle cx="100" cy="100" r="96" fill="url(#cleanGrad)" />

      {/* Inner circle border */}
      <circle cx="100" cy="100" r="88" stroke="white" strokeWidth="5" fill="none" opacity="0.3" />

      {/* Swirl / flowing element */}
      <path
        d="M90 30 C60 50, 40 80, 55 120 C65 145, 85 155, 100 160 C75 150, 55 130, 50 105 C45 80, 55 55, 90 30Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M105 25 C75 40, 50 70, 60 110 C68 138, 90 152, 108 158 C85 148, 65 128, 58 100 C50 70, 65 42, 105 25Z"
        fill="white"
        opacity="0.5"
      />

      {/* Broom handle */}
      <line
        x1="130"
        y1="60"
        x2="105"
        y2="145"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Broom head - bristles */}
      <path
        d="M88 135 L80 165 L90 168 L95 155 L100 170 L108 170 L112 155 L118 168 L128 162 L118 135Z"
        fill="white"
        strokeLinejoin="round"
      />

      {/* Broom head top bar */}
      <rect
        x="85"
        y="131"
        width="38"
        height="10"
        rx="3"
        fill="white"
      />

      {/* Sparkle star 1 - top right */}
      <g transform="translate(140, 50)">
        <path
          d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3Z"
          fill="white"
        />
      </g>

      {/* Sparkle star 2 - smaller, upper */}
      <g transform="translate(120, 35)">
        <path
          d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z"
          fill="white"
          opacity="0.85"
        />
      </g>

      {/* Sparkle star 3 - small accent */}
      <g transform="translate(155, 72)">
        <path
          d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5Z"
          fill="white"
          opacity="0.7"
        />
      </g>

      <defs>
        <linearGradient id="cleanGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4CA6FA" />
          <stop offset="100%" stopColor="#1D4AAD" />
        </linearGradient>
      </defs>
    </svg>
  );
}
