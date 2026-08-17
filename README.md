# HyperSentinel — Protocol Architecture & System Design

## 1. Asymmetric Equivalence Principle Design

HyperSentinel partitions consensus verification into **Strict State-Driving Fields** and **Bounded Fuzzy Tolerances**:

```
Consensus Payload
├── Strict Part (100% Deterministic Agreement Required):
│   ├── strategy_class: enum ("DELTA_NEUTRAL_HEDGER", "TREND_FOLLOWER", "MARTINGALE_DEGEN", etc.)
│   ├── martingale_detected: bool (Must match exact sizing pattern)
│   ├── positions_within_mandate: bool (Must match exact rule compliance)
│   └── breach_severity: enum ("NONE", "MINOR", "CRITICAL")
└── Bounded Fuzzy Part (Allowed Variance Tolerances):
    ├── risk_score: int (±12 points tolerance)
    ├── max_leverage_used: int (±2x tolerance)
    ├── max_drawdown_pct: int (±3% tolerance)
    └── total_open_positions: int (±1 tolerance)
```

---

## 2. Threat Model & Exploit Mitigation

| Attack Vector | Vulnerability | How HyperSentinel Mitigates It |
|---|---|---|
| **Lucky Degen Exploit** | High PnL masked by catastrophic hidden risk. | AI scans order sizes and detects martingale doubling down into drawdowns. |
| **Strategy Drift Exploit** | Trader performs well for weeks, then tilts and opens 80x altcoin positions. | Live position monitoring detects deviation from copier's asset whitelist and leverage ceiling. |
| **Toxic Copy Latency** | Snipe bots frontrunning DEX liquidations cannot be copied profitably due to execution lag. | Strategy scanner classifies `SNIPE_BOT` and flags `STRATEGY_DANGEROUS`. |
| **API Key Theft / Centralization** | Storing exchange API keys on smart contracts is a critical security vulnerability. | Zero-custody architecture: GenLayer only provides on-chain decision signals; execution runs on the user's local machine. |

---

## 3. Anti-Hallucination Separation

```
Raw Hyperliquid DOM Evidence
            │
            ▼ (Non-deterministic Extraction)
LLM Extraction Node
(Extracts raw leverage, hold time, trades, open positions)
            │
            ▼ (Deterministic Python Engine)
Python Smart Contract Logic
(Mathematical risk score computation, threshold checks, Kill Switch state transition)
            │
            ▼
On-Chain Immutable Verdict (STRATEGY_SAFE, KILL_SWITCH_TRIGGERED, etc.)
```
