import React, { useState } from 'react';
import { CheckCircle2, Clock, Compass } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');

  const phases = [
    {
      id: 'phase1',
      phaseNumber: 'PHASE 01',
      title: 'Foundation & Protocol Genesis',
      timeline: 'Q1 - Q2 2026',
      status: 'Completed',
      statusColor: 'text-[#238636] bg-[#238636]/15 border-[#238636]/40',
      description: 'Core architectural design of Proof of Mobile Uptime (PoMU) and initial mobile SDK.',
      milestones: [
        'Light validator client architecture & zero-CPU cryptographic scheduling',
        'Alpha Android testnet deployment with 5,000 community validators',
        'Smart contract architecture for $AURI deflationary halving schedules',
        'Initial CertiK security audit of emission mathematics',
      ],
    },
    {
      id: 'phase2',
      phaseNumber: 'PHASE 02',
      title: 'Public Beta & Node Expansion',
      timeline: 'Q3 - Q4 2026',
      status: 'In Progress',
      statusColor: 'text-[#F5A623] bg-[#F5A623]/15 border-[#F5A623]/40',
      description: 'Mass distribution of direct APK v1.0.2 and strategic token allocation presale.',
      milestones: [
        'Release of v1.0.2 direct APK with background battery optimization (<0.4%)',
        'Launch of 10,000,000 AURI Strategic Presale Round 1 & Round 2',
        'Real-time validator consensus dashboard & TXID automated queuing',
        'Onboarding over 45,000 decentralized global smartphone nodes',
      ],
    },
    {
      id: 'phase3',
      phaseNumber: 'PHASE 03',
      title: 'Mainnet Genesis & Token Launch',
      timeline: 'Q1 2027',
      status: 'Upcoming',
      statusColor: 'text-[#58A6FF] bg-[#58A6FF]/15 border-[#58A6FF]/40',
      description: 'Decentralized mainnet transition, Tier-1 CEX & DEX listings, and bridge integrations.',
      milestones: [
        'Mainnet Genesis Block creation and automated node validator transition',
        'Tier-1 Centralized Exchange listings & Uniswap v3 / PancakeSwap pools',
        'Cross-chain trustless bridge connecting BNB Smart Chain, Ethereum, and TRON',
        'First programmatic Emission Halving epoch execution',
      ],
    },
  ];

  const filteredPhases = activeTab === 'all' ? phases : phases.filter((p) => p.id === activeTab);

  return (
    <section id="roadmap" className="py-20 relative bg-[#090C10] border-t border-[#1F2736]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#58A6FF] font-bold mb-2 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>DEVELOPMENT TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] font-sans tracking-tight">
            Aurium Protocol Roadmap
          </h2>
          <p className="text-sm sm:text-base text-[#8B949E] mt-3">
            A precise technical progression from lightweight mobile testnet to global layer-1 mainnet consensus.
          </p>

          {/* Recessed Filter Tabs Well with Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 recessed-well border border-[#1F2736] rounded-full mt-8 max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === 'all' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setActiveTab('phase1')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === 'phase1' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              Phase 1
            </button>
            <button
              onClick={() => setActiveTab('phase2')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === 'phase2' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              Phase 2
            </button>
            <button
              onClick={() => setActiveTab('phase3')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === 'phase3' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              Phase 3
            </button>
          </div>
        </div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPhases.map((phase) => (
            <div
              key={phase.id}
              className={`aurium-card rounded-3xl p-7 relative flex flex-col justify-between transition-all ${
                phase.status === 'In Progress' ? 'border-t-[#F5A623] shadow-[0_0_25px_rgba(245,166,35,0.2)]' : ''
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-extrabold text-[#8B949E] tracking-wider">{phase.phaseNumber}</span>
                  <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${phase.statusColor}`}>
                    {phase.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#58A6FF] mb-1 font-semibold">{phase.timeline}</div>

                <h3 className="text-xl font-bold text-[#F0F6FC] mb-2 font-sans">
                  {phase.title}
                </h3>

                <p className="text-xs text-[#8B949E] leading-relaxed mb-6">
                  {phase.description}
                </p>

                {/* Milestones list in Recessed Well */}
                <div className="recessed-well rounded-2xl p-4 space-y-3 border border-[#1F2736]">
                  {phase.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#8B949E]">
                      {phase.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#238636] shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                      )}
                      <span className={phase.status === 'Completed' ? 'text-[#F0F6FC]' : ''}>
                        {milestone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
