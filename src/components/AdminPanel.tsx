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
  AlertTriangle,
  ArrowLeft,
  Flame,
  Layers,
  Coins,
  Clock,
  FileText,
  Upload,
  Image as ImageIcon,
  CheckCheck,
  XCircle,
  Eye,
  Sliders,
  DollarSign,
  Radio,
} from 'lucide-react';
import {
  AuriumState,
  NetworkChain,
  PartialAuriumState,
  PresaleRoundId,
  PresaleRoundConfig,
} from '../types';
import { AuriumLogo } from './AuriumLogo';

interface AdminPanelProps {
  state: AuriumState;
  onBackToPublic: () => void;
  updateToggles: (partial: PartialAuriumState) => Promise<void>;
  updatePresaleConfig: (config: {
    activeRoundId?: PresaleRoundId;
    status?: 'active' | 'paused' | 'coming_soon';
    notificationBanner?: string;
    rounds?: Record<PresaleRoundId, PresaleRoundConfig>;
    minDepositUsdt?: number;
    enabled?: boolean;
  }) => Promise<void>;
  updateAddresses: (addresses: { bep20?: string; trc20?: string; erc20?: string }) => Promise<void>;
  updateApk: (apkData: Partial<AuriumState['apk']>) => Promise<void>;
  triggerHalvingCut: () => Promise<void>;
  updateHalvingParams: (params: {
    baseDailyYield?: number;
    currentEra?: number;
    nextHalvingDate?: string;
  }) => Promise<void>;
  updateHalvingDate: (dateIso: string) => Promise<void>;
  handleTxidAction: (id: string, action: 'approve' | 'reject', note?: string) => Promise<void>;
  submitDepositTxid: (data: {
    userWallet: string;
    network: NetworkChain;
    amountUsdt: number;
    txid: string;
    note?: string;
    proofImageBase64?: string;
    round?: string;
  }) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isConnected: boolean;
  lastSyncTime: Date;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  state,
  onBackToPublic,
  updateToggles,
  updatePresaleConfig,
  updateAddresses,
  updateApk,
  triggerHalvingCut,
  updateHalvingParams,
  handleTxidAction,
  resetToDefaults,
  isConnected,
  lastSyncTime,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'presale' | 'queue' | 'halving' | 'toggles' | 'wallets'>('presale');

  // --- Presale Management State ---
  const [activeRoundId, setActiveRoundId] = useState<PresaleRoundId>(state.presale.activeRoundId || 'round_1');
  const [presaleStatus, setPresaleStatus] = useState<'active' | 'paused' | 'coming_soon'>(state.presale.status || 'active');
  const [notificationBanner, setNotificationBanner] = useState<string>(
    state.presale.notificationBanner || 'Round 1 Active: Allocation 75% subscribed. Seed tier unlocks validator privileges.'
  );
  const [minDepositInput, setMinDepositInput] = useState<string>(String(state.presale.minDepositUsdt));

  // Local round configurations initialized from state
  const initialRounds = state.presale.rounds || {
    round_1: {
      id: 'round_1',
      name: 'Round 1 (Seed / Early Validator)',
      shortName: 'Round 1',
      badgeLabel: 'SEED / EARLY VALIDATOR',
      priceUsdt: 0.05,
      totalAllocation: 10000000,
      targetCapUsdt: 500000,
      raisedUsdt: 375000,
      progressPercent: 75,
      status: 'active',
    },
    round_2: {
      id: 'round_2',
      name: 'Round 2 (Strategic Private)',
      shortName: 'Round 2',
      badgeLabel: 'STRATEGIC PRIVATE',
      priceUsdt: 0.08,
      totalAllocation: 15000000,
      targetCapUsdt: 1200000,
      raisedUsdt: 0,
      progressPercent: 0,
      status: 'upcoming',
    },
    round_3: {
      id: 'round_3',
      name: 'Round 3 (Public Pre-Listing)',
      shortName: 'Round 3',
      badgeLabel: 'PUBLIC PRE-LISTING',
      priceUsdt: 0.12,
      totalAllocation: 25000000,
      targetCapUsdt: 3000000,
      raisedUsdt: 0,
      progressPercent: 0,
      status: 'upcoming',
    },
  };

