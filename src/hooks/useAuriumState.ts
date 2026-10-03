import { useState, useEffect, useCallback, useRef } from 'react';
import { AuriumState, TxidDeposit, NetworkChain, PartialAuriumState } from '../types';
import { defaultAuriumState } from '../data/initialState';

const LOCAL_STORAGE_KEY = 'aurium_network_state_v1';
const BROADCAST_CHANNEL_NAME = 'aurium_state_broadcast_channel';

export function useAuriumState() {
  const [state, setState] = useState<AuriumState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return defaultAuriumState;
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Sync to localStorage
  const saveStateToLocal = useCallback((newState: AuriumState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  // Update state locally and broadcast to other tabs
  const updateStateInternal = useCallback((newState: AuriumState) => {
    setState(newState);
    saveStateToLocal(newState);
    setLastSyncTime(new Date());

    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: newState });
    }
  }, [saveStateToLocal]);

  // Connect to SSE stream and REST API
  useEffect(() => {
    // Setup BroadcastChannel for instantaneous multi-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_BROADCAST' && event.data.state) {
          setState(event.data.state);
          setLastSyncTime(new Date());
        }
      };
    }

    // Fetch initial state from server
    fetch('/api/state')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch initial state');
      })
      .then((data: AuriumState) => {
        if (data && data.network) {
          updateStateInternal(data);
          setIsConnected(true);
        }
      })
      .catch((err) => {
        console.warn('Falling back to local state sync:', err.message);
      });

    // Setup SSE connection
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.state) {
            setState(payload.state);
            saveStateToLocal(payload.state);
            setLastSyncTime(new Date());
            setIsConnected(true);
          }
        } catch (err) {
          console.error('Error parsing SSE payload:', err);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('SSE not supported or failed to initialize', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [saveStateToLocal, updateStateInternal]);

  // API Mutators
  const updateToggles = useCallback(async (partialState: PartialAuriumState) => {
    // Optimistic local update
    setState((prev) => {
      const updated: AuriumState = {
        ...prev,
        network: partialState.network ? { ...prev.network, ...partialState.network } : prev.network,
        deposits: partialState.deposits
          ? {
              ...prev.deposits,
              ...(partialState.deposits.enabled !== undefined ? { enabled: partialState.deposits.enabled } : {}),
              chains: partialState.deposits.chains
                ? { ...prev.deposits.chains, ...partialState.deposits.chains }
                : prev.deposits.chains,
            }
          : prev.deposits,
        presale: partialState.presale ? { ...prev.presale, ...partialState.presale } : prev.presale,
        withdrawals: partialState.withdrawals ? { ...prev.withdrawals, ...partialState.withdrawals } : prev.withdrawals,
        p2pTransfers: partialState.p2pTransfers ? { ...prev.p2pTransfers, ...partialState.p2pTransfers } : prev.p2pTransfers,
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/toggles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialState),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('Network toggle API call failed, kept locally', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const updateAddresses = useCallback(async (addresses: { bep20?: string; trc20?: string; erc20?: string }) => {
    setState((prev) => {
      const updated: AuriumState = {
        ...prev,
        depositAddresses: {
          ...prev.depositAddresses,
          ...addresses,
        },
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addresses),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('Address update API call failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const updateApk = useCallback(async (apkData: Partial<AuriumState['apk']>) => {
    setState((prev) => {
      const updated: AuriumState = {
        ...prev,
        apk: {
          ...prev.apk,
          ...apkData,
        },
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/apk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apkData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('APK update API call failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const triggerHalvingCut = useCallback(async () => {
    // 50% cut calculation
    setState((prev) => {
      const prevYield = prev.network.baseDailyYield;
      const newYield = Number((prevYield / 2).toFixed(4));
      const newNextDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      const updated: AuriumState = {
        ...prev,
        network: {
          ...prev.network,
          baseDailyYield: newYield,
          blockHeight: prev.network.blockHeight + 12840,
        },
        halving: {
          ...prev.halving,
          currentEra: prev.halving.currentEra + 1,
          totalHalvingsTriggered: prev.halving.totalHalvingsTriggered + 1,
          nextHalvingDate: newNextDate,
          halvingHistory: [
            {
              id: `halv-${Date.now()}`,
              timestamp: new Date().toISOString(),
              previousYield: prevYield,
              newYield: newYield,
              blockHeight: prev.network.blockHeight + 12840,
            },
            ...prev.halving.halvingHistory,
          ],
        },
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/halving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_50' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('Halving cut API call failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const updateHalvingDate = useCallback(async (dateIso: string) => {
    setState((prev) => {
      const updated: AuriumState = {
        ...prev,
        halving: {
          ...prev.halving,
          nextHalvingDate: dateIso,
        },
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/halving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextHalvingDate: dateIso }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('Halving date update failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const handleTxidAction = useCallback(async (id: string, action: 'approve' | 'reject', note?: string) => {
    const finalStatus: 'approved' | 'rejected' = action === 'approve' ? 'approved' : 'rejected';

    setState((prev) => {
      const updatedTxids: TxidDeposit[] = prev.txids.map((item) => {
        if (item.id === id) {
          return { ...item, status: finalStatus, note: note || item.note };
        }
        return item;
      });

      const matched = prev.txids.find((t) => t.id === id);
      const additionalRaised = action === 'approve' && matched ? matched.amountUsdt : 0;
      const additionalNodes = action === 'approve' && matched ? Math.floor(matched.amountUsdt / 10) : 0;

      const updated: AuriumState = {
        ...prev,
        presale: {
          ...prev.presale,
          raisedUsdt: prev.presale.raisedUsdt + additionalRaised,
        },
        network: {
          ...prev.network,
          activeNodes: prev.network.activeNodes + additionalNodes,
        },
        txids: updatedTxids,
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/admin/txid-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, note }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('TXID action API call failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const submitDepositTxid = useCallback(async (data: {
    userWallet: string;
    network: NetworkChain;
    amountUsdt: number;
    txid: string;
    note?: string;
  }) => {
    const newTxid: TxidDeposit = {
      id: `tx-${Date.now()}`,
      userWallet: data.userWallet,
      network: data.network,
      amountUsdt: data.amountUsdt,
      txid: data.txid,
      timestamp: new Date().toISOString(),
      status: 'pending',
      note: data.note || 'Public presale portal deposit',
    };

    setState((prev) => {
      const updated: AuriumState = {
        ...prev,
        txids: [newTxid, ...prev.txids],
      };
      saveStateToLocal(updated);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: updated });
      }
      return updated;
    });

    try {
      const res = await fetch('/api/user/submit-txid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.state) updateStateInternal(resData.state);
      }
    } catch (e) {
      console.warn('User submit TXID call failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  const resetToDefaults = useCallback(async () => {
    setState(defaultAuriumState);
    saveStateToLocal(defaultAuriumState);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'STATE_BROADCAST', state: defaultAuriumState });
    }

    try {
      const res = await fetch('/api/admin/reset-defaults', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.state) updateStateInternal(data.state);
      }
    } catch (e) {
      console.warn('Reset defaults failed', e);
    }
  }, [saveStateToLocal, updateStateInternal]);

  return {
    state,
    isConnected,
    lastSyncTime,
    updateToggles,
    updateAddresses,
    updateApk,
    triggerHalvingCut,
    updateHalvingDate,
    handleTxidAction,
    submitDepositTxid,
    resetToDefaults,
  };
}
