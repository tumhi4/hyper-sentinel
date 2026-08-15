# HyperSentinel — Autonomous Perp DEX Risk Oracle & Copy-Trading Kill Switch

> **"Don't copy PnL. Copy risk-adjusted strategy."**

An Intelligent Contract Risk Oracle built on **GenLayer** for the Hyperliquid Perp DEX ecosystem. HyperSentinel performs semantic strategy fingerprinting on top traders and continuously monitors live positions against user risk mandates to trigger autonomous kill-switch protection.

---

## 🔗 Live Deployment & Repository Links

- **GenLayer Explorer Contract**: [`0xf35D7258c6Dce1f5fD78E994c8e0d874da7f41CE`](https://explorer-studio.genlayer.com/address/0xf35D7258c6Dce1f5fD78E994c8e0d874da7f41CE)
- **GitHub Repository**: [`https://github.com/tumhi4/hyper-sentinel`](https://github.com/tumhi4/hyper-sentinel)
- **Live Frontend Terminal**: [`https://hyper-sentinel-web.vercel.app/`](https://hyper-sentinel-web.vercel.app/)

---

## 🌟 How this differs from Reasoned Judgment Protocol (RJP)

> **RJP (1000 pts) evaluates whether a wallet is a SCAMMER or safe counterparty (Counterparty Safety). HyperSentinel evaluates whether a trader's STRATEGY is too risky to copy (Investment/Strategy Risk). They are complementary, not competing. Furthermore, HyperSentinel introduces a Live Mandate Drift Detection system and a safe Kill Switch architecture where GenLayer acts purely as the decision layer, never holding execution API keys.**

---

## 🌟 The Core Problem

Hyperliquid leaderboards display raw historical PnL and win rates. They do **NOT** show:
1. **Martingale Fragility**: Whether the trader doubles down into losing positions.
2. **Memecoin Degeneracy**: Whether returns came from 50x leverage on low-liquidity shitcoins.
3. **Strategy Drift**: Whether a previously safe trader suddenly went on tilt after a drawdown.
4. **Copy Latency Penalty**: Whether the strategy relies on high-frequency snipe bots where copiers suffer toxic slippage.

Retail traders blind-copy high PnL accounts and face catastrophic liquidations. **HyperSentinel solves this by providing decentralized AI consensus that analyzes trade patterns and enforces live risk mandates.**

---

## ⚡ The 3 God-Tier Features

```
+--------------------------------------------------------------------------------------------------+
|                                    HYPERSENTINEL RISK SHIELD                                     |
+--------------------------------------------------------------------------------------------------+
| [Feature 1: Semantic Strategy Fingerprinting] -> Classifies strategy type (TREND_FOLLOWER, etc.) |
| [Feature 2: Live Mandate Drift Detection]    -> Evaluates open positions against personal limits |
| [Feature 3: Safe Kill Switch Architecture]   -> GenLayer emits signal; local bot closes trades    |
+--------------------------------------------------------------------------------------------------+
```

1. **Feature 1 — Semantic Strategy Fingerprinting**:
   - Scrapes public trade history and classifies the trader into strict strategy classes (`DELTA_NEUTRAL_HEDGER`, `TREND_FOLLOWER`, `MEAN_REVERTER`, `MARTINGALE_DEGEN`, `SNIPE_BOT`, `MEMECOIN_GAMBLER`).
2. **Feature 2 — Live Mandate Drift Detection**:
   - Compares live open positions against copier-defined risk rules (Max Leverage, Allowed Asset Whitelist, Max Position % of Equity, Max Open Positions).
3. **Feature 3 — Autonomous Kill Switch Execution**:
   - If a mandate breach occurs, GenLayer sets `kill_switch_active = True`.
   - The user's off-chain keeper bot (`HyperSentinelBot.py`) polling GenLayer detects the breach and connects to Hyperliquid using local API keys to market-close all positions.

---

## 🔒 Separation of Concerns & Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: FRONTEND UI                     │
│  Next.js Bloomberg Terminal (Trader Scanner & Live Logs)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ GenLayer RPC
┌──────────────────────────────▼──────────────────────────────┐
│            LAYER 2: GENLAYER INTELLIGENT CONTRACT           │
│                   HyperSentinelCourt.py                     │
│   • gl.nondet.web.render() scraping                         │
│   • Semantic Strategy & Mandate Equivalence Consensus       │
│   • Sets on-chain `kill_switch_active = True`               │
│   • ZERO API keys or fund custody                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ On-Chain State Poll (30s)
┌──────────────────────────────▼──────────────────────────────┐
│             LAYER 3: OFF-CHAIN EXECUTION KEEPER             │
│                     HyperSentinelBot.py                     │
│   • Runs locally on user's machine/VPS                      │
│   • Holds user's local Hyperliquid API credentials          │
│   • Market-closes positions on Hyperliquid Perp DEX         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step GenLayer Studio Testing Guide

### 1. Deploy Contract
Deploy `HyperSentinelCourt.py` in Studio with your wallet as `operator`.

### 2. Register Trader (`register_trader`)
* `trader_address`: `"0x4a9b23f81902c34918239482910394817e12a89c"`
> *Returns: `"TRADER_SENTINEL_001"`*

### 3. Scan Safe Trader Strategy (`scan_strategy`)
* `trader_id`: `"TRADER_SENTINEL_001"`
* `history_explorer_url`: `"https://hyper-sentinel-web.vercel.app/demo/mock_hl_safe_trader.html"`
> *Result: `strategy_class: "TREND_FOLLOWER"`, `risk_score: 25`, `verdict: "STRATEGY_SAFE"`.*

### 4. Set Risk Mandate (`set_mandate`)
* `trader_id`: `"TRADER_SENTINEL_001"`
* `max_leverage`: `10`
* `allowed_assets`: `"BTC,ETH,SOL"`
* `max_position_pct`: `25`
* `max_open_positions`: `2`

### 5. Monitor Live Breach Position (`monitor_positions`)
* `trader_id`: `"TRADER_SENTINEL_001"`
* `live_positions_url`: `"https://hyper-sentinel-web.vercel.app/demo/mock_hl_live_breach.html"`
> *Result: `status: "MANDATE_BREACH"`, `verdict: "KILL_SWITCH_TRIGGERED"`, `kill_switch_active: true`, `breach_severity: "CRITICAL"`.*

### 6. Inspect Status (`get_risk_status`)
* `trader_id`: `"TRADER_SENTINEL_001"`
