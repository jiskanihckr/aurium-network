import React from 'react';
import { Smartphone, Wifi, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface HeaderProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  activeView: 'public' | 'admin';
  setActiveView: (view: 'public' | 'admin') => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenApkModal,
  activeView,
  setActiveView,
  isConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090C10]/95 border-b border-[#1F2736]">
      {/* Alert banner if network killswitch is toggled off */}
      {!state.network.isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-center text-[11px] sm:text-xs font-medium text-amber-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Protocol Notice:</strong> Node Network paused via Master Kill-Switch. Consensus synchronization held.
          </span>
        </div>
      )}

      {/* Main Header Container with refined mobile spacing */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 sm:py-0 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Shield Crest Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            if (activeView === 'admin') {
              e.preventDefault();
              setActiveView('public');
            }
          }}
          className="group transition-transform hover:scale-[1.01] shrink-0 min-w-0"
        >
          <AuriumLogo size="md" />
        </a>

        {/* Navigation links for Desktop (hidden on mobile) */}
        {activeView === 'public' ? (
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase font-bold tracking-widest text-[#8B949E]">
            <a
              href="#node-network"
              className="hover:text-[#F0F6FC] transition-colors hover:underline underline-offset-8 decoration-[#F5A623]"
            >
              Node Network
            </a>
            <a
              href="#halving"
              className="hover:text-[#F0F6FC] transition-colors hover:underline underline-offset-8 decoration-[#F5A623]"
            >
              Halving
            </a>
            <a
              href="#presale"
              className="hover:text-[#F0F6FC] transition-colors hover:underline underline-offset-8 decoration-[#F5A623]"
            >
              Presale
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#F0F6FC] transition-colors hover:underline underline-offset-8 decoration-[#F5A623]"
            >
              How It Works
            </a>
            <a
              href="#roadmap"
              className="hover:text-[#F0F6FC] transition-colors hover:underline underline-offset-8 decoration-[#F5A623]"
            >
              Roadmap
            </a>
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#F5A623] bg-[#070A0E] px-3.5 py-1.5 rounded-full border border-[#F5A623]/30">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
            <span>PROTECTED GOVERNANCE ACTIVE</span>
          </div>
        )}

        {/* Action Controls: Live Sync Badge & Compact Pill Badge Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Sync Indicator (Desktop) */}
          <div
            title={isConnected ? 'Real-Time Network Stream Active' : 'Connecting to stream...'}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono recessed-well text-[#8B949E]"
          >
            <Wifi className={`w-3 h-3 ${isConnected ? 'text-[#238636]' : 'text-amber-400 animate-pulse'}`} />
            <span className={isConnected ? 'text-[#238636]' : 'text-amber-400'}>
              {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
            </span>
          </div>

          {/* Sleek, Compact Pill Badge Button on Mobile & Desktop */}
          {activeView === 'public' ? (
            <button
              onClick={onOpenApkModal}
              className="btn-gold-capsule text-xs px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#070A0E]" />
              <span className="font-bold tracking-wider text-[11px] sm:text-xs">
                DOWNLOAD APK
              </span>
              <span className="hidden sm:inline font-mono text-[10px] opacity-80 pl-0.5">
                {state.apk.version}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('public')}
              className="btn-dark-capsule px-3 py-1.5 sm:px-4 sm:py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="font-bold text-[11px] sm:text-xs">EXIT ADMIN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
