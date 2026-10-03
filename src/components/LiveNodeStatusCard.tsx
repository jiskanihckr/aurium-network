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
        {/* Header Line */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl recessed-well border border-[#21262D] flex items-center justify-center text-[#F5A623] shrink-0">
              <Server className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#8B949E] font-semibold">
                NODE STATUS
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#F0F6FC] font-sans">
                Light Validator
              </h3>
            </div>
          </div>

          {/* Pulse Status Badge in Pill Capsule */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full recessed-well border border-[#21262D] shrink-0">
            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#238636] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#238636]"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#238636] tracking-wider uppercase">ONLINE</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-amber-400 tracking-wider uppercase">PAUSED</span>
              </>
            )}
          </div>
        </div>

        {/* Primary Numbers in Recessed Wells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-5">
          {/* Yield Stat Well */}
          <div className="recessed-well rounded-2xl p-4 border border-[#21262D]">
            <div className="text-[11px] text-[#8B949E] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
              <span>DAILY BASE YIELD</span>
              <Zap className="w-3 h-3 text-[#F5A623]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#F5A623] font-mono tracking-tight gold-glow-text flex items-baseline gap-1">
              +{state.network.baseDailyYield.toFixed(2)}
              <span className="text-xs font-semibold text-[#8B949E] font-sans">AURI/day</span>
            </div>
            <div className="text-[10px] text-[#238636] font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Autocompounding per epoch</span>
            </div>
          </div>

          {/* Active Nodes Stat Well */}
          <div className="recessed-well rounded-2xl p-4 border border-[#21262D]">
            <div className="text-[11px] text-[#8B949E] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
              <span>ACTIVE NODES</span>
              <Activity className="w-3 h-3 text-[#58A6FF]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#F0F6FC] font-mono tracking-tight flex items-baseline gap-1">
              {state.network.activeNodes.toLocaleString()}
              <span className="text-xs font-semibold text-[#8B949E] font-sans">Nodes</span>
            </div>
            <div className="text-[10px] text-[#8B949E] mt-1 uppercase tracking-wider">
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
