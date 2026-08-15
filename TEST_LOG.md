# HyperSentinel — GenLayer Studio Test Log & Validation Suite

This document records the test cases and execution log for **HyperSentinelCourt** in GenLayer Studio.

---

## 📋 Comprehensive Test Matrix

| Test Case | Description | Target DOM / Evidence | Expected Output | Expected Status |
|---|---|---|---|---|
| **TC-01** | Safe Trader Strategy Scan | `mock_hl_safe_trader.html` | `TREND_FOLLOWER`, Risk: 25 | `STRATEGY_SCANNED` (`STRATEGY_SAFE`) |
| **TC-02** | Degen Trader Martingale Scan | `mock_hl_degen_trader.html` | `MARTINGALE_DEGEN`, Risk: 92 | `STRATEGY_SCANNED` (`STRATEGY_DANGEROUS`) |
| **TC-03** | Risk Mandate Configuration | Custom user parameters | Max Lev: 10x, Assets: BTC,ETH,SOL | `LIVE_MONITORING` |
| **TC-04** | Live Position Mandate Breach | `mock_hl_live_breach.html` | 80x DOGE position detected | `MANDATE_BREACH` (`KILL_SWITCH_TRIGGERED`) |
| **TC-05** | Reset Kill Switch | Manual execution confirm | Resumes live tracking | `LIVE_MONITORING` (`MANDATE_SECURE`) |

---

## 🛠️ Step-by-Step Studio Execution Template

### 1. Deploy Contract
* **Operator**: `"0x09fae1aafadb0a3b8382e43ed8d2d56ba92171c3"`

---

### 2. TC-01: Scan Safe Trader Strategy
1. Call `register_trader("0x4a9b23f81902c34918239482910394817e12a89c")`
   > *Returns: `"TRADER_SENTINEL_001"`*
2. Call `scan_strategy("TRADER_SENTINEL_001", "https://sponsor-sync-demo.vercel.app/mock_hl_safe_trader.html")`
3. Call `get_risk_status("TRADER_SENTINEL_001")`:
   ```json
   {
     "id": "TRADER_SENTINEL_001",
     "strategy_class": "TREND_FOLLOWER",
     "risk_score": 25,
     "verdict": "STRATEGY_SAFE",
     "max_leverage_used": 5,
     "martingale_detected": false
   }
   ```

---

### 3. TC-02: Scan Degen Trader Strategy
1. Call `register_trader("0x9f18b3829012948291039481744b198c09182394")`
   > *Returns: `"TRADER_SENTINEL_002"`*
2. Call `scan_strategy("TRADER_SENTINEL_002", "https://sponsor-sync-demo.vercel.app/mock_hl_degen_trader.html")`
3. Call `get_risk_status("TRADER_SENTINEL_002")`:
   ```json
   {
     "id": "TRADER_SENTINEL_002",
     "strategy_class": "MARTINGALE_DEGEN",
     "risk_score": 95,
     "verdict": "STRATEGY_DANGEROUS",
     "max_leverage_used": 50,
     "martingale_detected": true
   }
   ```

---

### 4. TC-04: Mandate Breach & Kill Switch Trigger
1. Call `set_mandate("TRADER_SENTINEL_001", 10, "BTC,ETH,SOL", 25, 2)`
2. Call `monitor_positions("TRADER_SENTINEL_001", "https://sponsor-sync-demo.vercel.app/mock_hl_live_breach.html")`
3. Call `get_risk_status("TRADER_SENTINEL_001")`:
   ```json
   {
     "id": "TRADER_SENTINEL_001",
     "status": "MANDATE_BREACH",
     "verdict": "KILL_SWITCH_TRIGGERED",
     "kill_switch_active": true,
     "breach_severity": "CRITICAL"
   }
   ```
