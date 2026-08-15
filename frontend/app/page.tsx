'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Sliders, 
  Terminal as TerminalIcon, 
  Search, 
  Zap, 
  AlertOctagon, 
  CheckCircle, 
  TrendingUp, 
  Lock, 
  Layers, 
  Radio, 
  RefreshCw 
} from 'lucide-react';

export default function HyperSentinelTerminal() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'mandate' | 'sentinel' | 'bot'>('scanner');
  const [traderInput, setTraderInput] = useState('0x4a9b23f81902c34918239482910394817e12a89c');
  const [selectedDemo, setSelectedDemo] = useState<'safe' | 'degen' | 'breach'>('safe');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  // Risk Mandate State
  const [maxLeverage, setMaxLeverage] = useState(10);
  const [allowedAssets, setAllowedAssets] = useState('BTC, ETH, SOL');
  const [maxPosPct, setMaxPosPct] = useState(25);
  const [maxOpenPos, setMaxOpenPos] = useState(2);

  // Live Monitoring State
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [liveBreachTriggered, setLiveBreachTriggered] = useState(false);

  const demoData = {
    safe: {
      address: '0x4a9b23f81902c34918239482910394817e12a89c',
      strategyClass: 'TREND_FOLLOWER',
      riskScore: 25,
      verdict: 'STRATEGY_SAFE',
      maxLev: '5x',
      drawdown: '-4.2%',
      martingale: 'FALSE (Disciplined)',
      holdTime: '2.4 Hours',
      radar: { toxicity: 15, fragility: 20, diversification: 85, consistency: 92, martingaleRisk: 5, liquidityRisk: 10 }
    },
    degen: {
      address: '0x9f18b3829012948291039481744b198c09182394',
      strategyClass: 'MARTINGALE_DEGEN',
      riskScore: 95,
      verdict: 'STRATEGY_DANGEROUS',
      maxLev: '50x',
      drawdown: '-64.8%',
      martingale: 'TRUE (Doubling on Loss)',
      holdTime: '18 Minutes',
      radar: { toxicity: 95, fragility: 90, diversification: 15, consistency: 25, martingaleRisk: 98, liquidityRisk: 90 }
    }
  };

  const currentTrader = selectedDemo === 'degen' ? demoData.degen : demoData.safe;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1500);
  };

  const triggerLiveBreachSimulation = () => {
    setLiveBreachTriggered(true);
    setKillSwitchActive(true);
  };

  const resetKillSwitch = () => {
    setLiveBreachTriggered(false);
    setKillSwitchActive(false);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-mono">
      {/* Bloomberg-Style Terminal Topbar */}
      <header className="border-b border-slate-800/80 bg-[#0c121e] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-cyan-400 flex items-center gap-2">
              HYPERSENTINEL // TERMINAL
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/50 px-1.5 py-0.5 rounded font-normal">
                GENLAYER ORACLE V1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Autonomous Perp DEX Risk Oracle & Copy-Trading Kill Switch</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#070b12] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'scanner' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> 1. Strategy Scanner
          </button>
          <button
            onClick={() => setActiveTab('mandate')}
            className={`px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'mandate' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> 2. Mandate Builder
          </button>
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'sentinel' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> 3. Live Sentinel
            {killSwitchActive && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'bot' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" /> 4. Keeper Bot
          </button>
        </div>
      </header>

      {/* Ticker Banner */}
      <div className="bg-[#090e18] border-b border-slate-800/60 px-6 py-1.5 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span>ORACLE STATUS: <strong className="text-emerald-400">ACTIVE (OPTIMISTIC DEMOCRACY)</strong></span>
          <span>ORACLE POLLING: <strong className="text-cyan-300">30s CADENCE</strong></span>
          <span>PERP ECOSYSTEM: <strong className="text-slate-200">HYPERLIQUID L1</strong></span>
        </div>
        <div className="text-slate-500 text-[10px]">
          [GENLAYER DECIDES // KEEPER EXECUTES]
        </div>
      </div>

      {/* Main Terminal View */}
      <main className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Tab 1: Strategy Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {/* Search Box */}
            <div className="p-5 rounded-xl bg-[#0c121e] border border-slate-800 shadow-xl space-y-4">
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4" /> Semantic Strategy Fingerprinting Engine
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={traderInput}
                  onChange={(e) => setTraderInput(e.target.value)}
                  placeholder="Paste Hyperliquid Trader Address (0x...)"
                  className="flex-1 bg-[#070b12] border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="px-6 py-2.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Scan Strategy
                </button>
              </div>

              {/* Demo Case Switcher */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                <span>Quick Test Demos:</span>
                <button
                  onClick={() => { setSelectedDemo('safe'); setTraderInput(demoData.safe.address); }}
                  className={`px-2.5 py-1 rounded text-[11px] border ${
                    selectedDemo === 'safe' ? 'bg-emerald-950 text-emerald-300 border-emerald-500' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  TC-01: Safe Trend Follower
                </button>
                <button
                  onClick={() => { setSelectedDemo('degen'); setTraderInput(demoData.degen.address); }}
                  className={`px-2.5 py-1 rounded text-[11px] border ${
                    selectedDemo === 'degen' ? 'bg-rose-950 text-rose-300 border-rose-500' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  TC-02: 50x Martingale Degen
                </button>
              </div>
            </div>

            {/* Scan Results Card */}
            {scanComplete && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Score & Class */}
                <div className="p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-4">
                  <div className="text-xs text-slate-400 uppercase">AI Strategy Classification</div>
                  
                  <div className={`p-3 rounded-lg border text-center ${
                    currentTrader.strategyClass === 'MARTINGALE_DEGEN' ? 'bg-rose-950/40 border-rose-500/60 text-rose-400' : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400'
                  }`}>
                    <div className="text-xs uppercase font-bold tracking-wider">Classification</div>
                    <div className="text-lg font-black mt-1">{currentTrader.strategyClass}</div>
                    <div className="text-[11px] mt-1 font-semibold">{currentTrader.verdict}</div>
                  </div>

                  <div className="space-y-2 text-xs pt-2">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Risk Score</span>
                      <strong className={currentTrader.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                        {currentTrader.riskScore} / 100
                      </strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Max Leverage Used</span>
                      <strong>{currentTrader.maxLev}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Max Drawdown</span>
                      <strong className={currentTrader.drawdown.startsWith('-6') ? 'text-rose-400' : 'text-slate-200'}>
                        {currentTrader.drawdown}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Martingale Pattern</span>
                      <strong className={currentTrader.martingale.startsWith('TRUE') ? 'text-rose-400' : 'text-emerald-400'}>
                        {currentTrader.martingale}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Avg Hold Time</span>
                      <strong>{currentTrader.holdTime}</strong>
                    </div>
                  </div>
                </div>

                {/* 6-Axis Risk Radar Matrix */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-4">
                  <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>6-Axis Risk Radar Analysis</span>
                    <span className="text-slate-500 font-normal">GENLAYER AI CONSENSUS</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Leverage Toxicity</div>
                      <div className={`text-base font-bold mt-1 ${currentTrader.radar.toxicity > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {currentTrader.radar.toxicity}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Strategy Fragility</div>
                      <div className={`text-base font-bold mt-1 ${currentTrader.radar.fragility > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {currentTrader.radar.fragility}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Diversification</div>
                      <div className="text-base font-bold mt-1 text-cyan-400">
                        {currentTrader.radar.diversification}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Consistency Score</div>
                      <div className="text-base font-bold mt-1 text-cyan-400">
                        {currentTrader.radar.consistency}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Martingale Risk</div>
                      <div className={`text-base font-bold mt-1 ${currentTrader.radar.martingaleRisk > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {currentTrader.radar.martingaleRisk}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#070b12] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Liquidity Risk</div>
                      <div className={`text-base font-bold mt-1 ${currentTrader.radar.liquidityRisk > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {currentTrader.radar.liquidityRisk}%
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#070b12] rounded border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-200">Oracle Assessment: </strong>
                    {currentTrader.strategyClass === 'MARTINGALE_DEGEN' 
                      ? 'Trader exhibits extreme fragility. High risk of liquidation due to position size escalation during losing streaks. Not recommended for copy trading.' 
                      : 'Trader demonstrates disciplined risk management, modest leverage, and consistent stop placement across major assets. Suitable for copying under standard mandate.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mandate Builder */}
        {activeTab === 'mandate' && (
          <div className="p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Personal Risk Mandate Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-1">Set hard risk boundaries for GenLayer to monitor during live copy-trading.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Max Allowed Leverage ({maxLeverage}x)</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxLeverage}
                  onChange={(e) => setMaxLeverage(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>1x (Ultra Safe)</span>
                  <span>10x (Standard)</span>
                  <span>50x (High Risk)</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Whitelisted Allowed Assets</label>
                <input
                  type="text"
                  value={allowedAssets}
                  onChange={(e) => setAllowedAssets(e.target.value)}
                  className="w-full bg-[#070b12] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Comma-separated list (e.g. BTC, ETH, SOL). Unwhitelisted altcoins trigger breach.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Position Size (% Equity)</label>
                  <input
                    type="number"
                    value={maxPosPct}
                    onChange={(e) => setMaxPosPct(Number(e.target.value))}
                    className="w-full bg-[#070b12] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Simultaneous Open Positions</label>
                  <input
                    type="number"
                    value={maxOpenPos}
                    onChange={(e) => setMaxOpenPos(Number(e.target.value))}
                    className="w-full bg-[#070b12] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveTab('sentinel')}
                className="w-full py-3 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <ShieldAlert className="w-4 h-4" /> Activate Sentinel Monitoring On-Chain
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Live Sentinel Dashboard */}
        {activeTab === 'sentinel' && (
          <div className="space-y-6">
            {/* Live Breach Banner if Triggered */}
            {killSwitchActive && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 flex items-center justify-between text-xs text-rose-200 shadow-xl shadow-rose-950/50 animate-pulse">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
                  <div>
                    <strong className="text-rose-100 text-sm block font-bold">🚨 KILL SWITCH ACTIVATED // MANDATE BREACH DETECTED</strong>
                    <span>Trader opened 80x DOGE position exceeding max leverage (10x) and asset whitelist. Local keeper bot executed market-close.</span>
                  </div>
                </div>
                <button
                  onClick={resetKillSwitch}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs shrink-0"
                >
                  Reset Sentinel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Sentinel State */}
              <div className="p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-4">
                <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" /> Sentinel Status
                </div>

                <div className="p-4 rounded bg-[#070b12] border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tracked Trader</span>
                    <span className="font-mono text-cyan-300">0x4a9b...7e12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Oracle State</span>
                    <span className={`font-bold ${killSwitchActive ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {killSwitchActive ? 'KILL_SWITCH_TRIGGERED' : 'MANDATE_SECURE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kill Switch Signal</span>
                    <span className={`font-bold ${killSwitchActive ? 'text-rose-400' : 'text-slate-400'}`}>
                      {killSwitchActive ? 'TRUE (BROADCASTING)' : 'FALSE (IDLE)'}
                    </span>
                  </div>
                </div>

                {/* Simulation Control */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-2">Simulate Live Position Drift:</span>
                  <button
                    onClick={triggerLiveBreachSimulation}
                    className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-600 text-rose-300 font-bold rounded text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" /> Simulate 80x Altcoin Breach
                  </button>
                </div>
              </div>

              {/* Real-time Consensus Audit Log */}
              <div className="lg:col-span-2 p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-4">
                <div className="text-xs text-slate-400 uppercase flex items-center justify-between">
                  <span>Real-Time GenLayer Audit Feed</span>
                  <span className="text-emerald-400 text-[10px]">● LIVE LISTENING</span>
                </div>

                <div className="bg-[#070b12] p-4 rounded border border-slate-800 space-y-2 text-xs text-slate-300 font-mono">
                  <div className="text-slate-500">[01:45:00 UTC] Starting periodic position audit cycle (ID: AUDIT_8892)...</div>
                  <div className="text-slate-400">✓ [Validator 1] Scraped Hyperliquid open positions DOM via gl.nondet.web.render()</div>
                  <div className="text-slate-400">✓ [Validator 2] Position 1 (BTC-PERP 5x LONG) verified compliant</div>
                  <div className="text-slate-400">✓ [Validator 3] Position 2 (ETH-PERP 5x SHORT) verified compliant</div>
                  
                  {killSwitchActive ? (
                    <>
                      <div className="text-rose-400 font-bold">⚠️ [BREACH] Position 3 (DOGE-PERP 80x LONG) violates Max Leverage (10x limit)</div>
                      <div className="text-rose-400 font-bold">⚠️ [BREACH] Asset 'DOGE' not in whitelist [BTC, ETH, SOL]</div>
                      <div className="text-rose-400 font-bold">🚨 [CONSENSUS REACHED] MANDATE_BREACH (CRITICAL) -&gt; kill_switch_active = TRUE</div>
                    </>
                  ) : (
                    <div className="text-emerald-400">✓ [CONSENSUS REACHED] MANDATE_SECURE -&gt; All positions within risk rules</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Bot Guide */}
        {activeTab === 'bot' && (
          <div className="p-6 rounded-xl bg-[#0c121e] border border-slate-800 space-y-6 max-w-3xl mx-auto text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" /> Off-Chain Keeper Bot Architecture
              </h3>
              <p className="text-slate-400 mt-1">Run HyperSentinelBot locally to execute emergency market-closes without exposing API keys.</p>
            </div>

            <div className="p-4 bg-[#070b12] rounded border border-slate-800 space-y-3 font-mono">
              <div className="text-slate-400"># 1. Clone & Set Environment Variables</div>
              <div className="text-cyan-300">export HL_API_WALLET="0xYourHyperliquidWallet"</div>
              <div className="text-cyan-300">export HL_SECRET_KEY="your_private_key_never_shared"</div>
              <div className="text-cyan-300">export TRACKED_TRADER_ID="TRADER_SENTINEL_001"</div>
              <div className="text-slate-400 mt-2"># 2. Run the Autonomous Keeper Bot</div>
              <div className="text-emerald-400">python3 HyperSentinelBot.py</div>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded text-emerald-300 space-y-1">
              <strong>🔒 Zero-Knowledge Key Security:</strong>
              <p className="text-[11px] text-slate-400">GenLayer acts strictly as a decision oracle. Your Hyperliquid API credentials never leave your local machine or VPS.</p>
            </div>
          </div>
        )}

      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-3 text-center text-[11px] text-slate-500 bg-[#0c121e]">
        HyperSentinel // Powered by GenLayer Intelligent Contracts · Asymmetric Consensus & Autonomous Risk Kill Switch
      </footer>
    </div>
  );
}
