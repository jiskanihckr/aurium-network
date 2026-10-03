import React, { useState } from 'react';
import { KeyRound, ArrowRight, X, AlertCircle } from 'lucide-react';
import { AuriumLogo } from './AuriumLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MASTER_PASSKEY = import.meta.env.VITE_ADMIN_KEY || 'Aurium#9xK7$vM2!NodeValidator2026';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.trim() === MASTER_PASSKEY) {
      setError('');
      onSuccess();
    } else {
      setError('Access denied: Invalid administrative credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <div className="aurium-card rounded-3xl w-full max-w-md border border-[#2C3547] shadow-2xl relative p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-[#1F2736]">
          <div className="flex items-center gap-3">
            <AuriumLogo size="sm" showText={false} />
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans tracking-wide">
                RESTRICTED VAULT GATEWAY
              </h2>
              <div className="text-xs text-[#8B949E] font-mono">Protected Governance Console</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full recessed-well hover:border-[#F5A623]/40 border border-[#1F2736] flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          <p className="text-xs text-[#8B949E] leading-relaxed">
            Encrypted vault authorization required. This operation is signed and logged across protocol consensus nodes.
          </p>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-2">
              Master Administrative Passkey
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter administrative credentials"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                className="w-full px-4 py-3.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-sm focus:outline-none focus:border-[#F5A623] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-[#8B949E] absolute right-4 top-4" />
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold-capsule w-full py-3.5 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold"
          >
            <span>VERIFY CREDENTIALS & ACCESS VAULT</span>
            <ArrowRight className="w-4 h-4 text-[#070A0E]" />
          </button>
        </form>
      </div>
    </div>
  );
};
