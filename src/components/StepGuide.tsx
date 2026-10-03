import React from 'react';
import { Smartphone, KeyRound, Coins, ArrowRight } from 'lucide-react';
import { AuriumState } from '../types';

interface StepGuideProps {
  state: AuriumState;
  onOpenApkModal: () => void;
  onOpenPresaleModal: () => void;
}

export const StepGuide: React.FC<StepGuideProps> = ({
  state,
  onOpenApkModal,
  onOpenPresaleModal,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Download Direct APK',
      subtitle: `Release ${state.apk.version} · Signed Sideload`,
      description:
        'Sideload the signed mobile light client directly to your smartphone. Free from centralized app store restrictions and zero telemetry.',
      icon: Smartphone,
      actionText: 'GET APK BINARY',
      action: onOpenApkModal,
    },
    {
      step: '02',
      title: 'Activate Validator Node',
      subtitle: 'Zero CPU Strain · Low Bandwidth',
      description:
        'Instantly initialize your cryptographic validator keypair. The Proof of Mobile Uptime engine runs silently in background using <0.4% battery.',
      icon: KeyRound,
      actionText: 'ACTIVATE NODE',
      action: onOpenApkModal,
    },
    {
      step: '03',
      title: 'Harvest Yield & Join Presale',
      subtitle: `+${state.network.baseDailyYield} AURI/Day · Whitelist Tier`,
      description:
        'Accumulate daily protocol rewards directly into non-custodial storage. Stake in early strategic presale rounds to maximize compounding.',
      icon: Coins,
      actionText: 'JOIN PRESALE',
      action: onOpenPresaleModal,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold mb-2.5">
            NODE DEPLOYMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] font-sans tracking-tight">
            How to Activate Your Aurium Node
          </h2>
          <p className="text-sm sm:text-base text-[#8B949E] mt-3">
            Join 45,210+ active smartphone nodes worldwide in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="aurium-card rounded-3xl p-8 relative flex flex-col justify-between group hover:border-[#F5A623]/50 transition-all duration-300"
              >
                {/* Step indicator watermark */}
                <div className="absolute top-5 right-6 text-5xl font-black font-mono text-[#1F2736]/40 select-none">
                  {item.step}
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl recessed-well border border-[#2C3547] flex items-center justify-center text-[#F5A623] mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7 drop-shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                  </div>

                  <div className="text-xs font-mono text-[#58A6FF] mb-1 font-semibold uppercase tracking-wider">
                    Step {item.step}
                  </div>

                  <h3 className="text-xl font-bold text-[#F0F6FC] mb-2 font-sans">
                    {item.title}
                  </h3>

                  <div className="text-xs font-mono text-[#F5A623] mb-3">
                    {item.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={item.action}
                  className="btn-dark-capsule w-full py-3 px-5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5A623]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
