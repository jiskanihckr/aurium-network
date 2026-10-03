import React from 'react';
import { Coins, Sparkles, ArrowRight } from 'lucide-react';
import { AuriumState } from '../types';

interface PresaleCardProps {
  state: AuriumState;
  onOpenPresaleModal: () => void;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ state, onOpenPresaleModal }) => {
  const percent = state.presale.progressPercent;
  const isPresaleActive = state.presale.enabled;
  const allocation = state.presale.totalAllocation;
  const auriSold = Math.floor(allocation * (percent / 100));

  return (
    <div
      id="presale"
      className="aurium-card rounded-3xl p-5 sm:p-8 border border-[#21262D] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-60 h-60 bg-[#F5A623]/10 blur-[100px] pointer-events-none rounded-full" />

      <div>
        {/* Header Line */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl recessed-well border border-[#21262D] flex items-center justify-center text-[#F5A623] shrink-0">
              <Coins className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#8B949E] font-semibold">
                TOKEN ALLOCATION
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#F0F6FC] font-sans">
                Strategic Presale
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                isPresaleActive
                  ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40'
                  : 'bg-red-500/15 text-red-400 border border-red-500/40'
              }`}
            >
              {isPresaleActive ? `${state.presale.round} ACTIVE` : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Allocation Numbers in Recessed Wells */}
        <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mb-5">
          <div className="recessed-well rounded-2xl p-3.5 sm:p-4 border border-[#21262D]">
            <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider mb-1 font-semibold">
              ROUND ALLOCATION
            </div>
            <div className="text-lg sm:text-2xl font-mono font-black text-[#F0F6FC]">
              {allocation.toLocaleString()} <span className="text-[10px] sm:text-xs text-[#8B949E] font-sans">AURI</span>
            </div>
            <div className="text-[10px] text-[#58A6FF] font-mono mt-1 uppercase">
              1 AURI = ${state.presale.rateUsdtPerAuri}
            </div>
          </div>

          <div className="recessed-well rounded-2xl p-3.5 sm:p-4 border border-[#21262D]">
            <div className="text-[10px] sm:text-[11px] text-[#8B949E] uppercase tracking-wider mb-1 font-semibold">
              MIN. DEPOSIT
            </div>
            <div className="text-lg sm:text-2xl font-mono font-black text-[#F5A623] gold-glow-text">
              ${state.presale.minDepositUsdt} <span className="text-[10px] sm:text-xs text-[#8B949E] font-sans">USDT</span>
            </div>
            <div className="text-[10px] text-[#8B949E] mt-1 uppercase">
              Instant Quota
            </div>
          </div>
        </div>

        {/* Presale Progress Bar (75%) */}
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
          {isPresaleActive && state.deposits.enabled ? 'JOIN PRESALE / DEPOSIT NOW' : 'PRESALE CURRENTLY PAUSED'}
        </span>
        <ArrowRight className="w-4 h-4 text-[#070A0E]" />
      </button>
    </div>
  );
};
