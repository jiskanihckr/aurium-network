import React, { useState, useEffect } from 'react';

interface CircularHalvingGaugeProps {
  targetDateIso: string;
  currentEra?: number;
  baseYield?: number;
  className?: string;
}

export const CircularHalvingGauge: React.FC<CircularHalvingGaugeProps> = ({
  targetDateIso,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 7,
    minutes: 40,
    seconds: 28,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateIso).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateIso]);

  const targetDateFormatted = new Date(targetDateIso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedCountdown = `${String(timeLeft.days).padStart(2, '0')}d : ${String(
    timeLeft.hours
  ).padStart(2, '0')}h : ${String(timeLeft.minutes).padStart(2, '0')}m : ${String(
    timeLeft.seconds
  ).padStart(2, '0')}s`;

  return (
    <div className={`w-full flex items-center justify-center select-none ${className}`}>
      {/* Responsive Ring Proportions: max diameter ~216px on mobile so numbers never wrap awkwardly */}
      <div className="w-[216px] h-[216px] sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto relative flex items-center justify-center shrink-0">
        {/* Outer Ambient Glow Halo */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-[#F5A623]/15 blur-2xl pointer-events-none" />

        {/* Inner Recessed Well Backdrop */}
        <div className="w-[164px] h-[164px] sm:w-[196px] sm:h-[196px] md:w-[220px] md:h-[220px] rounded-full recessed-well border border-[#21262D] absolute pointer-events-none shadow-inner" />

        {/* SVG Orbital Metallic Rings & Glowing Arcs */}
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full absolute inset-0 pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="gaugeGoldArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="gaugeMetallicRing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E384D" />
              <stop offset="50%" stopColor="#141B26" />
              <stop offset="100%" stopColor="#2E384D" />
            </linearGradient>

            <filter id="gaugeArcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outermost Static Track Ring */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="url(#gaugeMetallicRing)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.6"
          />

          {/* 2. Outer Rotating Glowing Gold Arc (Clockwise) */}
          <g className="orbit-spin" style={{ transformOrigin: '160px 160px' }}>
            <circle
              cx="160"
              cy="160"
              r="144"
              fill="none"
              stroke="url(#gaugeGoldArc)"
              strokeWidth="3.5"
              strokeDasharray="90 270"
              strokeLinecap="round"
              filter="url(#gaugeArcGlow)"
            />
            {/* Lead Orbit Particle */}
            <circle cx="304" cy="160" r="3.5" fill="#FFE082" filter="drop-shadow(0 0 6px #F5A623)" />
          </g>

          {/* 3. Middle Static Metallic Separator Ring */}
          <circle
            cx="160"
            cy="160"
            r="132"
            fill="none"
            stroke="#1F2837"
            strokeWidth="1"
          />

          {/* 4. Inner Counter-Rotating Dual Arcs (Counter-Clockwise) */}
          <g className="orbit-spin-reverse" style={{ transformOrigin: '160px 160px' }}>
            <circle
              cx="160"
              cy="160"
              r="122"
              fill="none"
              stroke="url(#gaugeGoldArc)"
              strokeWidth="2.5"
              strokeDasharray="60 120"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle
              cx="160"
              cy="160"
              r="122"
              fill="none"
              stroke="#58A6FF"
              strokeWidth="2"
              strokeDasharray="30 150"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>

          {/* 5. Innermost Metallic Bezel Ring */}
          <circle
            cx="160"
            cy="160"
            r="112"
            fill="none"
            stroke="#2A3448"
            strokeWidth="2"
          />
        </svg>

        {/* Inner Circle Layout Structure */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 sm:p-4 z-10 pointer-events-none">
          {/* Top Label */}
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[#8B949E] uppercase mb-1 sm:mb-2">
            NEXT HALVING
          </span>

          {/* Central Countdown: fits mobile perfectly without wrapping */}
          <div className="font-mono text-base sm:text-xl md:text-2xl font-black text-[#F5A623] tracking-tight sm:tracking-wide drop-shadow-[0_0_12px_rgba(245,166,35,0.4)] my-0.5 sm:my-1 whitespace-nowrap">
            {formattedCountdown}
          </div>

          {/* Bottom Date */}
          <div className="text-[10px] sm:text-[11px] text-[#8B949E] mt-1 sm:mt-2 flex flex-col items-center leading-tight">
            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">Estimated Date</span>
            <span className="text-zinc-300 font-medium mt-0.5 text-[10px] sm:text-[11px]">{targetDateFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
