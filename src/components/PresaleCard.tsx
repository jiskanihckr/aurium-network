import React from 'react';
import { Coins, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuriumState } from '../types';

interface PresaleCardProps {
  state: AuriumState;
  onOpenPresaleModal: () => void;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ state, onOpenPresaleModal }) => {
  const percent = state.presale.progressPercent;
  const isPresaleActive = state.presale.enabled && state.presale.status === 'active';
  const allocation = state.presale.totalAllocation;
  const auriSold = Math.floor(allocation * (percent / 100));
  const activeRoundData = state.presale.rounds ? state.presale.rounds[state.presale.activeRoundId] : null;

  return (
    <div
      id="presale"
      className="aurium-card rounded-3xl p-4 sm:p-5 lg:p-8 border border-[#21262D] relative w-full max-w-full overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-60 h-60 bg-[#F5A623]/10 blur-[100px] pointer-events-none rounded-full" />

      <div>
        {/* Header Row: Strict flex container with padding and zero overflow */}
        <div className="flex items-center justify-between gap-2 px-1 mb-4 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl recessed-well border border-[#21262D] flex items-center justify-center text-[#F5A623] shrink-0">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">TOKEN ALLOCATION</p>
              <h3 className="text-lg font-bold text-[#F5A623] tracking-tight">
                {activeRoundData ? activeRoundData.shortName : 'Strategic Presale'}
              </h3>
            </div>
          </div>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider border whitespace-nowrap ${
              state.presale.status === 'active' && state.presale.enabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : state.presale.status === 'coming_soon'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {state.presale.status === 'coming_soon'
              ? `${state.presale.round.toUpperCase()} COMING SOON`
              : state.presale.status === 'active' && state.presale.enabled
              ? `${state.presale.round.toUpperCase()} ACTIVE`
              : 'PAUSED'}
          </span>
        </div>

        {/* Active Notification Banner */}
        {state.presale.notificationBanner && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/30 text-[11px] text-[#FFE082] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] shrink-0 animate-ping" />
            <span className="leading-tight font-medium">{state.presale.notificationBanner}</span>
          </div>
        )}

        {/* Allocation Numbers in Clean Sub-Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {/* Round Allocation Well */}
          <div className="bg-[#12161A]/80 border border-white/5 rounded-xl p-3 flex flex-col justify-between min-h-[90px] h-auto">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              ROUND ALLOCATION
            </div>
            <div className="text-lg font-bold text-white my-0.5 flex items-baseline gap-1 font-mono">
              <span>{allocation.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 font-normal">AURI</span>
            </div>
            <div className="text-[10px] text-[#58A6FF] font-mono leading-tight mt-1">
              1 AURI = ${state.presale.rateUsdtPerAuri}
            </div>
          </div>

          {/* Min Deposit Well */}
          <div className="bg-[#12161A]/80 border border-white/5 rounded-xl p-3 flex flex-col justify-between min-h-[90px] h-auto">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              MIN. DEPOSIT
            </div>
            <div className="text-lg font-bold text-[#F5A623] my-0.5 flex items-baseline gap-1 font-mono gold-glow-text">
              <span>${state.presale.minDepositUsdt}</span>
              <span className="text-[10px] text-gray-400 font-normal">USDT</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium leading-tight mt-1">
              Instant Allocation Quota
            </div>
          </div>
        </div>

        {/* Presale Progress Bar */}
        <div className="recessed-well rounded-2xl p-3.5 sm:p-4 mb-5 border border-[#21262D]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#8B949E] flex items-center gap-1.5 font-semibold uppercase text-[10px] tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
              ROUND COMPLETION
            </span>
            <span className="font-mono font-black text-[#F5A623] text-xs sm:text-sm gold-glow-text">
              {percent}% FILLED
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 sm:h-3.5 bg-[#090C10] rounded-full overflow-hidden p-0.5 border border-[#21262D] relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D97706] via-[#F5A623] to-[#FFE082] transition-all duration-700 relative overflow-hidden shadow-[0_0_15px_rgba(245,166,35,0.7)]"
              style={{ width: `${percent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#8B949E] font-mono mt-2">
            <span>{auriSold.toLocaleString()} ALLOCATED</span>
            <span className="text-[#F5A623]">{(allocation - auriSold).toLocaleString()} REMAINING</span>
          </div>
        </div>

        {/* Supported Chains */}
        <div className="p-3 sm:p-3.5 rounded-2xl recessed-well border border-[#21262D] mb-6">
          <div className="text-[10px] uppercase tracking-wider text-[#8B949E] mb-2 font-semibold">
            SUPPORTED DEPOSIT NETWORKS:
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            <div
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 ${
                state.deposits.chains.bep20
                  ? 'bg-[#131822] text-[#F0F6FC] border border-[#2C3547]'
                  : 'bg-[#090C10] text-[#8B949E]/40 border border-transparent line-through'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${state.deposits.chains.bep20 ? 'bg-[#238636]' : 'bg-red-500'}`} />
              <span>BEP-20</span>
            </div>

            <div
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 ${
                state.deposits.chains.trc20
                  ? 'bg-[#131822] text-[#F0F6FC] border border-[#2C3547]'
                  : 'bg-[#090C10] text-[#8B949E]/40 border border-transparent line-through'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${state.deposits.chains.trc20 ? 'bg-[#238636]' : 'bg-red-500'}`} />
              <span>TRC-20</span>
            </div>

            <div
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 ${
                state.deposits.chains.erc20
                  ? 'bg-[#131822] text-[#F0F6FC] border border-[#2C3547]'
                  : 'bg-[#090C10] text-[#8B949E]/40 border border-transparent line-through'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${state.deposits.chains.erc20 ? 'bg-[#238636]' : 'bg-red-500'}`} />
              <span>ERC-20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pill Capsule Action Button: JOIN PRESALE */}
      <button
        onClick={onOpenPresaleModal}
        disabled={!isPresaleActive || !state.deposits.enabled}
        className={`w-full py-3.5 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
          isPresaleActive && state.deposits.enabled
            ? 'btn-gold-capsule'
            : 'bg-[#131822] text-[#8B949E] cursor-not-allowed border border-[#21262D] rounded-full'
        }`}
      >
        <span>
          {state.presale.status === 'coming_soon'
            ? `${state.presale.round.toUpperCase()} STARTS SOON`
            : isPresaleActive && state.deposits.enabled
            ? `JOIN ${state.presale.round.toUpperCase()} / DEPOSIT NOW`
            : 'PRESALE CURRENTLY PAUSED'}
        </span>
        <ArrowRight className="w-4 h-4 text-[#070A0E]" />
      </button>
    </div>
  );
};