  const [roundsConfig, setRoundsConfig] = useState<Record<PresaleRoundId, PresaleRoundConfig>>(initialRounds);

  // --- Halving Overrides State ---
  const [baseYieldInput, setBaseYieldInput] = useState<string>(String(state.network.baseDailyYield));
  const [currentEraInput, setCurrentEraInput] = useState<string>(String(state.halving.currentEra));
  const [halvingDateInput, setHalvingDateInput] = useState<string>(() => {
    try {
      const d = new Date(state.halving.nextHalvingDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });
  const [showHalvingConfirmModal, setShowHalvingConfirmModal] = useState(false);
  const [isHalvingLoading, setIsHalvingLoading] = useState(false);

  // --- Wallet Addresses & APK State ---
  const [bep20Address, setBep20Address] = useState(state.depositAddresses.bep20);
  const [trc20Address, setTrc20Address] = useState(state.depositAddresses.trc20);
  const [erc20Address, setErc20Address] = useState(state.depositAddresses.erc20);
  const [apkVersion, setApkVersion] = useState(state.apk.version);
  const [apkUrl, setApkUrl] = useState(state.apk.downloadUrl);
  const [apkSize, setApkSize] = useState(state.apk.fileSize);
  const [apkSha256, setApkSha256] = useState(state.apk.sha256);

  // --- TXID Queue State ---
  const [txidFilter, setTxidFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [previewProofImage, setPreviewProofImage] = useState<string | null>(null);
  const [copiedTxid, setCopiedTxid] = useState<string | null>(null);

  // Toast notification
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

  // Save 3-Round Presale Settings
  const handleSavePresaleConfig = async () => {
    await updatePresaleConfig({
      activeRoundId,
      status: presaleStatus,
      notificationBanner,
      minDepositUsdt: Number(minDepositInput) || 50,
      rounds: roundsConfig,
    });
    showToast('Presale configuration and multi-round rates synchronized!');
  };

  // Save Manual Halving & Emission Overrides
  const handleSaveHalvingOverrides = async () => {
    const yieldNum = Number(baseYieldInput);
    const eraNum = Number(currentEraInput);
    const isoDate = halvingDateInput ? new Date(halvingDateInput).toISOString() : undefined;

    await updateHalvingParams({
      baseDailyYield: isNaN(yieldNum) ? undefined : yieldNum,
      currentEra: isNaN(eraNum) ? undefined : eraNum,
      nextHalvingDate: isoDate,
    });
    showToast('Manual halving timelock and emission rates updated!');
  };

  // Execute Instant Halving Override
  const handleExecuteInstantHalving = async () => {
    setIsHalvingLoading(true);
    await triggerHalvingCut();
    setIsHalvingLoading(false);
    setShowHalvingConfirmModal(false);
    showToast('Instant halving executed! Base emission halved and Era advanced.');
  };

  // Save Addresses
  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAddresses({
      bep20: bep20Address,
      trc20: trc20Address,
      erc20: erc20Address,
    });
    showToast('Deposit addresses updated across network!');
  };

  // Save APK
  const handleSaveApk = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateApk({
      version: apkVersion,
      downloadUrl: apkUrl,
      fileSize: apkSize,
      sha256: apkSha256,
    });
    showToast('APK release information updated!');
  };

  // Filtered TXIDs
  const filteredTxids = state.txids.filter((item) => {
    if (txidFilter === 'all') return true;
    return item.status === txidFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#090C10] border border-[#F5A623] text-[#F0F6FC] text-xs font-semibold shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#238636] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Protocol Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1F2736]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl recessed-well border border-[#21262D] flex items-center justify-center text-[#F5A623] shrink-0">
            <Shield className="w-6 h-6 text-[#F5A623] drop-shadow-[0_0_10px_rgba(245,166,35,0.7)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F5A623] font-bold">
                ENCRYPTED PROTOCOL CONSOLE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F0F6FC] font-sans tracking-tight">
              Aurium Network Master Governance
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-full recessed-well border border-[#21262D] text-[11px] font-mono text-[#8B949E] hidden lg:flex items-center gap-2">
            <span>SYNC: {lastSyncTime.toLocaleTimeString()}</span>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#238636]' : 'bg-amber-400 animate-pulse'}`} />
          </div>

          <button
            onClick={resetToDefaults}
            className="btn-dark-capsule px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer text-[#8B949E] hover:text-[#F0F6FC]"
            title="Reset simulation state to genesis defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F5A623]" />
            <span className="hidden sm:inline">RESET STATE</span>
          </button>

          <button
            onClick={onBackToPublic}
            className="btn-gold-capsule px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#070A0E]" />
            <span>EXIT ADMIN</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 recessed-well rounded-2xl border border-[#21262D]">
        <button
          onClick={() => setActiveTab('presale')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'presale' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Presale Management</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'queue' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>TXID Review Queue</span>
          {state.txids.filter((t) => t.status === 'pending').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
              {state.txids.filter((t) => t.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('halving')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'halving' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Halving & Emissions</span>
        </button>

        <button
          onClick={() => setActiveTab('toggles')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'toggles' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>Master Toggles</span>
        </button>

        <button
          onClick={() => setActiveTab('wallets')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'wallets' ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallets & APK</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 3-ROUND STRATEGIC PRESALE SYSTEM MANAGEMENT         */}
      {/* ========================================================= */}
      {activeTab === 'presale' && (
        <div className="space-y-6">
          {/* Active Round Switcher & Global Status Banner */}
          <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1F2736]">
              <div>
                <h2 className="text-lg font-bold text-[#F0F6FC] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#F5A623]" />
                  <span>3-Round Presale Control Matrix</span>
                </h2>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Configure price per round, target hard-caps, token allocations, and active round switchers.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8B949E] uppercase font-semibold">Gateway Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono ${
                    presaleStatus === 'active'
                      ? 'bg-[#238636]/15 text-[#238636] border border-[#238636]/40'
                      : presaleStatus === 'coming_soon'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/15 text-red-400 border border-red-500/40'
                  }`}
                >
                  {presaleStatus}
                </span>
              </div>
            </div>

            {/* Quick Action Matrix: Select Active Round & Global Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Round Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E] mb-2">
                  Active Round Switcher
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['round_1', 'round_2', 'round_3'] as PresaleRoundId[]).map((rId) => {
                    const r = roundsConfig[rId];
                    const isSelected = activeRoundId === rId;
                    return (
                      <button
                        key={rId}
                        type="button"
                        onClick={() => setActiveRoundId(rId)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'recessed-well border-[#F5A623] bg-[#F5A623]/10 shadow-[0_0_15px_rgba(245,166,35,0.15)]'
                            : 'recessed-well border-[#21262D] hover:border-[#2C3547]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={`font-bold ${isSelected ? 'text-[#F5A623]' : 'text-[#F0F6FC]'}`}>
                            {r.shortName}
                          </span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />}
                        </div>
                        <div className="text-[11px] font-mono text-[#58A6FF]">${r.priceUsdt} / AURI</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Presale Status Override */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E] mb-2">
                  Presale Status Toggle
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresaleStatus('active')}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      presaleStatus === 'active'
                        ? 'bg-[#238636]/20 text-[#238636] border-[#238636]'
                        : 'recessed-well border-[#21262D] text-[#8B949E]'
                    }`}
                  >
                    <span>ACTIVE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresaleStatus('coming_soon')}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      presaleStatus === 'coming_soon'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                        : 'recessed-well border-[#21262D] text-[#8B949E]'
                    }`}
                  >
                    <span>COMING SOON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresaleStatus('paused')}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      presaleStatus === 'paused'
                        ? 'bg-red-500/20 text-red-400 border-red-500'
                        : 'recessed-well border-[#21262D] text-[#8B949E]'
                    }`}
                  >
                    <span>PAUSED</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Banner Customizer */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E] mb-2">
                Active Notification Banner (Displayed above presale progress)
              </label>
              <input
                type="text"
                value={notificationBanner}
                onChange={(e) => setNotificationBanner(e.target.value)}
                placeholder="e.g. Round 2 starts soon — Stay tuned for announcements"
                className="w-full px-4 py-3 rounded-2xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] text-xs font-medium focus:outline-none focus:border-[#F5A623]"
              />
            </div>
          </div>

          {/* Individual Round Parameters: Round 1, Round 2, Round 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(['round_1', 'round_2', 'round_3'] as PresaleRoundId[]).map((rId) => {
              const r = roundsConfig[rId];
              const isCurrent = activeRoundId === rId;

              return (
                <div
                  key={rId}
                  className={`aurium-card rounded-3xl p-5 sm:p-6 border relative transition-all ${
                    isCurrent ? 'border-[#F5A623]/60 shadow-[0_0_20px_rgba(245,166,35,0.1)]' : 'border-[#21262D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                        {r.badgeLabel}
                      </div>
                      <h3 className="text-base font-bold text-[#F0F6FC]">{r.name}</h3>
                    </div>
                    {isCurrent && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40 font-mono">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold mb-1">
                        Token Price (USDT / AURI)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-[#8B949E]">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={r.priceUsdt}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRoundsConfig((prev) => ({
                              ...prev,
                              [rId]: { ...prev[rId], priceUsdt: val },
                            }));
                          }}
                          className="w-full pl-8 pr-4 py-2 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold mb-1">
                        Total Allocation (AURI)
                      </label>
                      <input
                        type="number"
                        step="100000"
                        value={r.totalAllocation}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRoundsConfig((prev) => ({
                            ...prev,
                            [rId]: { ...prev[rId], totalAllocation: val },
                          }));
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold mb-1">
                        Target Cap (USDT)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-[#8B949E]">$</span>
                        <input
                          type="number"
                          step="10000"
                          value={r.targetCapUsdt}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRoundsConfig((prev) => ({
                              ...prev,
                              [rId]: { ...prev[rId], targetCapUsdt: val },
                            }));
                          }}
                          className="w-full pl-8 pr-4 py-2 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold mb-1">
                        Round Status
                      </label>
                      <select
                        value={r.status}
                        onChange={(e) => {
                          const val = e.target.value as PresaleRoundConfig['status'];
                          setRoundsConfig((prev) => ({
                            ...prev,
                            [rId]: { ...prev[rId], status: val },
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] text-xs focus:outline-none focus:border-[#F5A623]"
                      >
                        <option value="active">Active</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-xl recessed-well text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Raised:</span>
                        <span className="text-[#F0F6FC]">${r.raisedUsdt.toLocaleString()} USDT</span>
                      </div>
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Progress:</span>
                        <span className="text-[#F5A623]">{r.progressPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save All Presale Settings Bar */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSavePresaleConfig}
              className="btn-gold-capsule px-8 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold shadow-lg"
            >
              <Check className="w-4 h-4 text-[#070A0E]" />
              <span>SAVE & BROADCAST PRESALE CONFIGURATION</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TRANSACTION REVIEW QUEUE (WITH PROOF SCREENSHOTS) */}
      {/* ========================================================= */}
      {activeTab === 'queue' && (
        <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1F2736]">
            <div>
              <h2 className="text-lg font-bold text-[#F0F6FC] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F5A623]" />
                <span>Transaction Review & Allocation Queue</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Review submitted blockchain deposit hashes, inspect attached transfer screenshots, and credit AURI balances.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 recessed-well rounded-xl border border-[#21262D]">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTxidFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    txidFilter === filter ? 'btn-gold-capsule' : 'text-[#8B949E] hover:text-[#F0F6FC]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Table */}
          {filteredTxids.length === 0 ? (
            <div className="p-12 text-center text-[#8B949E] text-xs">
              No deposit records found in this category.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1F2736] text-[#8B949E] text-[10px] uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Wallet / User</th>
                    <th className="pb-3 px-3">Network & Round</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">TXID Hash</th>
                    <th className="pb-3 px-3">Proof Screenshot</th>
                    <th className="pb-3 px-3">Timestamp</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2736]/60">
                  {filteredTxids.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#12161A] transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                            tx.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : tx.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-medium text-[#F0F6FC]">{tx.userWallet}</td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-[11px] text-[#58A6FF]">{tx.network}</div>
                        <div className="text-[10px] text-[#8B949E]">{tx.round || 'Round 1'}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-[#F5A623]">${tx.amountUsdt} USDT</div>
                        <div className="text-[10px] text-[#8B949E]">
                          ~{Math.floor(tx.amountUsdt / state.presale.rateUsdtPerAuri).toLocaleString()} AURI
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-[#8B949E]">
                          <span>{tx.txid.substring(0, 10)}...{tx.txid.substring(tx.txid.length - 6)}</span>
                          <button
                            onClick={() => handleCopy(tx.txid, tx.id)}
                            className="p-1 hover:text-[#F0F6FC] cursor-pointer"
                            title="Copy full TXID"
                          >
                            {copiedTxid === tx.id ? <Check className="w-3 h-3 text-[#238636]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {tx.proofImageBase64 ? (
                          <button
                            onClick={() => setPreviewProofImage(tx.proofImageBase64 || null)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#58A6FF]/10 text-[#58A6FF] hover:bg-[#58A6FF]/20 transition-colors text-[11px] cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-600 italic">No file attached</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-[#8B949E]">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTxidAction(tx.id, 'approve', 'Approved by administrator')}
                              className="px-2.5 py-1 rounded-lg bg-[#238636] hover:bg-emerald-600 text-black font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Approve & Credit</span>
                            </button>
                            <button
                              onClick={() => handleTxidAction(tx.id, 'reject', 'Rejected by administrator')}
                              className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8B949E] capitalize font-mono">{tx.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Proof Preview Modal */}
      {previewProofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
          <div className="aurium-card rounded-3xl max-w-xl w-full p-6 border border-[#21262D] relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2736]">
              <div className="text-sm font-bold text-[#F0F6FC] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F5A623]" />
                <span>Deposit Transfer Verification Proof</span>
              </div>
              <button
                onClick={() => setPreviewProofImage(null)}
                className="w-8 h-8 rounded-full recessed-well flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#1F2736] max-h-[70vh] flex items-center justify-center bg-black">
              <img src={previewProofImage} alt="Deposit Proof" className="max-h-[68vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MANUAL HALVING TIMELOCK & EMISSION CONTROL         */}
      {/* ========================================================= */}
      {activeTab === 'halving' && (
        <div className="space-y-6">
          <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-6">
            <div className="pb-5 border-b border-[#1F2736]">
              <h2 className="text-lg font-bold text-[#F0F6FC] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#F5A623]" />
                <span>Manual Halving Timelock & Emission Engine</span>
              </h2>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Manually control the base daily emission rate, define the algorithmic Era, and adjust the target countdown timestamp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Base Emission Rate Override */}
              <div className="recessed-well rounded-2xl p-5 border border-[#21262D] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E]">
                  Base Daily Emission Yield
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    value={baseYieldInput}
                    onChange={(e) => setBaseYieldInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F5A623] font-mono font-bold text-sm focus:outline-none focus:border-[#F5A623]"
                  />
                  <span className="absolute right-4 top-3 text-xs text-[#8B949E] font-sans">AURI/day</span>
                </div>
                <p className="text-[11px] text-[#8B949E]">
                  Current live baseline: <strong>+{state.network.baseDailyYield} AURI/day</strong> per validator.
                </p>
              </div>

              {/* 2. Halving Era Override */}
              <div className="recessed-well rounded-2xl p-5 border border-[#21262D] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E]">
                  Halving Era Index
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={currentEraInput}
                  onChange={(e) => setCurrentEraInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono font-bold text-sm focus:outline-none focus:border-[#F5A623]"
                />
                <p className="text-[11px] text-[#8B949E]">
                  Active protocol epoch: <strong>Era {state.halving.currentEra}</strong>
                </p>
              </div>

              {/* 3. Next Halving Target Timestamp */}
              <div className="recessed-well rounded-2xl p-5 border border-[#21262D] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B949E]">
                  Next Halving Target Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={halvingDateInput}
                  onChange={(e) => setHalvingDateInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
                <p className="text-[11px] text-[#8B949E]">
                  Directly controls the Circular Halving countdown gauge on the landing page.
                </p>
              </div>
            </div>

            {/* Save Manual Parameters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1F2736]">
              <div className="text-xs text-[#8B949E]">
                Total Halvings Triggered to Date: <span className="font-mono text-[#F0F6FC] font-bold">{state.halving.totalHalvingsTriggered}</span>
              </div>
              <button
                onClick={handleSaveHalvingOverrides}
                className="btn-gold-capsule px-6 py-3 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold"
              >
                <Check className="w-4 h-4 text-[#070A0E]" />
                <span>SAVE EMISSION OVERRIDES & TIMELOCK</span>
              </button>
            </div>
          </div>

          {/* Emergency Instant Halving Cut Card */}
          <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-red-500/30 bg-red-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-200">Emergency Instant Halving Cut (-50%)</h3>
                <p className="text-xs text-[#8B949E]">
                  Instantly slices current yield ({state.network.baseDailyYield} → {(state.network.baseDailyYield / 2).toFixed(2)} AURI/d) and advances to Era {state.halving.currentEra + 1}.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowHalvingConfirmModal(true)}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/50"
              >
                <Scissors className="w-4 h-4" />
                <span>EXECUTE INSTANT HALVING</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Halving Confirmation Modal */}
      {showHalvingConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
          <div className="aurium-card rounded-3xl max-w-md w-full p-6 sm:p-8 border border-red-500/40 relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-[#F0F6FC]">Confirm Instant Halving</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Are you sure you want to execute an instant 50% halving cut? This will immediately reduce the base daily emission from{' '}
                <strong className="text-[#F5A623]">+{state.network.baseDailyYield.toFixed(2)} AURI/d</strong> to{' '}
                <strong className="text-[#F5A623]">+{ (state.network.baseDailyYield / 2).toFixed(2) } AURI/d</strong> and advance Era to{' '}
                <strong className="text-[#F0F6FC]">Era {state.halving.currentEra + 1}</strong> across all connected validator nodes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => setShowHalvingConfirmModal(false)}
                className="btn-dark-capsule py-3 text-xs uppercase font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleExecuteInstantHalving}
                disabled={isHalvingLoading}
                className="py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase cursor-pointer"
              >
                {isHalvingLoading ? 'EXECUTING...' : 'CONFIRM & EXECUTE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MASTER KILL-SWITCHES & PROTOCOL TOGGLES            */}
      {/* ========================================================= */}
      {activeTab === 'toggles' && (
        <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-6">
          <div className="pb-5 border-b border-[#1F2736]">
            <h2 className="text-lg font-bold text-[#F0F6FC] flex items-center gap-2">
              <Power className="w-5 h-5 text-[#F5A623]" />
              <span>Master Protocol Kill-Switches</span>
            </h2>
            <p className="text-xs text-[#8B949E] mt-0.5">
              Instantly toggle core consensus, deposit gates, presale portals, and withdrawal layers in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Node Network Master Switch */}
            <div className="recessed-well rounded-2xl p-5 border border-[#21262D] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#F0F6FC]">Node Network Consensus</div>
                <div className="text-xs text-[#8B949E] mt-0.5">
                  Controls live block validation across all {state.network.activeNodes.toLocaleString()} nodes.
                </div>
              </div>
              <button
                onClick={() => updateToggles({ network: { isOnline: !state.network.isOnline } })}
                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                  state.network.isOnline ? 'bg-[#238636]' : 'bg-[#1F2736]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                    state.network.isOnline ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* 2. Presale Gateway */}
            <div className="recessed-well rounded-2xl p-5 border border-[#21262D] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#F0F6FC]">Strategic Presale Gateway</div>
                <div className="text-xs text-[#8B949E] mt-0.5">
                  Allows public participants to purchase presale allocation quotas.
                </div>
              </div>
              <button
                onClick={() => updateToggles({ presale: { enabled: !state.presale.enabled } })}
                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                  state.presale.enabled ? 'bg-[#238636]' : 'bg-[#1F2736]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                    state.presale.enabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* 3. Deposits Gateway */}
            <div className="recessed-well rounded-2xl p-5 border border-[#21262D] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#F0F6FC]">USDT Deposits Master Switch</div>
                <div className="text-xs text-[#8B949E] mt-0.5">
                  Enables/disables all incoming blockchain deposit listening.
                </div>
              </div>
              <button
                onClick={() => updateToggles({ deposits: { enabled: !state.deposits.enabled } })}
                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                  state.deposits.enabled ? 'bg-[#238636]' : 'bg-[#1F2736]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                    state.deposits.enabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* 4. Withdrawals Gateway */}
            <div className="recessed-well rounded-2xl p-5 border border-[#21262D] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#F0F6FC]">Node Earnings Withdrawals</div>
                <div className="text-xs text-[#8B949E] mt-0.5">
                  Governs outward payout processing for node validators.
                </div>
              </div>
              <button
                onClick={() => updateToggles({ withdrawals: { enabled: !state.withdrawals.enabled } })}
                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                  state.withdrawals.enabled ? 'bg-[#238636]' : 'bg-[#1F2736]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                    state.withdrawals.enabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: DEPOSIT ADDRESSES & SIGNED APK RELEASE             */}
      {/* ========================================================= */}
      {activeTab === 'wallets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Address Configuration */}
          <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-5">
            <div className="pb-4 border-b border-[#1F2736]">
              <h3 className="text-base font-bold text-[#F0F6FC] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#F5A623]" />
                <span>Protocol Cold Receiving Addresses</span>
              </h3>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Official destination addresses shown on the public presale and deposit gateway.
              </p>
            </div>

            <form onSubmit={handleSaveAddresses} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  BEP-20 (BNB Smart Chain)
                </label>
                <input
                  type="text"
                  value={bep20Address}
                  onChange={(e) => setBep20Address(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  TRC-20 (TRON Network)
                </label>
                <input
                  type="text"
                  value={trc20Address}
                  onChange={(e) => setTrc20Address(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  ERC-20 (Ethereum Mainnet)
                </label>
                <input
                  type="text"
                  value={erc20Address}
                  onChange={(e) => setErc20Address(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <button
                type="submit"
                className="btn-gold-capsule w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <Check className="w-4 h-4 text-[#070A0E]" />
                <span>SAVE RECEIVING ADDRESSES</span>
              </button>
            </form>
          </div>

          {/* Signed APK Build Management */}
          <div className="aurium-card rounded-3xl p-6 sm:p-8 border border-[#21262D] space-y-5">
            <div className="pb-4 border-b border-[#1F2736]">
              <h3 className="text-base font-bold text-[#F0F6FC] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#58A6FF]" />
                <span>Signed Android APK Build Release</span>
              </h3>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Manage the live downloadable binary parameters and cryptographic checksum.
              </p>
            </div>

            <form onSubmit={handleSaveApk} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                    Build Version
                  </label>
                  <input
                    type="text"
                    value={apkVersion}
                    onChange={(e) => setApkVersion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={apkSize}
                    onChange={(e) => setApkSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  Direct Download URL
                </label>
                <input
                  type="text"
                  value={apkUrl}
                  onChange={(e) => setApkUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8B949E] uppercase tracking-wider mb-1.5">
                  SHA-256 Binary Checksum
                </label>
                <input
                  type="text"
                  value={apkSha256}
                  onChange={(e) => setApkSha256(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C10] border border-[#2C3547] text-[#F0F6FC] font-mono text-xs focus:outline-none focus:border-[#F5A623]"
                />
              </div>

              <button
                type="submit"
                className="btn-gold-capsule w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <Check className="w-4 h-4 text-[#070A0E]" />
                <span>SAVE APK RELEASE SETTINGS</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
