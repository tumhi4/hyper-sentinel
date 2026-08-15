# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import json
import re
from dataclasses import dataclass
from genlayer import *


@allow_storage
@dataclass
class RiskMandate:
    copier: str
    max_leverage: u256
    allowed_assets: str
    max_position_pct: u256
    max_open_positions: u256


@allow_storage
@dataclass
class TraderSentinelRecord:
    id: str
    trader_address: str
    owner: str
    strategy_class: str
    risk_score: u256
    max_leverage_used: u256
    max_drawdown_pct: u256
    martingale_detected: bool
    status: str
    verdict: str
    kill_switch_active: bool
    breach_severity: str
    last_audit_summary: str
    mandate: RiskMandate


class HyperSentinelCourt(gl.Contract):
    operator: str
    traders: TreeMap[str, TraderSentinelRecord]
    next_trader_id: u256

    def __init__(self, operator: str):
        self.operator = operator.strip().strip('"').strip("'").lower()
        # GenLayer VM automatically instantiates storage-backed TreeMaps.
        self.next_trader_id = u256(0)

    @gl.public.write
    def register_trader(self, trader_address: str) -> str:
        sender = str(gl.message.sender_address).lower()
        addr_clean = trader_address.strip().strip('"').strip("'").lower()

        assert addr_clean.startswith("0x") and len(addr_clean) == 42, \
            "[ERR_ADDR_01] Invalid Hyperliquid trader address (must be 42-char hex starting with 0x)."

        t_num = int(self.next_trader_id) + 1
        self.next_trader_id = u256(t_num)
        t_id = "TRADER_SENTINEL_" + str(t_num).zfill(3)

        empty_mandate = RiskMandate(
            copier=sender,
            max_leverage=u256(10),
            allowed_assets="BTC,ETH,SOL",
            max_position_pct=u256(25),
            max_open_positions=u256(3)
        )

        new_record = TraderSentinelRecord(
            id=t_id,
            trader_address=addr_clean,
            owner=sender,
            strategy_class="UNSCANNED",
            risk_score=u256(0),
            max_leverage_used=u256(0),
            max_drawdown_pct=u256(0),
            martingale_detected=False,
            status="TRADER_REGISTERED",
            verdict="NONE",
            kill_switch_active=False,
            breach_severity="NONE",
            last_audit_summary=f"Trader {addr_clean} registered by copier {sender}. Ready for AI strategy scan.",
            mandate=empty_mandate
        )

        self.traders[t_id] = new_record
        return t_id

    @gl.public.write
    def scan_strategy(self, trader_id: str, history_explorer_url: str) -> str:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        record = self.traders[trader_id]
        sender = str(gl.message.sender_address).lower()

        # Access Control: Owner or Operator
        assert sender == record.owner or sender == self.operator, \
            "[ERR_AUTH_01] Unauthorized: only the registrant or operator can scan strategy."

        url_clean = history_explorer_url.strip().strip('"').strip("'")
        assert url_clean.startswith("http://") or url_clean.startswith("https://"), \
            "[ERR_URL_01] Valid HTTP/HTTPS explorer history URL required."

        target_trader = record.trader_address

        def get_scan_input() -> str:
            try:
                web_data = gl.nondet.web.render(url_clean, mode="text")
            except Exception as e:
                web_data = f"HTTP_FETCH_ERROR: {str(e)}"

            return (
                f"=== HYPERSENTINEL TRADER STRATEGY AUDIT ===\n"
                f"Target Trader Address: '{target_trader}'\n"
                f"History URL: '{url_clean}'\n\n"
                f"=== SCRAPED HYPERLIQUID TRADE HISTORY DOM ===\n"
                f"{web_data}"
            )

        task = (
            "You are a Quantitative Trading Strategy & Perp DEX Risk Auditor.\n"
            "Analyze the historical trade log and metrics in the provided input.\n\n"
            "Classify the trader into one of these strict strategy classes:\n"
            "- DELTA_NEUTRAL_HEDGER (Low risk, funding arbitrage or basis trade)\n"
            "- TREND_FOLLOWER (Medium risk, directional breakout/momentum with stops)\n"
            "- MEAN_REVERTER (Medium risk, range trading extremes)\n"
            "- MARTINGALE_DEGEN (High risk, doubling down on losing positions)\n"
            "- SNIPE_BOT (High frequency, frontrunning, latency toxic for copiers)\n"
            "- MEMECOIN_GAMBLER (Critical risk, low-liquidity memecoins at extreme leverage)\n\n"
            "Extract raw metrics:\n"
            "1. strategy_class: Strict enum string\n"
            "2. max_leverage_used: Integer max leverage seen in history (e.g. 5, 50, 80)\n"
            "3. max_drawdown_pct: Integer max peak-to-trough drawdown percentage (0-100)\n"
            "4. martingale_detected: Boolean true if position size increases after consecutive losses\n"
            "5. confidence_score: Integer 0 to 100\n"
            "6. reasoning: Short 1-2 sentence risk explanation\n\n"
            "Output JSON format:\n"
            "{\n"
            '  "strategy_class": "<ENUM>",\n'
            '  "max_leverage_used": <int>,\n'
            '  "max_drawdown_pct": <int>,\n'
            '  "martingale_detected": true/false,\n'
            '  "confidence_score": <int 0-100>,\n'
            '  "reasoning": "<sentence>"\n'
            "}\n"
            "Respond ONLY with raw JSON."
        )

        criteria = (
            "HyperSentinel Strategy Scan Equivalence Rule:\n"
            "1. Strict Fields (100% exact match required):\n"
            "   - strategy_class (enum)\n"
            "   - martingale_detected (boolean)\n"
            "2. Bounded Fuzzy Fields (allowed variance):\n"
            "   - max_leverage_used (+-2x tolerance)\n"
            "   - max_drawdown_pct (+-3% tolerance)\n"
            "   - confidence_score (+-12 points tolerance)\n"
            "Independently parse the trade history DOM. REJECT the leader proposal if:\n"
            "(1) strategy_class is inconsistent with the historical trade patterns,\n"
            "(2) martingale_detected is false when doubling down size is present after losses,\n"
            "(3) metrics deviate beyond allowed tolerance.\n"
            "Output must be valid JSON matching the schema."
        )

        consensus_result = gl.eq_principle.prompt_non_comparative(
            get_scan_input,
            task=task,
            criteria=criteria
        )

        raw_json = consensus_result.strip()
        if "</think>" in raw_json:
            raw_json = raw_json.split("</think>")[-1].strip()
        if raw_json.startswith("```"):
            lines = raw_json.split("\n")
            if len(lines) >= 3 and lines[0].startswith("```") and lines[-1].startswith("```"):
                raw_json = "\n".join(lines[1:-1]).strip()
            else:
                raw_json = raw_json.replace("```json", "").replace("```", "").strip()

        result = json.loads(raw_json)
        strat_class = str(result.get("strategy_class", "TREND_FOLLOWER")).strip().upper()
        max_lev = int(result.get("max_leverage_used", 5))
        max_dd = int(result.get("max_drawdown_pct", 5))
        is_martingale = bool(result.get("martingale_detected", False))
        conf_score = int(result.get("confidence_score", 85))
        reasoning = str(result.get("reasoning", ""))

        # DETERMINISTIC PYTHON RISK SCORING (0 = Safest, 100 = Most Dangerous)
        risk_score_calc = 20  # Base baseline
        if strat_class == "DELTA_NEUTRAL_HEDGER":
            risk_score_calc = 15
        elif strat_class == "TREND_FOLLOWER":
            risk_score_calc = 25
        elif strat_class == "MEAN_REVERTER":
            risk_score_calc = 35
        elif strat_class == "SNIPE_BOT":
            risk_score_calc = 65
        elif strat_class == "MARTINGALE_DEGEN":
            risk_score_calc = 85
        elif strat_class == "MEMECOIN_GAMBLER":
            risk_score_calc = 95

        # Leverage risk penalty
        if max_lev > 20:
            risk_score_calc += 10
        if max_lev > 40:
            risk_score_calc += 10

        # Martingale penalty
        if is_martingale:
            risk_score_calc += 15

        if risk_score_calc > 100:
            risk_score_calc = 100

        # Determine Verdict
        if risk_score_calc <= 35:
            verdict = "STRATEGY_SAFE"
        elif risk_score_calc <= 60:
            verdict = "STRATEGY_CAUTION"
        else:
            verdict = "STRATEGY_DANGEROUS"

        record.strategy_class = strat_class
        record.risk_score = u256(risk_score_calc)
        record.max_leverage_used = u256(max_lev)
        record.max_drawdown_pct = u256(max_dd)
        record.martingale_detected = is_martingale
        record.status = "STRATEGY_SCANNED"
        record.verdict = verdict
        record.last_audit_summary = (
            f"Strategy Scan Complete: Classified as {strat_class} (Risk Score: {risk_score_calc}/100, Verdict: {verdict}). "
            f"Max Leverage: {max_lev}x, Max Drawdown: {max_dd}%, Martingale: {is_martingale}. {reasoning}"
        )

        self.traders[trader_id] = record
        return json.dumps({
            "trader_id": trader_id,
            "strategy_class": strat_class,
            "risk_score": risk_score_calc,
            "verdict": verdict,
            "max_leverage": max_lev,
            "martingale_detected": is_martingale
        })

    @gl.public.write
    def set_mandate(
        self,
        trader_id: str,
        max_leverage: u256,
        allowed_assets: str,
        max_position_pct: u256,
        max_open_positions: u256
    ) -> None:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        record = self.traders[trader_id]
        sender = str(gl.message.sender_address).lower()

        assert sender == record.owner or sender == self.operator, \
            "[ERR_AUTH_01] Unauthorized: only the registrant can configure risk mandate."

        assert int(max_leverage) >= 1 and int(max_leverage) <= 100, "[ERR_MANDATE_01] Max leverage must be between 1x and 100x."
        assert int(max_position_pct) >= 1 and int(max_position_pct) <= 100, "[ERR_MANDATE_02] Max position size must be 1-100%."
        assert int(max_open_positions) >= 1 and int(max_open_positions) <= 20, "[ERR_MANDATE_03] Max open positions must be 1-20."

        assets_clean = allowed_assets.strip().strip('"').strip("'").upper()

        mandate = RiskMandate(
            copier=sender,
            max_leverage=max_leverage,
            allowed_assets=assets_clean,
            max_position_pct=max_position_pct,
            max_open_positions=max_open_positions
        )

        record.mandate = mandate
        record.status = "LIVE_MONITORING"
        record.last_audit_summary = (
            f"Risk Mandate Activated: Max Leverage {int(max_leverage)}x, "
            f"Whitelisted Assets [{assets_clean}], Max Pos Size {int(max_position_pct)}%, Max Open {int(max_open_positions)}."
        )

        self.traders[trader_id] = record

    @gl.public.write
    def monitor_positions(self, trader_id: str, live_positions_url: str) -> str:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        record = self.traders[trader_id]
        sender = str(gl.message.sender_address).lower()

        assert sender == record.owner or sender == self.operator, \
            "[ERR_AUTH_01] Unauthorized: only the registrant or operator can trigger monitoring."

        assert record.status in ("LIVE_MONITORING", "MANDATE_SECURE", "MANDATE_BREACH", "STRATEGY_SCANNED"), \
            "[ERR_STATE_02] Trader is not in an active monitoring state."

        url_clean = live_positions_url.strip().strip('"').strip("'")
        mandate = record.mandate
        req_max_lev = int(mandate.max_leverage)
        req_allowed = mandate.allowed_assets.upper().replace(" ", "").split(",")
        req_max_pos_pct = int(mandate.max_position_pct)
        req_max_open = int(mandate.max_open_positions)

        def get_monitor_input() -> str:
            try:
                web_data = gl.nondet.web.render(url_clean, mode="text")
            except Exception as e:
                web_data = f"HTTP_FETCH_ERROR: {str(e)}"

            return (
                f"=== HYPERSENTINEL LIVE POSITION MONITOR AUDIT ===\n"
                f"Trader: '{record.trader_address}'\n"
                f"Copier Risk Mandate:\n"
                f"- Max Allowed Leverage: {req_max_lev}x\n"
                f"- Allowed Assets Whitelist: {mandate.allowed_assets}\n"
                f"- Max Single Position Size (% of equity): {req_max_pos_pct}%\n"
                f"- Max Simultaneous Open Positions: {req_max_open}\n\n"
                f"=== LIVE OPEN POSITIONS DOM EVIDENCE ===\n"
                f"{web_data}"
            )

        task = (
            "You are a Real-Time Perp DEX Risk Compliance & Position Sentinel.\n"
            "Audit the live open positions in the input against the copier's Risk Mandate.\n\n"
            "Check for:\n"
            "1. Any position leverage exceeding the max allowed limit\n"
            "2. Any position asset NOT in the allowed assets whitelist\n"
            "3. Any single position size % exceeding the max position size\n"
            "4. Total open positions count exceeding max open positions\n\n"
            "Output JSON format:\n"
            "{\n"
            '  "positions_within_mandate": true/false,\n'
            '  "max_detected_leverage": <int>,\n'
            '  "total_open_positions": <int>,\n'
            '  "unwhitelisted_assets_found": ["..."],\n'
            '  "breach_severity": "NONE" | "MINOR" | "CRITICAL",\n'
            '  "violations": ["<detailed description of each violation>"],\n'
            '  "reasoning": "<short summary sentence>"\n'
            "}\n"
            "Respond ONLY with raw JSON."
        )

        criteria = (
            "HyperSentinel Position Monitoring Equivalence Rule:\n"
            "1. Strict Fields (100% exact match required):\n"
            "   - positions_within_mandate (boolean)\n"
            "   - breach_severity (enum 'NONE', 'MINOR', 'CRITICAL')\n"
            "2. Bounded Fuzzy Fields:\n"
            "   - max_detected_leverage (+-2x tolerance)\n"
            "   - total_open_positions (+-1 tolerance)\n"
            "Independently audit the live open positions table against the mandate. REJECT the leader if:\n"
            "(1) positions_within_mandate is marked true when leverage, unwhitelisted asset, or position count violations exist,\n"
            "(2) breach_severity is NONE when critical breaches are present.\n"
            "Output must be valid JSON matching the schema."
        )

        consensus_result = gl.eq_principle.prompt_non_comparative(
            get_monitor_input,
            task=task,
            criteria=criteria
        )

        raw_json = consensus_result.strip()
        if "</think>" in raw_json:
            raw_json = raw_json.split("</think>")[-1].strip()
        if raw_json.startswith("```"):
            lines = raw_json.split("\n")
            if len(lines) >= 3 and lines[0].startswith("```") and lines[-1].startswith("```"):
                raw_json = "\n".join(lines[1:-1]).strip()
            else:
                raw_json = raw_json.replace("```json", "").replace("```", "").strip()

        result = json.loads(raw_json)
        is_compliant = bool(result.get("positions_within_mandate", False))
        max_lev_det = int(result.get("max_detected_leverage", 0))
        open_pos_count = int(result.get("total_open_positions", 0))
        unwhitelisted = result.get("unwhitelisted_assets_found", [])
        severity = str(result.get("breach_severity", "NONE")).strip().upper()
        violations = result.get("violations", [])
        reasoning = str(result.get("reasoning", ""))

        # DETERMINISTIC PYTHON-SIDE KILL SWITCH ENFORCEMENT
        # If any violation exists, trigger Kill Switch state on-chain
        if is_compliant and max_lev_det <= req_max_lev and open_pos_count <= req_max_open and len(unwhitelisted) == 0:
            record.status = "MANDATE_SECURE"
            record.verdict = "MANDATE_SECURE"
            record.kill_switch_active = False
            record.breach_severity = "NONE"
            record.last_audit_summary = (
                f"MANDATE SECURE: All open positions within mandate rules (Max Lev: {max_lev_det}x <= {req_max_lev}x, "
                f"Open: {open_pos_count} <= {req_max_open}). {reasoning}"
            )
        else:
            # TRIGGER KILL SWITCH
            record.status = "MANDATE_BREACH"
            record.verdict = "KILL_SWITCH_TRIGGERED"
            record.kill_switch_active = True
            record.breach_severity = severity if severity in ("MINOR", "CRITICAL") else "CRITICAL"
            record.last_audit_summary = (
                f"🚨 KILL SWITCH TRIGGERED: Risk Mandate Breach Detected! "
                f"Violations: {', '.join(violations) if violations else 'Exceeded risk constraints'}. "
                f"Off-chain keeper bot authorized to market-close all copy positions. {reasoning}"
            )

        self.traders[trader_id] = record
        return record.verdict

    @gl.public.write
    def reset_kill_switch(self, trader_id: str) -> None:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        record = self.traders[trader_id]
        sender = str(gl.message.sender_address).lower()

        assert sender == record.owner or sender == self.operator, \
            "[ERR_AUTH_01] Unauthorized: only registrant or operator can reset kill switch."

        record.kill_switch_active = False
        record.status = "LIVE_MONITORING"
        record.verdict = "MANDATE_SECURE"
        record.breach_severity = "NONE"
        record.last_audit_summary = "Kill Switch manually reset. Positions confirmed closed. Resuming live monitoring."
        self.traders[trader_id] = record

    @gl.public.view
    def get_risk_status(self, trader_id: str) -> TraderSentinelRecord:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        return self.traders[trader_id]

    @gl.public.view
    def get_kill_switch_status(self, trader_id: str) -> bool:
        assert trader_id in self.traders, "[ERR_STATE_01] Trader ID does not exist."
        return self.traders[trader_id].kill_switch_active

    @gl.public.view
    def get_total_traders(self) -> u256:
        return self.next_trader_id
