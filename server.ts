import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuriumState, TxidDeposit, PresaleRoundId } from './src/types';
import { defaultAuriumState } from './src/data/initialState';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory state initialized from defaults
let state: AuriumState = JSON.parse(JSON.stringify(defaultAuriumState));

// Connected SSE clients
const sseClients = new Set<Response>();

function broadcastState(eventType: string = 'STATE_UPDATE') {
  const payload = `data: ${JSON.stringify({ type: eventType, state, timestamp: Date.now() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Support proof screenshot uploads
  app.use(express.json({ limit: '12mb' }));

  // Real-time SSE Stream
  app.get('/api/realtime/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send initial snapshot
    res.write(`data: ${JSON.stringify({ type: 'INIT', state, timestamp: Date.now() })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // Get current state
  app.get('/api/state', (_req: Request, res: Response) => {
    res.json(state);
  });

  // Update Master Toggles
  app.post('/api/admin/toggles', (req: Request, res: Response) => {
    const { network, deposits, presale, withdrawals, p2pTransfers } = req.body;
    if (network !== undefined) state.network = { ...state.network, ...network };
    if (deposits !== undefined) state.deposits = { ...state.deposits, ...deposits };
    if (presale !== undefined) state.presale = { ...state.presale, ...presale };
    if (withdrawals !== undefined) state.withdrawals = { ...state.withdrawals, ...withdrawals };
    if (p2pTransfers !== undefined) state.p2pTransfers = { ...state.p2pTransfers, ...p2pTransfers };

    broadcastState('TOGGLES_UPDATED');
    res.json({ success: true, state });
  });

  // Dedicated 3-Round Presale Management Endpoint
  app.post('/api/admin/presale-config', (req: Request, res: Response) => {
    const { activeRoundId, status, notificationBanner, rounds, minDepositUsdt, enabled } = req.body;

    if (enabled !== undefined) {
      state.presale.enabled = Boolean(enabled);
    }

    if (status) {
      state.presale.status = status;
    }

    if (notificationBanner !== undefined) {
      state.presale.notificationBanner = notificationBanner;
    }

    if (minDepositUsdt !== undefined) {
      state.presale.minDepositUsdt = Number(minDepositUsdt);
    }

    if (rounds) {
      state.presale.rounds = { ...state.presale.rounds, ...rounds };
    }

    if (activeRoundId && state.presale.rounds[activeRoundId as PresaleRoundId]) {
      state.presale.activeRoundId = activeRoundId as PresaleRoundId;
      const roundData = state.presale.rounds[activeRoundId as PresaleRoundId];
      state.presale.round = roundData.shortName;
      state.presale.rateUsdtPerAuri = roundData.priceUsdt;
      state.presale.totalAllocation = roundData.totalAllocation;
      state.presale.raisedUsdt = roundData.raisedUsdt;
      state.presale.progressPercent = roundData.progressPercent;
    }

    broadcastState('PRESALE_CONFIG_UPDATED');
    res.json({ success: true, state });
  });

  // Update Deposit Addresses
  app.post('/api/admin/addresses', (req: Request, res: Response) => {
    const { bep20, trc20, erc20 } = req.body;
    if (bep20) state.depositAddresses.bep20 = bep20.trim();
    if (trc20) state.depositAddresses.trc20 = trc20.trim();
    if (erc20) state.depositAddresses.erc20 = erc20.trim();

    broadcastState('ADDRESSES_UPDATED');
    res.json({ success: true, state });
  });

  // Update APK Details
  app.post('/api/admin/apk', (req: Request, res: Response) => {
    const { version, downloadUrl, fileSize, sha256 } = req.body;
    if (version) state.apk.version = version.trim();
    if (downloadUrl) state.apk.downloadUrl = downloadUrl.trim();
    if (fileSize) state.apk.fileSize = fileSize.trim();
    if (sha256) state.apk.sha256 = sha256.trim();

    broadcastState('APK_UPDATED');
    res.json({ success: true, state });
  });

  // Halving Engine Manual Overrides & Trigger
  app.post('/api/admin/halving', (req: Request, res: Response) => {
    const { action, nextHalvingDate, baseDailyYield, currentEra } = req.body;

    if (baseDailyYield !== undefined) {
      state.network.baseDailyYield = Number(baseDailyYield);
    }

    if (currentEra !== undefined) {
      state.halving.currentEra = Number(currentEra);
    }

    if (nextHalvingDate) {
      state.halving.nextHalvingDate = nextHalvingDate;
    }

    if (action === 'trigger_50') {
      const prevYield = state.network.baseDailyYield;
      const newYield = Number((prevYield / 2).toFixed(4));
      state.network.baseDailyYield = newYield;
      state.halving.currentEra += 1;
      state.halving.totalHalvingsTriggered += 1;
      state.network.blockHeight += 12840;

      // Reset countdown to default 30 days ahead unless explicit date given
      if (!nextHalvingDate) {
        const nextDate = new Date(Date.now() + 30 * 24 * 3600 * 1000);
        state.halving.nextHalvingDate = nextDate.toISOString();
      }

      state.halving.halvingHistory.unshift({
        id: `halv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousYield: prevYield,
        newYield: newYield,
        blockHeight: state.network.blockHeight,
      });
    }

    broadcastState('HALVING_UPDATED');
    res.json({ success: true, state });
  });

  // TXID action: approve / reject
  app.post('/api/admin/txid-action', (req: Request, res: Response) => {
    const { id, action, note } = req.body;
    const item = state.txids.find((t) => t.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Deposit record not found' });
    }

    if (action === 'approve') {
      item.status = 'approved';
      if (note) item.note = note;
      // Increment active round raised and total
      state.presale.raisedUsdt += item.amountUsdt;
      state.network.activeNodes += Math.floor(item.amountUsdt / 10);

      const activeId = state.presale.activeRoundId;
      if (state.presale.rounds && state.presale.rounds[activeId]) {
        const r = state.presale.rounds[activeId];
        r.raisedUsdt += item.amountUsdt;
        r.progressPercent = Math.min(100, Number(((r.raisedUsdt / r.targetCapUsdt) * 100).toFixed(1)));
        state.presale.progressPercent = r.progressPercent;
      }
    } else if (action === 'reject') {
      item.status = 'rejected';
      if (note) item.note = note;
    }

    broadcastState('TXID_UPDATED');
    res.json({ success: true, state });
  });

  // Public user submits a TXID with optional proof screenshot
  app.post('/api/user/submit-txid', (req: Request, res: Response) => {
    const { userWallet, network, amountUsdt, txid, note, proofImageBase64, round } = req.body;
    if (!userWallet || !network || !amountUsdt || !txid) {
      return res.status(400).json({ error: 'Missing required deposit fields' });
    }

    const currentRound = round || state.presale.round || 'Round 1';

    const newTxid: TxidDeposit = {
      id: `tx-${Date.now()}`,
      userWallet: userWallet.trim(),
      network: network,
      amountUsdt: Number(amountUsdt),
      txid: txid.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      note: note || `Presale ${currentRound} portal submission`,
      proofImageBase64: proofImageBase64 || undefined,
      round: currentRound,
    };

    state.txids.unshift(newTxid);
    broadcastState('TXID_SUBMITTED');
    res.json({ success: true, item: newTxid, state });
  });

  // Reset to default for testing convenience
  app.post('/api/admin/reset-defaults', (_req: Request, res: Response) => {
    state = JSON.parse(JSON.stringify(defaultAuriumState));
    broadcastState('STATE_RESET');
    res.json({ success: true, state });
  });

  // Dev server with Vite middleware or production static
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Aurium Network server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Aurium server:', err);
  process.exit(1);
});
