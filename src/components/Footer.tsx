import React from 'react';
import { ShieldCheck, Smartphone, Lock } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface FooterProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ state, onOpenApkModal, onOpenAdmin }) => {
  return (
    <footer className="bg-[#070A0E] border-t border-[#1F2736] text-[#8B949E] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Crest & Details */}
          <div className="space-y-4 md:col-span-1">
            <AuriumLogo size="md" />
            <p className="text-xs text-[#8B949E] leading-relaxed pt-2">
              Next-generation decentralized mobile consensus protocol with zero hardware strain and algorithmic emission deflation.
            </p>
            <div className="text-[11px] font-mono text-[#F5A623]">
              Active Release: {state.apk.version} ({state.apk.fileSize})
            </div>
          </div>

          {/* Col 2: Protocol Navigation */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#F0F6FC] uppercase tracking-widest">Protocol</div>
            <ul className="space-y-2">
              <li>
                <a href="#node-network" className="hover:text-[#F0F6FC] transition-colors">
                  Light Validator Nodes
                </a>
              </li>
              <li>
                <a href="#halving" className="hover:text-[#F0F6FC] transition-colors">
                  Halving Gauge & Emissions
                </a>
              </li>
              <li>
                <a href="#presale" className="hover:text-[#F0F6FC] transition-colors">
                  Strategic Presale Portal
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-[#F0F6FC] transition-colors">
                  Protocol Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Verification */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#F0F6FC] uppercase tracking-widest">Resources & Ops</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenApkModal}
                  className="hover:text-[#F0F6FC] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span>Download Signed APK ({state.apk.version})</span>
                </button>
              </li>
              <li>
                <span className="text-[#8B949E] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#238636]" />
                  <span>CertiK Security Audit (Passed)</span>
                </span>
              </li>
              <li>
                <span className="text-[#8B949E]">Whitepaper v1.4 (Technical Specification)</span>
              </li>
              <li>
                <span className="text-[#8B949E]">Consensus Specification (PoMU)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Network Telemetry Snapshot */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#F0F6FC] uppercase tracking-widest">Network Telemetry</div>
            <div className="p-4 rounded-2xl recessed-well border border-[#1F2736] space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="uppercase text-[#8B949E]">Status:</span>
                <span className={state.network.isOnline ? 'text-[#238636] font-bold' : 'text-amber-400 font-bold'}>
                  {state.network.isOnline ? 'Fully Operational' : 'Maintenance Mode'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="uppercase text-[#8B949E]">Active Nodes:</span>
                <span className="font-mono text-[#F0F6FC] font-bold">{state.network.activeNodes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="uppercase text-[#8B949E]">Base Emission:</span>
                <span className="font-mono text-[#F5A623] font-bold">+{state.network.baseDailyYield} AURI/d</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1F2736] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; 2026 Aurium Protocol Foundation. All cryptographic rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[#8B949E] text-center sm:text-right font-mono">
            <span>Decentralized Mobile Consensus Layer · PoMU Engine</span>
            <span>·</span>
            {/* Subtle, low-key link at the very bottom of the page */}
            <button
              onClick={onOpenAdmin}
              className="text-gray-700 hover:text-gray-500 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="Admin Access"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
