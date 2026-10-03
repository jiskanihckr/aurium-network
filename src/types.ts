export type NetworkChain = 'BEP-20' | 'TRC-20' | 'ERC-20';

export interface TxidDeposit {
  id: string;
  userWallet: string;
  network: NetworkChain;
  amountUsdt: number;
  txid: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
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
    round: 'Round 1' | 'Round 2';
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
