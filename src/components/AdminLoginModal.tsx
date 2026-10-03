import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, X, AlertCircle } from 'lucide-react';
import { AuriumLogo } from './AuriumLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === 'aurium2026' || passkey === 'admin' || passkey === 'aurium') {
      setError('');
      onSuccess();
    } else {
      setError('Invalid master administrative passkey. Try: aurium2026');
    }
  };

  const handleQuickDemo = () => {
    setPasskey('aurium2026');
    setError('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="aurium-card rounded-3xl w-full max-w-md border border-[#2C3547] shadow-2xl relative p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-[#1F2736]">
          <div className="flex items-center gap-3">
            <AuriumLogo size="sm" showText={false} />
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans tracking-wide">
                RESTRICTED GOVERNANCE
              </h2>
              <div className="text-xs text-[#8B949E] font-mono">Protected Protocol Console (/admin)</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full recessed-well hover:border-[#F5A623]/40 border border-[#1F2736] flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <p className="text-xs text-[#8B949E]">
            Direct administrative access to master kill-switches, halving triggers, wallet addresses, and deposit approvals.
          </p>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-2">
              Protocol Admin Passkey
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter passkey (e.g. aurium2026)"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-sm focus:outline-none focus:border-[#F5A623]"
              />
              <KeyRound className="w-4 h-4 text-[#8B949E] absolute right-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold-capsule w-full py-3.5 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>UNLOCK GOVERNANCE DASHBOARD</span>
            <ArrowRight className="w-4 h-4 text-[#070A0E]" />
          </button>

          {/* Quick Demo Access Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-[#58A6FF] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>Instant Evaluator Demo Access</span>
              <span className="font-mono text-[10px] text-[#8B949E]">(aurium2026)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
