export type NetworkChain = 'BEP-20' | 'TRC-20' | 'ERC-20';

export type PresaleRoundId = 'round_1' | 'round_2' | 'round_3';

export interface PresaleRoundConfig {
  id: PresaleRoundId;
  name: string;
  shortName: string;
  badgeLabel: string;
  priceUsdt: number;
  totalAllocation: number;
  targetCapUsdt: number;
  raisedUsdt: number;
  progressPercent: number;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
}

export interface TxidDeposit {
  id: string;
  userWallet: string;
  network: NetworkChain;
  amountUsdt: number;
  txid: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
  proofImageBase64?: string;
  round?: string;
}

export interface HalvingRecord {
  id: string;
  timestamp: string;
  previousYield: number;
  newYield: number;
  blockHeight: number;
}

export interface AuriumState {
  network: {
    isOnline: boolean;
    activeNodes: number;
    blockHeight: number;
    baseDailyYield: number;
    networkLatencyMs: number;
    tps: number;
  };
  deposits: {
    enabled: boolean;
    chains: {
      bep20: boolean;
      erc20: boolean;
      trc20: boolean;
    };
  };
  presale: {
    enabled: boolean;
    activeRoundId: PresaleRoundId;
    status: 'active' | 'paused' | 'coming_soon';
    notificationBanner?: string;
    rounds: Record<PresaleRoundId, PresaleRoundConfig>;
    // Main active round projection:
    round: string;
    progressPercent: number;
    totalAllocation: number;
    raisedUsdt: number;
    minDepositUsdt: number;
    rateUsdtPerAuri: number;
  };
  withdrawals: {
    enabled: boolean;
    minWithdrawalAuri: number;
  };
  p2pTransfers: {
    enabled: boolean;
  };
  halving: {
    nextHalvingDate: string;
    currentEra: number;
    totalHalvingsTriggered: number;
    halvingHistory: HalvingRecord[];
  };
  depositAddresses: {
    bep20: string;
    trc20: string;
    erc20: string;
  };
  apk: {
    version: string;
    downloadUrl: string;
    fileSize: string;
    sha256: string;
    releaseDate: string;
    minAndroidVersion: string;
  };
  txids: TxidDeposit[];
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PartialAuriumState = DeepPartial<AuriumState>;
