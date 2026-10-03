import React from 'react';
import { Download, Sparkles, Cpu, BatteryCharging, ShieldCheck } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface HeroSectionProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  onOpenPresaleModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  state,
  onOpenApkModal,
  onOpenPresaleModal,
}) => {
  return (
    <section id="hero" className="relative pt-6 pb-10 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Deep ambient gold backglows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] md:w-[900px] h-[300px] sm:h-[400px] pointer-events-none rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.09) 0%, transparent 70%)',
          animationDuration: '6s',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[250px] bg-[#F5A623]/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-2 sm:right-10 w-[200px] sm:w-[350px] h-[200px] bg-[#58A6FF]/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Emblem Crest Presentation */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <AuriumLogo size="lg" showText={false} glow={true} />
          </div>

          {/* Protocol Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full recessed-well border border-[#21262D] text-[10px] sm:text-xs text-[#8B949E] mb-4 sm:mb-6 max-w-full truncate">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-ping shrink-0" />
            <span className="text-[#F0F6FC] font-semibold tracking-wider uppercase text-[9px] sm:text-[11px] truncate">
              PROOF OF MOBILE UPTIME (POMU)
            </span>
            <span className="text-[#30363D]">|</span>
            <span className="text-[#F5A623] font-mono shrink-0">0% CPU DRAIN</span>
          </div>

          {/* Main Headline with Luxury Gradient (Mobile Optimized wrap) */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F0F6FC] font-sans leading-[1.18] mb-3 sm:mb-5 px-1">
            Decentralized <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#FFE082] to-[#F5A623] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(245,166,35,0.3)]">
              Mobile Node Network
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-[#8B949E] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-2">
            Transform your Android device into a sovereign light validator node. Validate zero-knowledge state blocks with 0% hardware strain, &lt; 0.4% battery consumption, and earn compounding $AURI protocol rewards.
          </p>

          {/* Action Buttons: Responsive Full-Width on Mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-xl mx-auto w-full">
            {/* Primary Download APK Pill */}
            <button
              onClick={onOpenApkModal}
              className="btn-gold-capsule w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg font-bold"
            >
              <Download className="w-4 h-4 text-[#070A0E] shrink-0" />
              <span>DOWNLOAD DIRECT APK ({state.apk.version})</span>
            </button>

            {/* Join Presale Pill */}
            <button
              onClick={onOpenPresaleModal}
              className="btn-dark-capsule w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
              <span>JOIN PRESALE ({state.presale.round})</span>
            </button>
          </div>

          {/* 4 Stat pills: 2x2 responsive grid on mobile, avoiding horizontal truncation */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 max-w-4xl mx-auto w-full">
            <div className="recessed-well rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 text-left border border-[#21262D]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#238636]/10 border border-[#238636]/30 flex items-center justify-center shrink-0">
                <BatteryCharging className="w-4 h-4 sm:w-5 sm:h-5 text-[#238636]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC] truncate">&lt; 0.4% / Day</div>
                <div className="text-[9px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider truncate">Battery Load</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 text-left border border-[#21262D]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#58A6FF]/10 border border-[#58A6FF]/30 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#58A6FF]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC] truncate">0% CPU Drain</div>
                <div className="text-[9px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider truncate">Idle Slicing</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 text-left border border-[#21262D]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5A623]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC] truncate">SHA-256 Signed</div>
                <div className="text-[9px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider truncate">Direct APK</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 text-left border border-[#21262D]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5A623]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC] truncate">Deflationary</div>
                <div className="text-[9px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider truncate">Halving Gauge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
