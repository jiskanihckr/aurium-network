import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { AuriumLogo } from './AuriumLogo';

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center relative z-10">
      {/* Ambient background glow */}
      <div className="w-72 h-72 bg-[#F5A623]/5 blur-[120px] pointer-events-none rounded-full absolute" />

      <div className="aurium-card max-w-lg w-full p-8 sm:p-12 rounded-3xl border border-[#21262D] relative shadow-2xl space-y-6">
        <div className="flex justify-center mb-2">
          <AuriumLogo size="lg" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>ERROR 404</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] font-sans tracking-tight">
            This page doesn't exist
          </h1>
          <p className="text-sm text-[#8B949E] leading-relaxed max-w-md mx-auto">
            The requested cryptographic address or route was not recognized on the Aurium Network protocol index.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onBackToHome}
            className="btn-gold-capsule px-6 py-3.5 text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-[#070A0E]" />
            <span>RETURN TO AURIUM NETWORK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
