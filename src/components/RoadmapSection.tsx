import React from 'react';
import {
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  Flame,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface RoadmapPhase {
  id: string;
  phaseCode: string;
  title: string;
  timeline: string;
  status: 'COMPLETED' | 'ACTIVE NOW' | 'LOCKED' | 'CLASSIFIED';
  statusType: 'completed' | 'active' | 'locked';
  summary: string;
  milestones: string[];
  specs: { label: string; value: string }[];
  highlight?: boolean;
}

export const RoadmapSection: React.FC = () => {
  const phases: RoadmapPhase[] = [
    {
      id: 'phase-01',
      phaseCode: 'PHASE 01',
      title: 'GENESIS & LIGHTWEIGHT PROTOCOL',
      timeline: 'Q1 - Q2 2026',
      status: 'COMPLETED',
      statusType: 'completed',
      summary:
        'Foundational architecture of the zero-knowledge Proof-of-Mobile-Uptime consensus engine and battery-neutral mobile validator daemon.',
      milestones: [
        'Zero-knowledge Proof-of-Mobile-Uptime (PoMU) specification & cryptographic formal verification.',
        'Battery-neutral background consensus engine achieving sustained <0.4% daily power drain.',
        'Internal testnet launch with 10,000 initial Android validators verifying 2.5M blocks.',
      ],
      specs: [
        { label: 'Network State', value: '100% Operational' },
        { label: 'Security Audit', value: 'CertiK Verified' },
      ],
    },
    {
      id: 'phase-02',
      phaseCode: 'PHASE 02',
      title: 'STRATEGIC PRESALE & DIRECT APK ROLLOUT',
      timeline: 'Q3 2026',
      status: 'ACTIVE NOW',
      statusType: 'active',
      highlight: true,
      summary:
        'Global mobile validator distribution through direct cryptographic APK sideloading and strategic capital formation.',
      milestones: [
        'Direct SHA-256 verified APK release for global unconstrained mobile decentralization.',
        'Tier-1 USDT multi-chain deposit gateway (BEP-20, TRC-20, ERC-20) with algorithmic pricing.',
        'Global Node Registry launch (targeting 100,000 active nodes across 140+ countries).',
      ],
      specs: [
        { label: 'Current Era', value: 'Era 1 Epoch' },
        { label: 'Active Validators', value: '45,210+ Global Nodes' },
      ],
    },
    {
      id: 'phase-03',
      phaseCode: 'PHASE 03',
      title: 'THE FIRST HALVING ERA & DEFI GOVERNANCE',
      timeline: 'Q4 2026',
      status: 'LOCKED',
      statusType: 'locked',
      summary:
        'Scheduled algorithmic supply compression event cutting block rewards by 50% and transitioning to decentralized node quorum governance.',
      milestones: [
        '50% Emission cut event from 25.50 AURI to 12.75 AURI/day executed on-chain.',
        'Aurium Sovereign DEX & Liquidity Staking Pool debut with yield multipliers.',
        'Decentralized validator governance quorum activation for protocol parameter voting.',
      ],
      specs: [
        { label: 'Halving Cut', value: '50.00% Deflation' },
        { label: 'Quorum Gate', value: '50,000 Nodes Required' },
      ],
    },
    {
      id: 'phase-04',
      phaseCode: 'PHASE 04',
      title: 'MAINNET LAYER-1 BRIDGE & TIER-1 CEX LISTINGS',
      timeline: 'Q1 - Q2 2027',
      status: 'CLASSIFIED',
      statusType: 'locked',
      summary:
        'Sovereign Layer-1 Mainnet token migration bridge, high-frequency cross-chain interoperability, and premier exchange trading pairs.',
      milestones: [
        'Native Layer-1 Mainnet token migration bridge with zero-slippage redemption.',
        'High-frequency cross-chain interoperability (EVM & Solana trustless bridges).',
        'Top-tier exchange listings and global DePIN node hardware manufacturing partnerships.',
      ],
      specs: [
        { label: 'Mainnet Bridge', value: 'Dual EVM & Solana' },
        { label: 'Clearance', value: 'Level 4 Classified' },
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative bg-[#090C10] border-t border-[#1F2736] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#F5A623]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full recessed-well border border-[#21262D] text-xs font-mono text-[#F5A623] mb-4">
            <Radio className="w-3.5 h-3.5 text-[#F5A623] animate-pulse" />
            <span className="uppercase tracking-[0.25em] font-bold">PROTOCOL BLUEPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] font-sans tracking-tight mb-4">
            Aurium Protocol Master Roadmap
          </h2>

          <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-2xl mx-auto font-normal">
            A cryptographically engineered, multi-phase trajectory transitioning from sovereign mobile PoMU consensus to global Layer-1 mainnet adoption.
          </p>
        </div>

        {/* Vertical Glowing Conduit Timeline */}
        <div className="relative">
          {/* Central Vertical Conduit Beam */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-8 w-1 bg-gradient-to-b from-[#238636] via-[#F5A623] via-50% to-[#21262D] shadow-[0_0_15px_rgba(245,166,35,0.4)]" />

          <div className="space-y-16 relative">
            {phases.map((phase, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={phase.id}
                  className={`flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-14 relative`}
                >
                  {/* Central Node Indicator on Conduit */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 top-6 md:top-1/2 md:-translate-y-1/2">
                    {phase.statusType === 'completed' && (
                      <div className="w-12 h-12 rounded-full bg-[#0D1219] border-2 border-[#238636] shadow-[0_0_20px_rgba(35,134,54,0.6)] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-[#238636]" />
                      </div>
                    )}

                    {phase.statusType === 'active' && (
                      <div className="w-14 h-14 rounded-full bg-[#111722] border-2 border-[#F5A623] shadow-[0_0_30px_rgba(245,166,35,0.8),0_0_60px_rgba(245,166,35,0.3)] flex items-center justify-center animate-pulse">
                        <div className="w-6 h-6 rounded-full bg-[#F5A623] flex items-center justify-center text-[#070A0E]">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    )}

                    {phase.statusType === 'locked' && (
                      <div className="w-12 h-12 rounded-full bg-[#090C10] border-2 border-[#30363D] shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center group hover:border-[#8B949E] transition-colors">
                        <Lock className="w-5 h-5 text-[#8B949E]" />
                      </div>
                    )}
                  </div>

                  {/* Empty Spacer Column on Desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Milestone Card Column */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0">
                    <div
                      className={`aurium-card rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden group ${
                        phase.highlight
                          ? 'border-[#F5A623]/60 shadow-[0_0_35px_rgba(245,166,35,0.25)] bg-gradient-to-b from-[#18202E] to-[#111621]'
                          : phase.statusType === 'completed'
                          ? 'border-[#238636]/40 hover:border-[#238636]/70'
                          : 'border-[#21262D] opacity-90 hover:opacity-100 hover:border-[#3E4B63]'
                      }`}
                    >
                      {/* Suspense Classified Watermark for Locked Phases */}
                      {phase.statusType === 'locked' && (
                        <div className="absolute top-4 right-4 pointer-events-none select-none">
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-[#1F2736]/60 border border-[#30363D] text-[#8B949E] flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#8B949E]" />
                            <span>CLASSIFIED / LOCKED</span>
                          </span>
                        </div>
                      )}

                      {/* Header Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#58A6FF] tracking-widest">
                            {phase.phaseCode}
                          </span>
                          <span className="text-[#30363D]">|</span>
                          <span className="font-mono text-xs text-[#8B949E]">{phase.timeline}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center">
                          {phase.statusType === 'completed' && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#238636]/15 text-[#238636] border border-[#238636]/40 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>COMPLETED</span>
                            </span>
                          )}

                          {phase.statusType === 'active' && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/50 shadow-[0_0_12px_rgba(245,166,35,0.4)] flex items-center gap-1.5 animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                              <span>ACTIVE NOW</span>
                            </span>
                          )}

                          {phase.statusType === 'locked' && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F2736] text-[#8B949E] border border-[#30363D] flex items-center gap-1.5">
                              <Lock className="w-3 h-3" />
                              <span>{phase.status}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Phase Title */}
                      <h3 className="text-xl sm:text-2xl font-black text-[#F0F6FC] font-sans tracking-tight mb-2 group-hover:text-[#F5A623] transition-colors">
                        {phase.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed mb-6">
                        {phase.summary}
                      </p>

                      {/* Milestones in Recessed Well */}
                      <div className="recessed-well rounded-2xl p-4 sm:p-5 border border-[#21262D] space-y-3 mb-5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B949E] mb-1">
                          Key Protocol Deliverables:
                        </div>
                        {phase.milestones.map((milestone, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-3 text-xs leading-relaxed text-[#8B949E]">
                            <div className="mt-1 shrink-0">
                              {phase.statusType === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#238636]" />
                              ) : phase.statusType === 'active' ? (
                                <Zap className="w-4 h-4 text-[#F5A623]" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-[#484F58]" />
                              )}
                            </div>
                            <span className={phase.statusType === 'active' ? 'text-[#F0F6FC] font-medium' : ''}>
                              {milestone}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Telemetry Specs Footer */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1F2736] text-xs">
                        {phase.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex flex-col">
                            <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">{spec.label}</span>
                            <span className="font-mono font-bold text-[#F0F6FC] text-[11px] sm:text-xs">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
