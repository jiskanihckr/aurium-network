import React, { useState, useRef } from 'react';
import { X, Copy, Check, QrCode, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { AuriumState, NetworkChain } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface PresaleDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AuriumState;
  onSubmitTxid: (data: {
    userWallet: string;
    network: NetworkChain;
    amountUsdt: number;
    txid: string;
    note?: string;
    proofImageBase64?: string;
    round?: string;
  }) => Promise<void>;
}

export const PresaleDepositModal: React.FC<PresaleDepositModalProps> = ({
  isOpen,
  onClose,
  state,
  onSubmitTxid,
}) => {
  const [selectedChain, setSelectedChain] = useState<NetworkChain>('BEP-20');
  const [copied, setCopied] = useState(false);
  const [calculatorUsdt, setCalculatorUsdt] = useState<number>(250);

  // Form states
  const [formWallet, setFormWallet] = useState('');
  const [formAmount, setFormAmount] = useState('250');
  const [formTxid, setFormTxid] = useState('');
  const [formNote, setFormNote] = useState('');
  const [proofImageBase64, setProofImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentAddress =
    selectedChain === 'BEP-20'
      ? state.depositAddresses.bep20
      : selectedChain === 'TRC-20'
      ? state.depositAddresses.trc20
      : state.depositAddresses.erc20;

  const isChainEnabled =
    selectedChain === 'BEP-20'
      ? state.deposits.chains.bep20
      : selectedChain === 'TRC-20'
      ? state.deposits.chains.trc20
      : state.deposits.chains.erc20;

  const handleCopy = () => {
    if (!currentAddress) return;
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Screenshot file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTxidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const amount = Number(formAmount);
    if (!formWallet.trim()) {
      setErrorMsg('Please enter your receiving wallet address.');
      return;
    }
    if (isNaN(amount) || amount < state.presale.minDepositUsdt) {
      setErrorMsg(`Minimum presale deposit is $${state.presale.minDepositUsdt} USDT.`);
      return;
    }
    if (!formTxid.trim()) {
      setErrorMsg('Please enter your Transaction Hash (TXID).');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitTxid({
        userWallet: formWallet.trim(),
        network: selectedChain,
        amountUsdt: amount,
        txid: formTxid.trim(),
        note: formNote.trim() || undefined,
        proofImageBase64: proofImageBase64 || undefined,
        round: state.presale.round,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to submit TXID. Please try again.');
    }
  };

  const calculatedAuri = Math.floor(calculatorUsdt / state.presale.rateUsdtPerAuri);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="aurium-card rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-[#2C3547] shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2736]">
          <div className="flex items-center gap-3">
            <AuriumLogo size="sm" showText={false} />
            <div>
              <h2 className="text-xl font-black text-[#F0F6FC] font-sans tracking-wide">
                DEPOSIT NOW · {state.presale.round.toUpperCase()}
              </h2>
              <div className="text-xs text-[#8B949E] font-mono">
                Rate: 1 AURI = ${state.presale.rateUsdtPerAuri} USDT · Min: ${state.presale.minDepositUsdt} USDT
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full recessed-well hover:border-[#F5A623]/40 border border-[#1F2736] flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Network Selection */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#F5A623] text-[#070A0E] text-[11px] font-black flex items-center justify-center font-mono">
                1
              </span>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F0F6FC]">
                Select Deposit Network (USDT)
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(['BEP-20', 'TRC-20', 'ERC-20'] as NetworkChain[]).map((chain) => {
                const enabled =
                  chain === 'BEP-20'
                    ? state.deposits.chains.bep20
                    : chain === 'TRC-20'
                    ? state.deposits.chains.trc20
                    : state.deposits.chains.erc20;

                const isSelected = selectedChain === chain;

                return (
                  <button
                    key={chain}
                    type="button"
                    onClick={() => {
                      setSelectedChain(chain);
                      setCopied(false);
                    }}
                    className={`py-3 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'btn-gold-capsule'
                        : enabled
                        ? 'btn-dark-capsule'
                        : 'recessed-well text-red-400/50 line-through border-red-500/20'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-[#238636]' : 'bg-red-500'}`} />
                    <span>{chain}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chain Paused Alert */}
          {!isChainEnabled && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                Deposits for <strong>{selectedChain}</strong> are temporarily paused by protocol administration. Please switch to another supported network.
              </span>
            </div>
          )}

          {/* Official Receiving Address with QR & Copy */}
          <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">
                OFFICIAL RECEIVING WALLET ({selectedChain})
              </span>
              <span className="text-[#238636] font-mono text-[11px] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED COLD STORAGE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Luxury QR Bezel */}
              <div className="p-2.5 rounded-2xl bg-white shadow-2xl shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-black">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  <rect x="36" y="36" width="28" height="28" fill="currentColor" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <rect x="47" y="47" width="6" height="6" fill="currentColor" />

                  <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="52" y="16" width="8" height="8" fill="currentColor" />
                  <rect x="15" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="75" y="45" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="75" width="12" height="12" fill="currentColor" />
                  <rect x="70" y="75" width="15" height="15" fill="currentColor" />
                </svg>
              </div>

              {/* Address details & One-Click Copy Button */}
              <div className="flex-1 w-full space-y-2.5">
                <div className="p-3 rounded-xl bg-[#090C10] border border-[#1F2736] font-mono text-xs text-[#F0F6FC] break-all select-all">
                  {currentAddress}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#8B949E]">
                    Deposit strictly USDT ({selectedChain}) to this address.
                  </span>
                  <button
                    onClick={handleCopy}
                    className="btn-gold-capsule px-4 py-2 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#070A0E]" /> : <Copy className="w-3.5 h-3.5 text-[#070A0E]" />}
                    <span>{copied ? 'COPIED' : 'ONE-CLICK COPY'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Well */}
          <div className="recessed-well rounded-2xl p-4 border border-[#1F2736]">
            <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2 font-semibold uppercase text-[11px]">
              <span>ALLOCATION ESTIMATOR</span>
              <span className="font-mono text-[#F5A623]">1 AURI = ${state.presale.rateUsdtPerAuri} USDT</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] text-[#8B949E] uppercase font-semibold block mb-1">
                  DEPOSIT PLEDGE (USDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={state.presale.minDepositUsdt}
                    step="10"
                    value={calculatorUsdt}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCalculatorUsdt(v);
                      setFormAmount(String(v));
                    }}
                    className="w-full px-4 py-2.5 rounded-full bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-sm focus:outline-none focus:border-[#F5A623]"
                  />
                  <span className="absolute right-4 top-3 text-xs text-[#8B949E] font-mono">USDT</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8B949E] uppercase font-semibold block mb-1">
                  AURI ALLOCATION SECURED
                </label>
                <div className="px-4 py-2.5 rounded-full bg-[#090C10] border border-[#1F2736] text-[#F5A623] font-mono font-black text-sm flex items-center justify-between gold-glow-text">
                  <span>{calculatedAuri.toLocaleString()}</span>
                  <span className="text-xs text-[#8B949E] font-sans">AURI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 & 3: TXID Submission & Proof Verification Form */}
          <div className="pt-2 border-t border-[#1F2736]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#F5A623] text-[#070A0E] text-[11px] font-black flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#F0F6FC]">
                Transaction Hash / TXID Verification
              </h3>
            </div>

            {/* Required Verification Notice */}
            <div className="p-3 rounded-xl bg-[#58A6FF]/10 border border-[#58A6FF]/30 text-xs text-[#58A6FF] mb-4">
              Enter your TXID. Submissions are queued for validator hash verification. Allocation balances update upon network confirmation.
            </div>

            {submitSuccess ? (
              <div className="recessed-well rounded-2xl p-6 border border-[#238636]/40 text-center space-y-2">
                <CheckCircle className="w-9 h-9 text-[#238636] mx-auto" />
                <div className="text-base font-extrabold text-[#F0F6FC]">Deposit TXID Successfully Queued!</div>
                <div className="text-xs text-[#8B949E] max-w-md mx-auto">
                  Your transaction has been queued for validator hash verification. Allocation balances update upon network confirmation.
                </div>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setProofImageBase64(null);
                  }}
                  className="mt-3 text-xs text-[#F5A623] hover:underline uppercase tracking-wider font-bold"
                >
                  Submit Another Transaction
                </button>
              </div>
            ) : (
              <form onSubmit={handleTxidSubmit} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#8B949E] uppercase font-semibold mb-1">
                      Your Receiving Wallet *
                    </label>
                    <input
                      type="text"
                      placeholder="0x... or T..."
                      value={formWallet}
                      onChange={(e) => setFormWallet(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#8B949E] uppercase font-semibold mb-1">
                      Deposited Amount (USDT) *
                    </label>
                    <input
                      type="number"
                      min={state.presale.minDepositUsdt}
                      placeholder="50"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#8B949E] uppercase font-semibold mb-1">
                    Transaction Hash / TXID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter blockchain transaction hash (e.g. 0x8f2d...)"
                    value={formTxid}
                    onChange={(e) => setFormTxid(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                  />
                </div>

                {/* Optional Upload Proof of Transfer */}
                <div>
                  <label className="block text-[10px] text-[#8B949E] uppercase font-semibold mb-1">
                    Upload Proof of Transfer (Optional Screenshot)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!proofImageBase64 ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 rounded-2xl recessed-well border border-dashed border-[#2C3547] hover:border-[#F5A623]/50 text-xs text-[#8B949E] hover:text-[#F0F6FC] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#F5A623]" />
                      <span>Attach transfer confirmation screenshot</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-2xl recessed-well border border-[#238636]/40">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={proofImageBase64}
                          alt="Proof preview"
                          className="w-10 h-10 object-cover rounded-lg border border-[#21262D]"
                        />
                        <div className="text-xs text-[#238636] font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Proof Attached</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProofImageBase64(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] text-[#8B949E] uppercase font-semibold mb-1">
                    Node Validator Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Validator allocation deposit"
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] text-xs focus:outline-none focus:border-[#F5A623]"
                  />
                </div>

                {/* Pill Capsule Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isChainEnabled}
                  className="btn-gold-capsule w-full py-4 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-bold"
                >
                  {isSubmitting ? (
                    <span>QUEUING TRANSACTION FOR VALIDATOR VERIFICATION...</span>
                  ) : (
                    <>
                      <span>SUBMIT TRANSACTION FOR ON-CHAIN APPROVAL</span>
                      <ArrowRight className="w-4 h-4 text-[#070A0E]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
