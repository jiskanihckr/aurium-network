import React, { useState } from 'react';
import { X, Lock, Mail, Wallet, ShieldCheck, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { AuriumLogo } from './AuriumLogo';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  auth: ReturnType<typeof useSupabaseAuth>;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({ isOpen, onClose, auth }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'wallet'>('email');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isSignUp) {
        await auth.signUpWithEmail(email, password);
      } else {
        await auth.signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setLocalError(msg);
    }
  };

  const handleConnectWallet = async () => {
    setLocalError(null);
    try {
      await auth.connectWallet();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wallet connection failed';
      setLocalError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="aurium-card rounded-3xl w-full max-w-md border border-[#21262D] shadow-2xl relative p-6 sm:p-8 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#F5A623]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#1F2736]">
          <div className="flex items-center gap-3">
            <AuriumLogo size="sm" showText={false} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#F0F6FC] font-sans tracking-wide">
                AUTHENTICATE NODE
              </h2>
              <div className="text-[11px] text-[#8B949E] font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#238636]" />
                <span>Supabase & Web3 Identity</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full recessed-well hover:border-[#F5A623]/40 border border-[#1F2736] flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Method Tabs */}
        <div className="flex items-center gap-2 p-1.5 recessed-well rounded-full border border-[#21262D] mt-6 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'email' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Access</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'wallet' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Web3 Wallet</span>
          </button>
        </div>

        {/* Error Notification */}
        {(localError || auth.authError) && (
          <div className="p-3 mb-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{localError || auth.authError}</span>
          </div>
        )}

        {/* Tab 1: Email & Passkey */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="validator@aurium.network"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623] pl-10"
                />
                <Mail className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                Passkey / Security Credential
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623] pl-10"
                />
                <Lock className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={auth.isLoading}
              className="btn-gold-capsule w-full py-3.5 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{auth.isLoading ? 'AUTHENTICATING...' : isSignUp ? 'CREATE VALIDATOR ACCOUNT' : 'SIGN IN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4 text-[#070A0E]" />
            </button>

            <div className="pt-2 text-center flex items-center justify-between text-xs text-[#8B949E]">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="hover:text-[#F5A623] transition-colors cursor-pointer"
              >
                {isSignUp ? 'Already registered? Sign In' : 'New Validator? Create Account'}
              </button>
              <span className="font-mono text-[10px] text-[#58A6FF]">
                {auth.isSupabaseConfigured ? 'Supabase Live' : 'Instant Protocol Auth'}
              </span>
            </div>
          </form>
        )}

        {/* Tab 2: Web3 Wallet Connect */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Connect your EVM or Solana non-custodial wallet to instantly verify your light validator node and bind presale allocations.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={auth.isLoading}
                className="btn-dark-capsule w-full py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span>MetaMask / Injected Web3</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={auth.isLoading}
                className="btn-dark-capsule w-full py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#58A6FF]/20 flex items-center justify-center text-[#58A6FF]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Trust Wallet & WalletConnect</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={auth.isLoading}
                className="btn-dark-capsule w-full py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#238636]/20 flex items-center justify-center text-[#238636]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Direct Mobile Node Keypair</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-2 text-center text-[10px] text-[#8B949E] font-mono flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-[#238636]" />
              <span>Zero-knowledge signed message · No gas required</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
