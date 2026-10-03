import React from 'react';
import { Smartphone, Wifi, AlertTriangle, ArrowLeft, Wallet, Coins, LogOut } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface HeaderProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  onOpenAuthModal: () => void;
  onLaunchApp: () => void;
  onOpenAdmin?: () => void;
  auth: ReturnType<typeof useSupabaseAuth>;
  activeView: 'public' | 'admin' | 'app';
  setActiveView: (view: 'public' | 'admin' | 'app') => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenApkModal,
  onOpenAuthModal,
  onLaunchApp,
  auth,
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

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 sm:py-0 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Shield Crest Logo */}
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
          <AuriumLogo size="md" />
        </a>

        {/* Navigation links for Desktop (hidden on mobile and app view) */}
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
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#58A6FF] bg-[#070A0E] px-3.5 py-1.5 rounded-full border border-[#58A6FF]/30">
            <span className="w-2 h-2 rounded-full bg-[#58A6FF] animate-pulse" />
            <span>MOBILE VALIDATOR APP VIEW</span>
          </div>
        )}

        {/* Action Controls: Launch App, Sign In / Connect, Balance, Download APK */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Sync Indicator (Desktop) */}
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
              {/* 1. "Launch App" Dark Glass Button */}
              <button
                onClick={onLaunchApp}
                title="Launch the interactive Aurium Mobile Validator App"
                className="btn-dark-capsule px-3 py-1.5 sm:px-4 sm:py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer hover:border-[#58A6FF] transition-all whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span className="hidden sm:inline font-bold">Launch App</span>
                <span className="sm:hidden font-bold">App</span>
              </button>

              {/* 2. Authentication: "Sign In / Connect" OR User Profile Pill */}
              {!auth.isAuthenticated ? (
                <button
                  onClick={onOpenAuthModal}
                  title="Sign In with Supabase or Connect Non-Custodial Wallet"
                  className="btn-dark-capsule px-3 py-1.5 sm:px-4 sm:py-2 text-xs border border-[#F5A623]/60 text-[#F5A623] hover:border-[#F5A623] hover:text-[#FFE082] flex items-center gap-1.5 shrink-0 cursor-pointer shadow-[0_0_12px_rgba(245,166,35,0.15)] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] transition-all whitespace-nowrap"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span className="font-bold">Sign In / Connect</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Balance Pill */}
                  <div
                    title="Non-custodial Aurium Node Balance"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full recessed-well border border-[#21262D] text-xs font-mono font-bold text-[#F5A623] shrink-0"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>{auth.user?.auriBalance.toLocaleString()} AURI</span>
                  </div>

                  {/* Wallet address initial */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full recessed-well border border-[#21262D] shrink-0"
                    title={auth.user?.walletAddress}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-[#F5A623] to-[#FFE082] text-[#070A0E] font-black text-[10px] sm:text-[11px] flex items-center justify-center font-mono shadow-sm shrink-0">
                      {auth.user?.walletAddress.substring(2, 4).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-xs font-mono text-[#F0F6FC]">
                      {auth.user?.walletAddress}
                    </span>
                  </div>

                  {/* Sign Out Trigger */}
                  <button
                    onClick={auth.signOut}
                    className="text-[#8B949E] hover:text-red-400 p-1.5 rounded-full hover:bg-[#1C2433] transition-colors cursor-pointer shrink-0"
                    title="Sign Out of Protocol"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 3. Compact Pill Badge Button: DOWNLOAD APK */}
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
            </>
          ) : activeView === 'admin' ? (
            <button
              onClick={() => setActiveView('public')}
              className="btn-dark-capsule px-3 py-1.5 sm:px-4 sm:py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="font-bold text-[11px] sm:text-xs">EXIT ADMIN</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('public')}
              className="btn-dark-capsule px-3 py-1.5 sm:px-4 sm:py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="font-bold text-[11px] sm:text-xs">LANDING PAGE</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
