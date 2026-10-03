import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { AuriumState } from '../types';

interface LiveNodeStatusCardProps {
  state: AuriumState;
  onOpenApkModal: () => void;
}

export const LiveNodeStatusCard: React.FC<LiveNodeStatusCardProps> = ({ state, onOpenApkModal }) => {
  const [currentBlock, setCurrentBlock] = useState(state.network.blockHeight);
  const [nodeMultiplier, setNodeMultiplier] = useState(1);
  const isOnline = state.network.isOnline;

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOnline]);

  const simulatedMonthly = (state.network.baseDailyYield * nodeMultiplier * 30).toFixed(1);

  return (
    <div
      id="node-network"
      className="aurium-card rounded-3xl p-5 sm:p-8 border border-[#21262D] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5A623]/10 blur-[85px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#58A6FF]/10 blur-[75px] pointer-events-none rounded-full" />

      <div>
        {/* Header Line: Strict flex container with padding and zero overflow */}
        <div className="flex items-center justify-between gap-2 px-1 mb-4 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl recessed-well border border-[#21262D] flex items-center justify-center text-[#F5A623] shrink-0">
              <Server className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">NODE STATUS</p>
              <h3 className="text-lg font-bold text-[#F0F6FC] tracking-tight">Light Validator</h3>
            </div>
          </div>

          {/* Pulse Status Badge */}
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider flex items-center gap-1.5 border whitespace-nowrap bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-400">PAUSED</span>
              </>
            )}
          </span>
        </div>

        {/* Primary Numbers in Clean Sub-Cards with Proper Auto-Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {/* Daily Base Yield Well */}
          <div className="bg-[#12161A]/80 border border-white/5 rounded-xl p-3 flex flex-col justify-between min-h-[90px] h-auto">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium flex items-center gap-1">
              <span>DAILY BASE YIELD</span>
              <Zap className="w-3 h-3 text-[#F5A623]" />
            </div>
            <div className="text-lg font-bold text-[#F5A623] my-0.5 flex items-baseline gap-1 font-mono gold-glow-text">
              <span>+{state.network.baseDailyYield.toFixed(2)}</span>
              <span className="text-[10px] text-gray-400 font-normal">AURI/day</span>
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium leading-tight mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span>Autocompounding per epoch</span>
            </div>
          </div>

          {/* Active Nodes Stat Well */}
          <div className="bg-[#12161A]/80 border border-white/5 rounded-xl p-3 flex flex-col justify-between min-h-[90px] h-auto">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium flex items-center justify-between">
              <span>ACTIVE NODES</span>
              <Activity className="w-3 h-3 text-[#58A6FF]" />
            </div>
            <div className="text-lg font-bold text-white my-0.5 flex items-baseline gap-1 font-mono">
              <span>{state.network.activeNodes.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 font-normal">Nodes</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium leading-tight mt-1">
              142 Countries Verified
            </div>
          </div>
        </div>

        {/* Live Network Telemetry in Recessed Container */}
        <div className="recessed-well rounded-2xl p-3.5 sm:p-4 space-y-2 mb-5 border border-[#21262D]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B949E] font-mono uppercase tracking-wider text-[10px] sm:text-[11px]">BLOCK HEIGHT</span>
            <span className="text-[#F0F6FC] font-mono font-bold">#{currentBlock.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B949E] font-mono uppercase tracking-wider text-[10px] sm:text-[11px]">NETWORK LATENCY</span>
            <span className="text-[#58A6FF] font-mono font-bold">{state.network.networkLatencyMs} ms</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B949E] font-mono uppercase tracking-wider text-[10px] sm:text-[11px]">THROUGHPUT</span>
            <span className="text-[#238636] font-mono font-bold">{state.network.tps.toLocaleString()} TPS</span>
          </div>
        </div>

        {/* Interactive Yield Estimator */}
        <div className="recessed-well rounded-2xl p-3.5 sm:p-4 border border-[#21262D] mb-5">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-semibold text-[#F0F6FC] uppercase tracking-wider text-[10px] sm:text-[11px]">
              YIELD SIMULATOR
            </span>
            <span className="font-mono text-[#F5A623] font-bold">
              {nodeMultiplier} {nodeMultiplier === 1 ? 'Mobile Node' : 'Nodes'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={nodeMultiplier}
            onChange={(e) => setNodeMultiplier(Number(e.target.value))}
            className="w-full h-1.5 bg-[#1F2736] rounded-lg appearance-none cursor-pointer accent-[#F5A623]"
          />
          <div className="flex items-center justify-between mt-2.5 text-xs">
            <span className="text-[#8B949E]">Projected Monthly:</span>
            <span className="font-mono font-black text-[#F5A623] gold-glow-text text-sm sm:text-base">
              ~{simulatedMonthly} AURI
            </span>
          </div>
        </div>
      </div>

      {/* Pill Capsule Action Button */}
      <button
        onClick={onOpenApkModal}
        className="btn-dark-capsule w-full py-3 sm:py-3.5 px-5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>ACTIVATE VALIDATOR NODE</span>
        <ArrowRight className="w-4 h-4 text-[#F5A623]" />
      </button>
    </div>
  );
};
