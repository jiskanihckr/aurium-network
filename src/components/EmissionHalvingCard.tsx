import React from 'react';
import { Scissors, Flame, ArrowDownRight, ShieldCheck } from 'lucide-react';
import { AuriumState } from '../types';
import { CircularHalvingGauge } from './CircularHalvingGauge';

interface EmissionHalvingCardProps {
  state: AuriumState;
}

export const EmissionHalvingCard: React.FC<EmissionHalvingCardProps> = ({ state }) => {
  const currentYield = state.network.baseDailyYield;
  const postHalvingYield = (currentYield / 2).toFixed(2);

  return (
    <div
      id="halving"
      className="aurium-card rounded-3xl p-5 sm:p-8 border border-[#21262D] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-52 h-52 bg-[#F5A623]/10 blur-[90px] pointer-events-none rounded-full" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8B949E] font-semibold">
              EMISSION SCHEDULE
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#F0F6FC] font-sans">
              Algorithmic Halving
            </h3>
          </div>

          <div className="px-3 py-1 rounded-full recessed-well border border-[#21262D] text-xs font-mono text-[#F5A623] flex items-center gap-1.5 shrink-0">
            <Flame className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>ERA {state.halving.currentEra}</span>
          </div>
        </div>

        {/* Concentric Circular Orbital Gauge with Responsive Scaling */}
        <div className="my-2 sm:my-4 flex items-center justify-center">
          <CircularHalvingGauge
            targetDateIso={state.halving.nextHalvingDate}
            currentEra={state.halving.currentEra}
            baseYield={state.network.baseDailyYield}
          />
        </div>

        {/* 50% Cut Projection Well */}
        <div className="recessed-well rounded-2xl p-4 my-5 border border-[#21262D]">
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Scissors className="w-3.5 h-3.5 text-[#F5A623]" />
              50% CUT PROJECTION
            </span>
            <span className="font-mono text-[#58A6FF] text-[10px] sm:text-[11px]">ERA {state.halving.currentEra + 1}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase text-[#8B949E]">Current Base</div>
              <div className="text-base sm:text-lg font-mono font-bold text-[#F0F6FC]">
                +{currentYield.toFixed(2)} <span className="text-[10px] text-[#8B949E]">AURI/d</span>
              </div>
            </div>

            <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5A623] shrink-0 animate-pulse" />

            <div className="text-right">
              <div className="text-[10px] uppercase text-[#F5A623] font-semibold">Post-Halving</div>
              <div className="text-base sm:text-lg font-mono font-bold text-[#F5A623] gold-glow-text">
                +{postHalvingYield} <span className="text-[10px] text-[#8B949E]">AURI/d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-[#8B949E] pt-3 border-t border-[#21262D]">
        <div className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#238636]" />
          <span>Verifiably Programmatic</span>
        </div>
        <span className="font-mono text-[#F0F6FC] text-[11px]">Cap: 100M AURI</span>
      </div>
    </div>
  );
};
