import React from 'react';
import { Download, Sparkles, BatteryCharging, Cpu, ShieldCheck, QrCode } from 'lucide-react';
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
    <section id="hero" className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 overflow-hidden">
      {/* Deep ambient gold backglows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[300px] sm:h-[380px] bg-[#F5A623]/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-4 sm:right-10 w-[350px] sm:w-[450px] h-[250px] sm:h-[320px] bg-[#58A6FF]/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Emblem Crest Presentation */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <AuriumLogo size="lg" showText={false} glow={true} />
          </div>

          {/* Protocol Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full recessed-well border border-[#21262D] text-[10px] sm:text-xs text-[#8B949E] mb-5 sm:mb-6">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#F5A623] animate-ping" />
            <span className="text-[#F0F6FC] font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
              PROOF OF MOBILE UPTIME (POMU)
            </span>
            <span className="text-[#30363D]">|</span>
            <span className="text-[#F5A623] font-mono">0% CPU DRAIN</span>
          </div>

          {/* Main Headline with Luxury Gradient */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#F0F6FC] font-sans leading-[1.12] mb-4 sm:mb-6">
            Decentralized <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#FFE082] to-[#F5A623] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(245,166,35,0.3)]">
              Mobile Node Network
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-[#8B949E] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal px-2">
            Transform your Android device into a sovereign light validator node. Validate zero-knowledge state blocks with 0% hardware drain, &lt; 0.4% battery consumption, and earn compounding $AURI protocol rewards.
          </p>

          {/* Action Buttons: Responsive Glossy Pill Capsules */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14">
            {/* Primary Download APK Pill */}
            <button
              onClick={onOpenApkModal}
              className="btn-gold-capsule w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-4 h-4 text-[#070A0E]" />
              <span>DOWNLOAD DIRECT APK ({state.apk.version})</span>
            </button>

            {/* Join Presale Pill */}
            <button
              onClick={onOpenPresaleModal}
              className="btn-dark-capsule w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-[#F5A623] group-hover:rotate-12 transition-transform" />
              <span>JOIN PRESALE ({state.presale.round})</span>
            </button>

            {/* Scan QR Pill */}
            <button
              onClick={onOpenApkModal}
              className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#8B949E] hover:text-[#F0F6FC] transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-[#21262D]"
            >
              <QrCode className="w-4 h-4 text-[#58A6FF]" />
              <span>SCAN QR CODES</span>
            </button>
          </div>

          {/* Hardware & Consensus Specification Wells */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl mx-auto">
            <div className="recessed-well rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-left border border-[#21262D]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#238636]/10 border border-[#238636]/30 flex items-center justify-center shrink-0">
                <BatteryCharging className="w-4 h-4 sm:w-5 sm:h-5 text-[#238636]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC]">&lt; 0.4% / Day</div>
                <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider">Battery Load</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-left border border-[#21262D]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#58A6FF]/10 border border-[#58A6FF]/30 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#58A6FF]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC]">0% CPU Drain</div>
                <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider">Idle Slicing</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-left border border-[#21262D]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5A623]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#F0F6FC]">SHA-256 Signed</div>
                <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider">Direct APK</div>
              </div>
            </div>

            <div className="recessed-well rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-left border border-[#21262D]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5A623]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#F5A623] gold-glow-text font-mono">
                  +{state.network.baseDailyYield} AURI
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider">Daily Base</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
