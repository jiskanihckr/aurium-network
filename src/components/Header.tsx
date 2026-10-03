import React, { useState } from 'react';
import { Smartphone, Wifi, AlertTriangle, ArrowLeft, Wallet, Coins, LogOut, Menu, X, Download } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface HeaderProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  onOpenAuthModal: () => void;
  auth: ReturnType<typeof useSupabaseAuth>;
  activeView: 'public' | 'admin' | '404';
  setActiveView: (view: 'public' | 'admin' | '404') => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenApkModal,
  onOpenAuthModal,
  auth,
  activeView,
  setActiveView,
  isConnected,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'public') {
      setActiveView('public');
    }
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden backdrop-blur-xl bg-[#090C10]/95 border-b border-[#1F2736]">
      {/* Alert banner if network killswitch is toggled off */}
      {!state.network.isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-3 py-1.5 text-center text-[10px] sm:text-xs font-medium text-amber-200 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong>Protocol Notice:</strong> Node Network paused via Master Kill-Switch.
          </span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Left: Compact Brand Shield Crest on Mobile, Full on Desktop */}
        <a
          href="#hero"
          onClick={(e) => {
            if (activeView !== 'public') {
              e.preventDefault();
              setActiveView('public');
            }
          }}
          className="group transition-transform hover:scale-[1.01] shrink-0 min-w-0"
        >
          <AuriumLogo size="md" compactOnMobile={true} />
        </a>

        {/* Navigation links for Desktop (hidden on mobile) */}
        {activeView === 'public' ? (
          <nav className="hidden xl:flex items-center gap-7 text-xs uppercase font-bold tracking-widest text-[#8B949E]">
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
        ) : activeView === 'admin' ? (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#F5A623] bg-[#070A0E] px-3.5 py-1.5 rounded-full border border-[#F5A623]/30">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
            <span>PROTECTED GOVERNANCE ACTIVE</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#070A0E] px-3.5 py-1.5 rounded-full border border-[#21262D]">
            <span>RESOURCE UNREACHABLE</span>
          </div>
        )}

        {/* Right: Action Controls (Responsive & Compact) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live Sync Indicator (Large screens) */}
          <div
            title={isConnected ? 'Real-Time Network Stream Active' : 'Connecting to stream...'}
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono recessed-well text-[#8B949E]"
          >
            <Wifi className={`w-3 h-3 ${isConnected ? 'text-[#238636]' : 'text-amber-400 animate-pulse'}`} />
            <span className={isConnected ? 'text-[#238636]' : 'text-amber-400'}>
              {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
            </span>
          </div>

          {activeView === 'public' ? (
            <>
              {/* 1. Authentication Button */}
              {!auth.isAuthenticated ? (
                <button
                  onClick={onOpenAuthModal}
                  title="Sign In with Google, Credentials, or Web3 Wallet"
                  className="btn-dark-capsule px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs border border-[#F5A623]/60 text-[#F5A623] hover:border-[#F5A623] hover:text-[#FFE082] flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer transition-all whitespace-nowrap"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                  <span className="hidden sm:inline font-bold">Sign In / Connect</span>
                  <span className="sm:hidden font-bold">Sign In</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Balance Pill (hidden on very small mobile) */}
                  <div
                    title="Non-custodial Node Balance"
                    className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full recessed-well border border-[#21262D] text-xs font-mono font-bold text-[#F5A623] shrink-0"
                  >
                    <Coins className="w-3 h-3 text-[#F5A623]" />
                    <span>{auth.user?.auriBalance.toLocaleString()} AURI</span>
                  </div>

                  {/* Wallet address badge */}
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full recessed-well border border-[#21262D] shrink-0"
                    title={auth.user?.walletAddress}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F5A623] to-[#FFE082] text-[#070A0E] font-black text-[10px] flex items-center justify-center font-mono shadow-sm shrink-0">
                      {auth.user?.walletAddress.substring(2, 4).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-xs font-mono text-[#F0F6FC]">
                      {auth.user?.walletAddress}
                    </span>
                  </div>

                  {/* Sign Out Trigger */}
                  <button
                    onClick={auth.signOut}
                    className="text-[#8B949E] hover:text-red-400 p-1 rounded-full hover:bg-[#1C2433] transition-colors cursor-pointer shrink-0"
                    title="Sign Out of Protocol"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 2. Direct Download APK Button (Compact Gold Pill on mobile) */}
              <button
                onClick={onOpenApkModal}
                className="btn-gold-capsule px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs rounded-full flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap font-bold"
              >
                <Download className="w-3.5 h-3.5 text-[#070A0E] shrink-0" />
                <span className="hidden sm:inline font-bold tracking-wider">DOWNLOAD APK</span>
                <span className="sm:hidden font-bold">APK</span>
                <span className="font-mono text-[10px] opacity-80 pl-0.5">
                  {state.apk.version}
                </span>
              </button>

              {/* 3. Mobile Hamburger Menu Button (≡) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-8 h-8 rounded-full recessed-well border border-[#21262D] hover:border-[#F5A623]/50 flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer shrink-0"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-[#F5A623]" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveView('public')}
              className="btn-dark-capsule px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="font-bold text-[11px] sm:text-xs">EXIT</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#1F2736] bg-[#070A0E]/98 px-4 py-4 space-y-3 animate-fade-in backdrop-blur-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            PROTOCOL SECTIONS
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => handleNavClick('#node-network')}
              className="p-2.5 rounded-xl recessed-well border border-[#21262D] text-left text-[#F0F6FC] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors"
            >
              Node Network
            </button>
            <button
              onClick={() => handleNavClick('#halving')}
              className="p-2.5 rounded-xl recessed-well border border-[#21262D] text-left text-[#F0F6FC] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors"
            >
              Halving
            </button>
            <button
              onClick={() => handleNavClick('#presale')}
              className="p-2.5 rounded-xl recessed-well border border-[#21262D] text-left text-[#F0F6FC] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors"
            >
              Presale
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className="p-2.5 rounded-xl recessed-well border border-[#21262D] text-left text-[#F0F6FC] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('#roadmap')}
              className="col-span-2 p-2.5 rounded-xl recessed-well border border-[#21262D] text-left text-[#F0F6FC] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors flex items-center justify-between"
            >
              <span>Roadmap</span>
              <span className="text-[10px] font-mono text-[#F5A623]">2026/2027</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
