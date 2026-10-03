import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Cpu,
  BatteryCharging,
  Wifi,
  Zap,
  Flame,
  Wallet,
  ShieldCheck,
  Send,
  Download,
  Copy,
  Check,
  Coins,
  Sparkles,
  Layers,
  Settings,
  Activity,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AuriumState, NetworkChain } from '../types';
import { AuriumLogo } from './AuriumLogo';
import { CircularHalvingGauge } from './CircularHalvingGauge';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface MobileAppContainerProps {
  state: AuriumState;
  onBackToLanding: () => void;
  onOpenPresaleModal: () => void;
  auth: ReturnType<typeof useSupabaseAuth>;
}

export const MobileAppContainer: React.FC<MobileAppContainerProps> = ({
  state,
  onBackToLanding,
  onOpenPresaleModal,
  auth,
}) => {
  const [activeTab, setActiveTab] = useState<'mining' | 'wallet' | 'presale' | 'stats'>('mining');
  const [liveMined, setLiveMined] = useState<number>(() => {
    return auth.user ? auth.user.auriBalance : 1420.5;
  });
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isMiningActive, setIsMiningActive] = useState(true);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Micro-accumulate rewards every 3 seconds to simulate real Proof-of-Mobile-Uptime mining!
  useEffect(() => {
    if (!isMiningActive || !state.network.isOnline) return;
    const interval = setInterval(() => {
      // 25.5 AURI / 28800 periods = micro-tick
      setLiveMined((prev) => +(prev + 0.0035).toFixed(4));
    }, 3000);
    return () => clearInterval(interval);
  }, [isMiningActive, state.network.isOnline]);

  const userAddress = auth.user?.walletAddress || '0x71C8...3F21';

  const handleCopy = () => {
    navigator.clipboard.writeText(userAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleClaim = () => {
    setClaimSuccess(true);
    setTimeout(() => setClaimSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#F0F6FC] py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F5A623]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#58A6FF]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Return to Web Landing Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <button
          onClick={onBackToLanding}
          className="btn-dark-capsule px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer hover:border-[#F5A623]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>Return to Web Landing</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8B949E] recessed-well px-3 py-1 rounded-full border border-[#21262D]">
          <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
          <span>PoMU NODE SIMULATOR</span>
        </div>
      </div>

      {/* Smartphone Device Mockup Container */}
      <div className="w-full max-w-sm sm:max-w-md bg-[#0D1219] border-2 sm:border-4 border-[#21262D] rounded-[40px] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(245,166,35,0.15)] overflow-hidden flex flex-col relative h-[840px] max-h-[94vh]">
        {/* Smartphone Dynamic Island / Speaker Bezel */}
        <div className="bg-[#090C10] pt-2 px-6 pb-2 border-b border-[#1F2736] flex items-center justify-between text-[11px] font-mono text-[#8B949E] shrink-0 select-none">
          <span className="font-bold text-[#F0F6FC]">09:41</span>
          <div className="w-24 h-4 bg-black rounded-full border border-[#21262D] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#1F2736]" />
          </div>
          <div className="flex items-center gap-1.5 text-[#F0F6FC]">
            <Wifi className="w-3 h-3 text-[#238636]" />
            <BatteryCharging className="w-3.5 h-3.5 text-[#238636]" />
            <span className="text-[10px]">99%</span>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="px-5 py-3 bg-[#111621] border-b border-[#1F2736] flex items-center justify-between shrink-0">
          <AuriumLogo size="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-[11px] font-mono recessed-well px-2.5 py-1 rounded-full border border-[#21262D] text-[#8B949E] hover:text-[#F0F6FC] flex items-center gap-1 cursor-pointer"
            >
              <span>{userAddress}</span>
              {copiedAddress ? <Check className="w-3 h-3 text-[#238636]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
          {/* TAB 1: MINING HUB */}
          {activeTab === 'mining' && (
            <div className="space-y-4 animate-fade-in">
              {/* Node Live Status Banner */}
              <div className="recessed-well p-3.5 rounded-2xl border border-[#21262D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#238636]/15 border border-[#238636]/40 flex items-center justify-center text-[#238636]">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F0F6FC]">Light Validator v1.0.2</div>
                    <div className="text-[10px] text-[#238636] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#238636]" />
                      <span>PoMU Consensus Active</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMiningActive(!isMiningActive)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isMiningActive ? 'bg-[#238636]/20 text-[#238636] border border-[#238636]/40' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {isMiningActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              {/* Concentric Halving Orbital Gauge in Mobile App */}
              <div className="aurium-card rounded-3xl p-4 border border-[#21262D] relative overflow-hidden flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase tracking-widest text-[#8B949E] font-semibold mb-1">
                  HALVING PROTOCOL COUNTDOWN
                </div>
                <CircularHalvingGauge
                  targetDateIso={state.halving.nextHalvingDate}
                  currentEra={state.halving.currentEra}
                  baseYield={state.network.baseDailyYield}
                />
              </div>

              {/* Live Yield & Balance Card */}
              <div className="aurium-card rounded-3xl p-4 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#8B949E] uppercase tracking-wider font-semibold">
                    ACCUMULATED NODE REWARDS
                  </span>
                  <span className="font-mono text-[10px] text-[#238636] flex items-center gap-1 font-bold">
                    <TrendingUp className="w-3 h-3" />
                    +{state.network.baseDailyYield} AURI/day
                  </span>
                </div>

                <div className="recessed-well rounded-2xl p-4 border border-[#1F2736] text-center">
                  <div className="text-3xl font-black font-mono text-[#F5A623] gold-glow-text">
                    {liveMined.toFixed(4)} <span className="text-sm font-sans text-[#8B949E]">AURI</span>
                  </div>
                  <div className="text-[11px] text-[#8B949E] font-mono mt-1">
                    ≈ ${(liveMined * state.presale.rateUsdtPerAuri).toFixed(2)} USDT (Presale Benchmark)
                  </div>
                </div>

                <button
                  onClick={handleClaim}
                  className="btn-gold-capsule w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-[#070A0E]" />
                  <span>{claimSuccess ? 'EPOCH HARVEST COMPLETED!' : 'CLAIM EPOCH REWARDS'}</span>
                </button>
              </div>

              {/* Hardware Metrics Well */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="recessed-well p-2.5 rounded-2xl border border-[#21262D]">
                  <div className="text-[9px] text-[#8B949E] uppercase">Battery</div>
                  <div className="text-xs font-bold text-[#238636]">&lt;0.4%/d</div>
                </div>
                <div className="recessed-well p-2.5 rounded-2xl border border-[#21262D]">
                  <div className="text-[9px] text-[#8B949E] uppercase">CPU Load</div>
                  <div className="text-xs font-bold text-[#58A6FF]">0.08%</div>
                </div>
                <div className="recessed-well p-2.5 rounded-2xl border border-[#21262D]">
                  <div className="text-[9px] text-[#8B949E] uppercase">Latency</div>
                  <div className="text-xs font-bold text-[#F5A623]">{state.network.networkLatencyMs}ms</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 animate-fade-in">
              <div className="aurium-card rounded-3xl p-5 border border-[#21262D] space-y-3">
                <div className="text-[10px] uppercase tracking-wider text-[#8B949E]">Total Non-Custodial Balance</div>
                <div className="text-3xl font-black font-mono text-[#F0F6FC]">
                  {liveMined.toLocaleString()} <span className="text-xs text-[#F5A623]">AURI</span>
                </div>
                <div className="text-xs text-[#8B949E] font-mono">
                  ${(liveMined * state.presale.rateUsdtPerAuri + 450).toFixed(2)} USDT Total Value
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={onOpenPresaleModal}
                    className="btn-gold-capsule py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#070A0E]" />
                    <span>Deposit USDT</span>
                  </button>
                  <button
                    onClick={handleClaim}
                    className="btn-dark-capsule py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Recent On-Chain Activity */}
              <div className="recessed-well rounded-2xl p-4 border border-[#21262D]">
                <div className="text-xs font-bold text-[#F0F6FC] uppercase tracking-wider mb-3">
                  Validator Ledger
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#8B949E] p-2 rounded-xl bg-[#090C10]">
                    <span>PoMU Epoch #38419</span>
                    <span className="text-[#238636] font-bold">+1.062 AURI</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8B949E] p-2 rounded-xl bg-[#090C10]">
                    <span>PoMU Epoch #38418</span>
                    <span className="text-[#238636] font-bold">+1.062 AURI</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8B949E] p-2 rounded-xl bg-[#090C10]">
                    <span>Genesis Node Allocation</span>
                    <span className="text-[#58A6FF] font-bold">+1,250 AURI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESALE TIER */}
          {activeTab === 'presale' && (
            <div className="space-y-4 animate-fade-in">
              <div className="aurium-card rounded-3xl p-5 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F0F6FC] uppercase">Strategic Presale</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#238636]/20 text-[#238636]">
                    {state.presale.round}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-[#F5A623]">
                  1 AURI = ${state.presale.rateUsdtPerAuri} USDT
                </div>
                <div className="text-xs text-[#8B949E]">
                  Round Progress: <strong className="text-[#F0F6FC]">{state.presale.progressPercent}%</strong> of 10M Allocation
                </div>

                <div className="w-full h-2.5 bg-[#070A0E] rounded-full overflow-hidden p-0.5 border border-[#21262D]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#FFE082]"
                    style={{ width: `${state.presale.progressPercent}%` }}
                  />
                </div>

                <button
                  onClick={onOpenPresaleModal}
                  className="btn-gold-capsule w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-[#070A0E]" />
                  <span>SECURE ALLOCATION NOW</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-3 animate-fade-in">
              <div className="recessed-well rounded-2xl p-4 border border-[#21262D] space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Active Nodes:</span>
                  <span className="font-mono font-bold text-[#F0F6FC]">{state.network.activeNodes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Block Height:</span>
                  <span className="font-mono font-bold text-[#F0F6FC]">#{state.network.blockHeight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Throughput:</span>
                  <span className="font-mono font-bold text-[#238636]">{state.network.tps} TPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Consensus:</span>
                  <span className="font-mono font-bold text-[#58A6FF]">Zero-Knowledge PoMU</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile App Bottom Navigation Bar */}
        <div className="bg-[#090C10] border-t border-[#1F2736] px-4 py-2 flex items-center justify-around shrink-0 select-none">
          <button
            onClick={() => setActiveTab('mining')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'mining' ? 'text-[#F5A623]' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold">Mining</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'wallet' ? 'text-[#F5A623]' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[10px] font-bold">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('presale')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'presale' ? 'text-[#F5A623]' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span className="text-[10px] font-bold">Presale</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'stats' ? 'text-[#F5A623]' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-bold">Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
};
