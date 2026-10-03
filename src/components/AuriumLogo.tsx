import React from 'react';

interface AuriumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
  compactOnMobile?: boolean;
}

export const AuriumLogo: React.FC<AuriumLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = true,
  compactOnMobile = false,
}) => {
  const dimensions = {
    sm: {
      icon: 26,
      textClass: 'text-[11px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em]',
      subClass: 'text-[8px] sm:text-[9px] tracking-[0.25em]',
    },
    md: {
      icon: 30,
      textClass: 'text-xs sm:text-sm lg:text-base tracking-[0.16em] sm:tracking-[0.24em]',
      subClass: 'text-[8px] sm:text-[9px] tracking-[0.25em]',
    },
    lg: {
      icon: 46,
      textClass: 'text-base sm:text-xl tracking-[0.22em]',
      subClass: 'text-[10px] sm:text-xs tracking-[0.28em]',
    },
    xl: {
      icon: 64,
      textClass: 'text-xl sm:text-3xl tracking-[0.25em]',
      subClass: 'text-xs sm:text-sm tracking-[0.3em]',
    },
  }[size];

  return (
    <div className={`flex items-center gap-2 sm:gap-3.5 select-none shrink-0 ${className}`}>
      {/* Metallic Shield Crest */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient Gold Back-Glow */}
        {glow && (
          <div
            className="absolute inset-0 rounded-full bg-[#F5A623]/25 blur-lg pointer-events-none scale-125 animate-pulse"
            style={{ filter: 'blur(12px)' }}
          />
        )}

        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          <defs>
            <linearGradient id="shieldRimDark" x1="0" y1="0" x2="100" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#485366" />
              <stop offset="40%" stopColor="#1E2533" />
              <stop offset="70%" stopColor="#121721" />
              <stop offset="100%" stopColor="#2D3748" />
            </linearGradient>

            <linearGradient id="shieldRimGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="45%" stopColor="#F5A623" />
              <stop offset="85%" stopColor="#9C5A08" />
              <stop offset="100%" stopColor="#FFC857" />
            </linearGradient>

            <linearGradient id="facetLeft" x1="10" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1F2837" />
              <stop offset="100%" stopColor="#0B0F15" />
            </linearGradient>

            <linearGradient id="facetRight" x1="90" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#161C26" />
              <stop offset="100%" stopColor="#070A0F" />
            </linearGradient>

            <linearGradient id="silverBevel" x1="20" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="goldBevel" x1="80" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="25%" stopColor="#FFD15C" />
              <stop offset="60%" stopColor="#F5A623" />
              <stop offset="85%" stopColor="#C47306" />
              <stop offset="100%" stopColor="#784200" />
            </linearGradient>

            <linearGradient id="crossbarGrad" x1="30" y1="58" x2="70" y2="66" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="48%" stopColor="#CBD5E1" />
              <stop offset="52%" stopColor="#FFE082" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
          </defs>

          {/* Outer Angular Faceted Shield Outline */}
          <path
            d="M50 3 L94 18 V62 C94 88 50 112 50 112 C50 112 6 88 6 62 V18 L50 3 Z"
            fill="url(#shieldRimDark)"
            stroke="url(#shieldRimGold)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Inset Facet - Left */}
          <path
            d="M50 8 L12 21 V60 C12 82 50 104 50 104 V8 Z"
            fill="url(#facetLeft)"
            opacity="0.95"
          />

          {/* Inner Inset Facet - Right */}
          <path
            d="M50 8 L88 21 V60 C88 82 50 104 50 104 V8 Z"
            fill="url(#facetRight)"
            opacity="0.95"
          />

          <line x1="50" y1="8" x2="50" y2="104" stroke="rgba(245, 166, 35, 0.4)" strokeWidth="1" />

          {/* Split "A" Emblem: Silver Left & Gold Right */}
          <path
            d="M50 20 L27 75 L38 75 L46 55 L50 45 V20 Z"
            fill="url(#silverBevel)"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />

          <path
            d="M50 20 L73 75 L62 75 L54 55 L50 45 V20 Z"
            fill="url(#goldBevel)"
            stroke="#FFE57F"
            strokeWidth="0.5"
            strokeOpacity="0.6"
          />

          <polygon
            points="36,60 64,60 60,67 40,67"
            fill="url(#crossbarGrad)"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.5"
          />

          <polygon
            points="50,20 52,24 50,28 48,24"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 3px #FFE082)"
          />
        </svg>
      </div>

      {/* Exact Branding Text: AURIUM NETWORK with Wide Letter-Spacing */}
      {showText && (
        <div className="flex flex-col whitespace-nowrap min-w-0">
          <span
            className={`font-black uppercase text-[#F0F6FC] font-sans ${dimensions.textClass} flex items-center leading-tight`}
          >
            <span>AURIUM</span>
            <span className={`${compactOnMobile ? 'hidden md:inline' : 'inline'} text-[#F5A623] font-bold ml-1.5`}>
              NETWORK
            </span>
          </span>
          <span
            className={`${compactOnMobile ? 'hidden md:block' : 'hidden sm:block'} uppercase text-[#8B949E] font-medium ${dimensions.subClass} leading-tight mt-0.5`}
          >
            Decentralized Mobile Consensus
          </span>
        </div>
      )}
    </div>
  );
};
