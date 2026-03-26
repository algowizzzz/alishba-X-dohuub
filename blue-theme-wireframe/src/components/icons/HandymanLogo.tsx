import React from 'react';

interface HandymanLogoProps {
  size?: number;
  className?: string;
}

export function HandymanLogo({ size = 64, className = '' }: HandymanLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* === TOOLBOX LID (tilted back/open) === */}
      {/* Lid outer shape */}
      <path
        d="M38 88 L52 32 L158 32 L168 88Z"
        fill="url(#handyLidGrad)"
        stroke="#C27803"
        strokeWidth="1.5"
      />
      {/* Lid inner face (darker) */}
      <path
        d="M44 84 L56 38 L154 38 L162 84Z"
        fill="#D97706"
        opacity="0.7"
      />
      {/* Lid top highlight */}
      <path
        d="M52 32 L158 32 L154 38 L56 38Z"
        fill="#FBBF24"
        opacity="0.6"
      />
      {/* Lid rim (yellow accent line at top) */}
      <rect x="50" y="29" width="110" height="5" rx="2" fill="#FCD34D" />

      {/* === HANDLE on lid === */}
      <rect x="85" y="16" width="40" height="8" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      {/* Handle supports */}
      <rect x="90" y="22" width="6" height="10" rx="1" fill="#D97706" />
      <rect x="114" y="22" width="6" height="10" rx="1" fill="#D97706" />

      {/* === TOOLBOX BODY (front face) === */}
      {/* Main body - slight perspective (wider at top) */}
      <path
        d="M32 90 L172 90 L165 178 Q165 184 159 184 L45 184 Q39 184 39 178Z"
        fill="url(#handyBodyGrad)"
      />
      {/* Body left side shadow */}
      <path
        d="M32 90 L39 184 L45 184 Q39 184 39 178 L32 90Z"
        fill="#92400E"
        opacity="0.3"
      />
      {/* Body right side highlight */}
      <path
        d="M172 90 L165 178 Q165 184 159 184 L155 184 L162 90Z"
        fill="#FBBF24"
        opacity="0.2"
      />
      {/* Rim at top of body */}
      <rect x="30" y="86" width="144" height="8" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      {/* Interior visible above tools */}
      <rect x="36" y="94" width="132" height="12" rx="2" fill="#92400E" opacity="0.5" />

      {/* === SIDE CLASPS === */}
      {/* Left clasp */}
      <rect x="50" y="120" width="16" height="20" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
      <rect x="53" y="124" width="10" height="4" rx="1" fill="#F59E0B" />
      {/* Right clasp */}
      <rect x="138" y="120" width="16" height="20" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
      <rect x="141" y="124" width="10" height="4" rx="1" fill="#F59E0B" />

      {/* === TOOLS === */}

      {/* HAMMER (left side) */}
      {/* Hammer handle */}
      <line x1="72" y1="48" x2="62" y2="88" stroke="#D2B48C" strokeWidth="5" strokeLinecap="round" />
      {/* Hammer head */}
      <path
        d="M55 42 L72 48 L70 54 L52 48Z"
        fill="#9CA3AF"
        stroke="#6B7280"
        strokeWidth="1"
      />
      {/* Hammer claw */}
      <path
        d="M55 42 L46 36 Q44 34 46 33 L50 35 L53 39Z"
        fill="#9CA3AF"
        stroke="#6B7280"
        strokeWidth="0.8"
      />
      {/* Hammer face */}
      <rect x="68" y="44" width="8" height="12" rx="1.5" fill="#6B7280" transform="rotate(-15 72 50)" />

      {/* SCREWDRIVER (center) */}
      {/* Screwdriver handle */}
      <rect x="95" y="60" width="10" height="28" rx="4" fill="#3B82F6" />
      {/* Handle ridge lines */}
      <line x1="96" y1="65" x2="104" y2="65" stroke="#2563EB" strokeWidth="0.8" />
      <line x1="96" y1="70" x2="104" y2="70" stroke="#2563EB" strokeWidth="0.8" />
      <line x1="96" y1="75" x2="104" y2="75" stroke="#2563EB" strokeWidth="0.8" />
      {/* Screwdriver shaft */}
      <rect x="98" y="42" width="4" height="20" rx="1" fill="#9CA3AF" />
      {/* Screwdriver tip */}
      <rect x="99" y="36" width="2" height="8" rx="0.5" fill="#6B7280" />
      {/* Handle cap */}
      <ellipse cx="100" cy="88" rx="5.5" ry="2.5" fill="#2563EB" />

      {/* WRENCH (right side, behind others) */}
      {/* Wrench handle */}
      <rect x="126" y="38" width="7" height="52" rx="2" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="0.8" transform="rotate(8 130 64)" />
      {/* Wrench head (open jaw) */}
      <path
        d="M124 30 L126 22 L130 18 L136 18 L140 22 L142 30 L137 32 L135 26 L131 26 L129 32Z"
        fill="#D1D5DB"
        stroke="#9CA3AF"
        strokeWidth="0.8"
      />

      {/* TAPE MEASURE (right side, in front) */}
      {/* Tape body (circular) */}
      <circle cx="148" cy="75" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      {/* Tape center button */}
      <circle cx="148" cy="75" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      {/* Tape strip extending right */}
      <rect x="160" y="72" width="22" height="6" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.5" />
      {/* Tape ruler markings */}
      <line x1="164" y1="72" x2="164" y2="75" stroke="#92400E" strokeWidth="0.5" />
      <line x1="168" y1="72" x2="168" y2="76" stroke="#92400E" strokeWidth="0.7" />
      <line x1="172" y1="72" x2="172" y2="75" stroke="#92400E" strokeWidth="0.5" />
      <line x1="176" y1="72" x2="176" y2="76" stroke="#92400E" strokeWidth="0.7" />
      {/* Tape end hook */}
      <rect x="180" y="71" width="3" height="8" rx="0.5" fill="#D97706" />

      <defs>
        {/* Lid gradient - lighter amber */}
        <linearGradient id="handyLidGrad" x1="38" y1="32" x2="168" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        {/* Body gradient - deeper amber/orange */}
        <linearGradient id="handyBodyGrad" x1="32" y1="90" x2="172" y2="184" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}
