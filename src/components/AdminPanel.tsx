import React, { useState } from 'react';
import {
  Shield,
  Power,
  Scissors,
  Wallet,
  CheckCircle,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  ArrowLeft,
  Flame,
  Layers,
} from 'lucide-react';
import { AuriumState, NetworkChain, PartialAuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface AdminPanelProps {
  state: AuriumState;
  onBackToPublic: () => void;
  updateToggles: (partial: PartialAuriumState) => Promise<void>;
  updateAddresses: (addresses: { bep20?: string; trc20?: string; erc20?: string }) => Promise<void>;
  updateApk: (apkData: Partial<AuriumState['apk']>) => Promise<void>;
  triggerHalvingCut: () => Promise<void>;
  updateHalvingDate: (dateIso: string) => Promise<void>;
  handleTxidAction: (id: string, action: 'approve' | 'reject', note?: string) => Promise<void>;
  submitDepositTxid: (data: {
    userWallet: string;
    network: NetworkChain;
    amountUsdt: number;
    txid: string;
    note?: string;
  }) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isConnected: boolean;
  lastSyncTime: Date;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  state,
  onBackToPublic,
  updateToggles,
  updateAddresses,
  updateApk,
  triggerHalvingCut,
  updateHalvingDate,
  handleTxidAction,
  submitDepositTxid,
  resetToDefaults,
  isConnected,
}) => {
  const [bep20Address, setBep20Address] = useState(state.depositAddresses.bep20);
  const [trc20Address, setTrc20Address] = useState(state.depositAddresses.trc20);
  const [erc20Address, setErc20Address] = useState(state.depositAddresses.erc20);
  const [addressSaved, setAddressSaved] = useState(false);

  const [apkVersion, setApkVersion] = useState(state.apk.version);
  const [apkUrl, setApkUrl] = useState(state.apk.downloadUrl);
  const [apkSize, setApkSize] = useState(state.apk.fileSize);
  const [apkSha256, setApkSha256] = useState(state.apk.sha256);
  const [apkSaved, setApkSaved] = useState(false);

  const [halvingDateInput, setHalvingDateInput] = useState(() => {
    try {
      const d = new Date(state.halving.nextHalvingDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });

  const [minWithdrawalInput, setMinWithdrawalInput] = useState(String(state.withdrawals.minWithdrawalAuri));
  const [txidFilter, setTxidFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedTxid, setCopiedTxid] = useState<string | null>(null);
  const [isHalvingLoading, setIsHalvingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxid(id);
    setTimeout(() => setCopiedTxid(null), 2000);
  };

  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAddresses({
      bep20: bep20Address,
      trc20: trc20Address,
      erc20: erc20Address,
    });
    setAddressSaved(true);
    showToast('Addresses updated and synchronized with live clients!');
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const handleSaveApk = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateApk({
      version: apkVersion,
      downloadUrl: apkUrl,
      fileSize: apkSize,
      sha256: apkSha256,
    });
    setApkSaved(true);
    showToast(`APK release ${apkVersion} updated on landing page!`);
    setTimeout(() => setApkSaved(false), 2500);
  };

  const handleTriggerHalving = async () => {
    const confirmCut = window.confirm(
      `Confirm triggering emission halving? This will immediately reduce base daily yield from ${state.network.baseDailyYield} to ${(state.network.baseDailyYield / 2).toFixed(2)} AURI/day across all active nodes.`
    );
    if (!confirmCut) return;

    setIsHalvingLoading(true);
    await triggerHalvingCut();
    setIsHalvingLoading(false);
    showToast('Emission Halving executed! Base daily yield reduced by 50%.');
  };

  const handleUpdateHalvingDate = async () => {
    if (!halvingDateInput) return;
    const isoDate = new Date(halvingDateInput).toISOString();
    await updateHalvingDate(isoDate);
    showToast('Halving countdown target date updated!');
  };

  const handleSimulateDeposit = async () => {
    const randomChains: NetworkChain[] = ['BEP-20', 'TRC-20', 'ERC-20'];
    const selected = randomChains[Math.floor(Math.random() * randomChains.length)];
    const randomAmount = [100, 250, 500, 1000, 2500][Math.floor(Math.random() * 5)];
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    await submitDepositTxid({
      userWallet: `0x${randomHex.substring(0, 4)}...${randomHex.substring(60)}`,
      network: selected,
      amountUsdt: randomAmount,
      txid: `0x${randomHex}`,
      note: 'Simulated node validator pledge',
    });
    showToast('Simulated incoming TXID added to queue!');
  };

  const filteredTxids = state.txids.filter((item) => {
    if (txidFilter === 'all') return true;
    return item.status === txidFilter;
  });

  const pendingCount = state.txids.filter((t) => t.status === 'pending').length;
  const approvedCount = state.txids.filter((t) => t.status === 'approved').length;
  const totalVolume = state.txids
    .filter((t) => t.status === 'approved')
    .reduce((acc, curr) => acc + curr.amountUsdt, 0);

  return (
    <div className="min-h-screen bg-[#090C10] text-[#F0F6FC] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 aurium-card text-[#F0F6FC] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#F5A623]">
          <CheckCircle className="w-5 h-5 text-[#F5A623]" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <div className="bg-[#0D121A]/95 border-b border-[#1F2736] sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToPublic}
              className="btn-dark-capsule px-4 py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public View</span>
            </button>

            <div className="h-4 w-px bg-[#2C3547] hidden sm:block" />

            <AuriumLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#8B949E] font-mono recessed-well px-3 py-1.5 rounded-full border border-[#1F2736]">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#238636] animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline">{isConnected ? 'LIVE SSE ACTIVE' : 'OFFLINE'}</span>
            </div>

            <button
              onClick={resetToDefaults}
              title="Reset state to protocol initial defaults"
              className="btn-dark-capsule px-3 py-1.5 text-xs text-[#8B949E] hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Killswitch Alert Banner if Network is paused */}
        {!state.network.isOnline && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-red-200">
                  CRITICAL: Node Network Master Kill-Switch is ACTIVE
                </div>
                <div className="text-xs text-red-300">
                  Consensus sync is suspended on the public landing page. Mobile nodes will see maintenance mode.
                </div>
              </div>
            </div>
            <button
              onClick={() => updateToggles({ network: { isOnline: true } })}
              className="btn-gold-capsule px-5 py-2 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Resume Network
            </button>
          </div>
        )}

        {/* 1. MASTER FEATURE TOGGLES */}
        <section className="aurium-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2736]">
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans flex items-center gap-2">
                <Power className="w-5 h-5 text-[#F5A623]" />
                <span>Master Protocol Feature Toggles</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Instant kill-switches and subsystem controllers synced live to all landing page users.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8B949E] recessed-well px-3 py-1 rounded-full border border-[#1F2736]">
              5 Subsystems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Toggle 1: Node Network Status */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">
                    Node Network Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${state.network.isOnline ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40' : 'bg-red-500/15 text-red-400 border border-red-500/40'}`}>
                    {state.network.isOnline ? 'ONLINE' : 'KILLED'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F0F6FC] mb-1">Consensus Engine Kill-Switch</div>
                <p className="text-xs text-[#8B949E] mb-4">
                  Controls global block validation. When flipped off, nodes stop syncing and hero displays maintenance.
                </p>
              </div>
              <button
                onClick={() => updateToggles({ network: { isOnline: !state.network.isOnline } })}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  state.network.isOnline
                    ? 'btn-dark-capsule hover:border-red-500 hover:text-red-400'
                    : 'btn-gold-capsule'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{state.network.isOnline ? 'Kill Network' : 'Resume Network'}</span>
              </button>
            </div>

            {/* Toggle 2: Presale Status & Round Selector */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">
                    Presale Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${state.presale.enabled ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40' : 'bg-red-500/15 text-red-400 border border-red-500/40'}`}>
                    {state.presale.enabled ? state.presale.round : 'PAUSED'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F0F6FC] mb-2">Presale Allocation Portal</div>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => updateToggles({ presale: { round: 'Round 1' } })}
                    className={`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold cursor-pointer ${
                      state.presale.round === 'Round 1'
                        ? 'btn-gold-capsule text-[11px]'
                        : 'btn-dark-capsule text-[11px]'
                    }`}
                  >
                    Round 1 ($0.05)
                  </button>
                  <button
                    onClick={() => updateToggles({ presale: { round: 'Round 2' } })}
                    className={`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold cursor-pointer ${
                      state.presale.round === 'Round 2'
                        ? 'btn-gold-capsule text-[11px]'
                        : 'btn-dark-capsule text-[11px]'
                    }`}
                  >
                    Round 2 ($0.08)
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#8B949E] mb-1">
                    <span>Progress:</span>
                    <span className="font-mono text-[#F5A623] font-bold">{state.presale.progressPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={state.presale.progressPercent}
                    onChange={(e) => updateToggles({ presale: { progressPercent: Number(e.target.value) } })}
                    className="w-full h-1.5 bg-[#1F2736] rounded appearance-none cursor-pointer accent-[#F5A623]"
                  />
                </div>
              </div>
              <button
                onClick={() => updateToggles({ presale: { enabled: !state.presale.enabled } })}
                className="btn-dark-capsule w-full py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{state.presale.enabled ? 'Pause Presale' : 'Enable Presale'}</span>
              </button>
            </div>

            {/* Toggle 3: Withdrawals Status */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">
                    Withdrawals Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${state.withdrawals.enabled ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40' : 'bg-red-500/15 text-red-400 border border-red-500/40'}`}>
                    {state.withdrawals.enabled ? 'OPEN' : 'PAUSED'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F0F6FC] mb-1">AURI Withdrawal Gateway</div>
                <p className="text-xs text-[#8B949E] mb-3">
                  Allows node validators to withdraw mined tokens to external non-custodial wallets.
                </p>

                <div className="mb-4">
                  <label className="text-[10px] text-[#8B949E] uppercase font-bold block mb-1">Min. Withdrawal (AURI)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minWithdrawalInput}
                      onChange={(e) => setMinWithdrawalInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-full bg-[#090C10] border border-[#2C3547] text-xs font-mono text-[#F0F6FC]"
                    />
                    <button
                      onClick={() => updateToggles({ withdrawals: { minWithdrawalAuri: Number(minWithdrawalInput) } })}
                      className="btn-gold-capsule px-4 py-1.5 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateToggles({ withdrawals: { enabled: !state.withdrawals.enabled } })}
                className="btn-dark-capsule w-full py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{state.withdrawals.enabled ? 'Pause Withdrawals' : 'Open Withdrawals'}</span>
              </button>
            </div>

            {/* Toggle 4: Deposits Sub-Toggles */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">
                  Deposit Sub-Networks
                </span>
                <button
                  onClick={() => updateToggles({ deposits: { enabled: !state.deposits.enabled } })}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer ${
                    state.deposits.enabled
                      ? 'btn-gold-capsule text-[11px]'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  Master Deposits: {state.deposits.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="text-sm font-bold text-[#F0F6FC] mb-3">Individual Chain Toggles</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#090C10] border border-[#1F2736] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F0F6FC]">BNB Chain (BEP-20)</div>
                    <div className="text-[10px] text-[#8B949E]">BSC USDT Deposits</div>
                  </div>
                  <button
                    onClick={() =>
                      updateToggles({
                        deposits: {
                          chains: {
                            ...state.deposits.chains,
                            bep20: !state.deposits.chains.bep20,
                          },
                        },
                      })
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      state.deposits.chains.bep20 ? 'bg-[#238636] text-white' : 'bg-[#1F2736] text-[#8B949E]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090C10] border border-[#1F2736] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F0F6FC]">TRON (TRC-20)</div>
                    <div className="text-[10px] text-[#8B949E]">Tron USDT Deposits</div>
                  </div>
                  <button
                    onClick={() =>
                      updateToggles({
                        deposits: {
                          chains: {
                            ...state.deposits.chains,
                            trc20: !state.deposits.chains.trc20,
                          },
                        },
                      })
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      state.deposits.chains.trc20 ? 'bg-[#238636] text-white' : 'bg-[#1F2736] text-[#8B949E]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090C10] border border-[#1F2736] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F0F6FC]">Ethereum (ERC-20)</div>
                    <div className="text-[10px] text-[#8B949E]">ETH USDT Deposits</div>
                  </div>
                  <button
                    onClick={() =>
                      updateToggles({
                        deposits: {
                          chains: {
                            ...state.deposits.chains,
                            erc20: !state.deposits.chains.erc20,
                          },
                        },
                      })
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      state.deposits.chains.erc20 ? 'bg-[#238636] text-white' : 'bg-[#1F2736] text-[#8B949E]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle 5: P2P Internal Transfers */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">
                    P2P Transfers
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${state.p2pTransfers.enabled ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40' : 'bg-red-500/15 text-red-400 border border-red-500/40'}`}>
                    {state.p2pTransfers.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F0F6FC] mb-1">Internal Off-Chain Relay</div>
                <p className="text-xs text-[#8B949E] mb-4">
                  Controls peer-to-peer fast token transfers between light validator mobile nodes.
                </p>
              </div>
              <button
                onClick={() => updateToggles({ p2pTransfers: { enabled: !state.p2pTransfers.enabled } })}
                className="btn-dark-capsule w-full py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{state.p2pTransfers.enabled ? 'Disable P2P Relay' : 'Enable P2P Relay'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. HALVING CONTROLLER & TRIGGER */}
        <section className="aurium-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1F2736]">
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#F5A623]" />
                <span>Emission Halving Controller</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Adjust scheduled countdown targets or execute an instant 50% reward cut across the global mobile network.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full recessed-well border border-[#1F2736] text-xs font-mono text-[#F5A623]">
                Era {state.halving.currentEra}
              </div>
              <div className="px-3.5 py-1.5 rounded-full recessed-well border border-[#1F2736] text-xs font-mono text-[#58A6FF]">
                +{state.network.baseDailyYield} AURI/d
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Halving Execution Action Card */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8B949E] font-bold">Programmatic Halving</span>
                <span className="text-xs text-[#F5A623] font-mono font-bold">50% Cut</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#090C10] border border-[#1F2736] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#8B949E]">Current Base:</div>
                  <div className="text-xl font-mono font-black text-[#F0F6FC]">+{state.network.baseDailyYield} AURI/d</div>
                </div>
                <div className="text-2xl font-bold text-[#F5A623]">→</div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-[#F5A623] font-bold">Post-Halving:</div>
                  <div className="text-xl font-mono font-black text-[#F5A623] gold-glow-text">
                    +{(state.network.baseDailyYield / 2).toFixed(4)} AURI/d
                  </div>
                </div>
              </div>

              <button
                onClick={handleTriggerHalving}
                disabled={isHalvingLoading}
                className="btn-gold-capsule w-full py-3.5 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#070A0E]" />
                <span>TRIGGER HALVING (50% CUT)</span>
              </button>

              <div className="text-[11px] text-[#8B949E] text-center">
                Halving immediately updates the circular orbital gauge and public yield cards.
              </div>
            </div>

            {/* Countdown Target Date Controller */}
            <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8B949E] font-bold">Countdown Target Timestamp</span>
                <span className="text-xs text-[#58A6FF] font-mono">Live Sync</span>
              </div>

              <div>
                <label className="block text-[10px] text-[#8B949E] uppercase font-bold mb-1.5">
                  Select Next Halving Target Date & Time (UTC)
                </label>
                <input
                  type="datetime-local"
                  value={halvingDateInput}
                  onChange={(e) => setHalvingDateInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <button
                onClick={handleUpdateHalvingDate}
                className="btn-dark-capsule w-full py-2.5 px-4 text-xs uppercase tracking-wider cursor-pointer"
              >
                Update Countdown Timer on Landing Page
              </button>

              {/* Halving History Log preview */}
              <div className="pt-2 border-t border-[#1F2736]">
                <div className="text-[10px] font-bold text-[#8B949E] uppercase mb-2">Halving Execution Log:</div>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {state.halving.halvingHistory.map((h) => (
                    <div key={h.id} className="text-[11px] font-mono flex items-center justify-between text-[#8B949E] bg-[#090C10] p-2 rounded-xl border border-[#1F2736]">
                      <span>Block #{h.blockHeight.toLocaleString()}</span>
                      <span className="text-[#F0F6FC]">{h.previousYield} → {h.newYield} AURI</span>
                      <span className="text-[10px] text-[#8B949E]">{new Date(h.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DEPOSIT ADDRESS MANAGER */}
        <section className="aurium-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2736]">
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#F5A623]" />
                <span>Deposit Address Manager</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Update protocol receiving cold/hot storage addresses. Changes immediately reflect in the public Presale modal and QR code.
              </p>
            </div>
            {addressSaved && (
              <span className="text-xs text-[#238636] font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                SAVED & SYNCED!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveAddresses} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                BNB Smart Chain (BEP-20 USDT) Receiving Address *
              </label>
              <input
                type="text"
                value={bep20Address}
                onChange={(e) => setBep20Address(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                TRON (TRC-20 USDT) Receiving Address *
              </label>
              <input
                type="text"
                value={trc20Address}
                onChange={(e) => setTrc20Address(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                Ethereum (ERC-20 USDT) Receiving Address
              </label>
              <input
                type="text"
                value={erc20Address}
                onChange={(e) => setErc20Address(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="btn-gold-capsule py-2.5 px-6 text-xs uppercase tracking-wider cursor-pointer"
              >
                Save & Broadcast Addresses
              </button>
            </div>
          </form>
        </section>

        {/* 4. TXID DEPOSIT VERIFICATION QUEUE */}
        <section className="aurium-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1F2736]">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F5A623]" />
                <h2 className="text-lg font-black text-[#F0F6FC] font-sans">
                  TXID Deposit Verification Queue
                </h2>
                {pendingCount > 0 && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Review and approve on-chain deposit pledges submitted by public presale participants.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateDeposit}
                className="btn-dark-capsule px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span>Simulate Test Deposit</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics in Recessed Wells */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="recessed-well p-3.5 rounded-2xl border border-[#1F2736]">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Approved Volume</div>
              <div className="text-lg font-mono font-black text-[#238636]">${totalVolume.toLocaleString()} USDT</div>
            </div>
            <div className="recessed-well p-3.5 rounded-2xl border border-[#1F2736]">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Pending Verification</div>
              <div className="text-lg font-mono font-black text-[#F5A623]">{pendingCount} Records</div>
            </div>
            <div className="recessed-well p-3.5 rounded-2xl border border-[#1F2736]">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Approved Pledges</div>
              <div className="text-lg font-mono font-black text-[#F0F6FC]">{approvedCount} Records</div>
            </div>
            <div className="recessed-well p-3.5 rounded-2xl border border-[#1F2736]">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Total Submissions</div>
              <div className="text-lg font-mono font-black text-[#8B949E]">{state.txids.length}</div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mb-4">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTxidFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  txidFilter === tab
                    ? 'btn-gold-capsule text-[11px]'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table in Recessed Container */}
          <div className="overflow-x-auto rounded-2xl border border-[#1F2736] bg-[#070A0E]">
            <table className="w-full text-left text-xs text-[#8B949E]">
              <thead className="bg-[#0E131A] text-[#F0F6FC] font-semibold border-b border-[#1F2736]">
                <tr>
                  <th className="p-3.5">User Wallet</th>
                  <th className="p-3.5">Network</th>
                  <th className="p-3.5">Amount (USDT)</th>
                  <th className="p-3.5">TXID Hash</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2736]">
                {filteredTxids.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[#8B949E]">
                      No deposit records in this category.
                    </td>
                  </tr>
                ) : (
                  filteredTxids.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#131822]/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#F0F6FC]">{tx.userWallet}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#131822] text-[#58A6FF] font-mono text-[11px] border border-[#2C3547]">
                          {tx.network}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-black text-[#F5A623]">${tx.amountUsdt.toLocaleString()}</td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#8B949E] truncate max-w-[130px]">{tx.txid}</span>
                          <button
                            onClick={() => handleCopy(tx.txid, tx.id)}
                            className="text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
                          >
                            {copiedTxid === tx.id ? <Check className="w-3 h-3 text-[#238636]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-[11px] text-[#8B949E]">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            tx.status === 'approved'
                              ? 'bg-[#238636]/15 text-[#238636] border-[#238636]/40'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                              : 'bg-red-500/15 text-red-400 border-red-500/40'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleTxidAction(tx.id, 'approve')}
                              className="btn-gold-capsule px-3 py-1 text-[11px] uppercase tracking-wider cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleTxidAction(tx.id, 'reject', 'Manual rejection by admin')}
                              className="px-3 py-1 rounded-full bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-[11px] uppercase transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8B949E] italic">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. APK VERSIONING & RELEASE CONTROL */}
        <section className="aurium-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2736]">
            <div>
              <h2 className="text-lg font-black text-[#F0F6FC] font-sans flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#F5A623]" />
                <span>Direct APK Versioning & Release Controller</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Update the official downloadable Android release. Changes reflect instantly on the public landing page hero and download modal.
              </p>
            </div>
            {apkSaved && (
              <span className="text-xs text-[#238636] font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                RELEASE DEPLOYED!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveApk} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  Latest App Version *
                </label>
                <input
                  type="text"
                  value={apkVersion}
                  onChange={(e) => setApkVersion(e.target.value)}
                  placeholder="v1.0.2"
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  Package File Size *
                </label>
                <input
                  type="text"
                  value={apkSize}
                  onChange={(e) => setApkSize(e.target.value)}
                  placeholder="18.4 MB"
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                Direct APK Download URL *
              </label>
              <input
                type="text"
                value={apkUrl}
                onChange={(e) => setApkUrl(e.target.value)}
                placeholder="https://cdn.aurium.network/builds/aurium-light-validator-v1.0.2.apk"
                required
                className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                Official SHA-256 Checksum Hash *
              </label>
              <input
                type="text"
                value={apkSha256}
                onChange={(e) => setApkSha256(e.target.value)}
                placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                required
                className="w-full px-4 py-2.5 rounded-full bg-[#070A0E] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="btn-gold-capsule py-2.5 px-6 text-xs uppercase tracking-wider cursor-pointer"
              >
                Save & Deploy APK Update
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
