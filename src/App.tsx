import { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Lock,
  RotateCcw,
  Terminal,
  User,
  X,
  Zap,
} from 'lucide-react';
import { SYNTHETIC_SAMPLES } from './data/samples';
import type { AnalysisResult, ScanHistoryItem } from './types/phishlens';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ScanningLoader } from './components/ScanningLoader';
import { VERDICT_THEME } from './components/RiskGauge';

const QUICK_SCENARIO_META = [
  {
    id: 'clickfix-verify',
    num: '#01',
    numColor: '#FF2A5F',
    title: 'ClickFix Lure',
  },
  {
    id: 'm365-phish',
    num: '#02',
    numColor: '#FFB800',
    title: 'Cred Phish',
  },
  {
    id: 'oauth-open-redirect',
    num: '#03',
    numColor: '#00E5FF',
    title: 'Open Rdct',
  },
];

function PhishLensEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 20a8 8 0 1 1 8-8v1.5a2.5 2.5 0 0 1-5 0V12a3 3 0 1 0-3 3c1.1 0 2.06-.6 2.58-1.48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'hud' | 'logs'>('hud');
  const [infoOpen, setInfoOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLoadSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const sample = SYNTHETIC_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setInput(sample.content);
      setError(null);
    }
  };

  const handleClearInput = () => {
    setInput('');
    setSelectedSampleId('');
    setError(null);
    textareaRef.current?.focus();
  };

  const handleResetConsole = () => {
    setInput('');
    setSelectedSampleId('');
    setResult(null);
    setError(null);
    setActiveTab('hud');
    textareaRef.current?.focus();
  };

  const handleAnalyze = async (artifactOverride?: string) => {
    const payload = (artifactOverride ?? input).trim();
    if (!payload) {
      setError(
        'Input buffer is empty. Paste an email (headers + body), suspicious URL, or ClickFix lure—or choose a quick-load scenario.'
      );
      textareaRef.current?.focus();
      return;
    }

    setError(null);
    setLoading(true);
    setActiveTab('hud');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: payload }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Analysis request failed with status ${response.status}.`);
      }

      const analysis = data as AnalysisResult;
      setResult(analysis);

      const firstLine =
        payload
          .split('\n')
          .map((l) => l.trim())
          .find(Boolean) || 'Artifact scan';

      const entry: ScanHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        preview: firstLine.slice(0, 64),
        input: payload,
        result: analysis,
      };

      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Analysis timed out after 45 seconds. Please click Analyze Artifact to retry.');
      } else {
        const msg =
          err instanceof Error ? err.message : 'Unable to reach the PhishLens analysis endpoint.';
        setError(msg);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleQuickInspectSample = (sampleId: string) => {
    const sample = SYNTHETIC_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;
    setSelectedSampleId(sample.id);
    setInput(sample.content);
    void handleAnalyze(sample.content);
  };

  const lineCount = Math.max(7, input.split('\n').length);

  return (
    <div className="hud-dot-grid relative min-h-screen text-[#E0E1F7] flex flex-col">
      {/* Subtle CRT scanline texture overlay */}
      <div className="crt-scanlines pointer-events-none fixed inset-0 z-30" aria-hidden="true" />

      {/* Top Navigation Header matching Stitch Screenshot */}
      <header className="relative z-20 border-b border-[#161E2E] bg-[#080B14]/90 backdrop-blur-sm">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Logo + Title + Sandbox Pill */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                handleResetConsole();
              }}
              className="w-9 h-9 rounded-lg bg-[#091824] border border-[#00E5FF]/40 shadow-[0_0_14px_rgba(0,229,255,0.2)] flex items-center justify-center text-[#00E5FF] shrink-0"
              aria-label="PhishLens Home"
            >
              <PhishLensEmblem className="w-5 h-5" />
            </a>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm sm:text-base font-bold tracking-wide text-white whitespace-nowrap">
                  PHISHLENS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#091E1A] border border-[#00E676]/40 text-[#00E676] font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap">
                  <Lock className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                  <span>ZERO-EXECUTION SANDBOX</span>
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#64748B] truncate mt-0.5">
                CYBER-ARCADE HUD TRIAGE
              </p>
            </div>
          </div>

          {/* Right: HUD Terminal, Telemetry Logs, RESET, Analyst Icon */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <nav className="hidden sm:flex items-center gap-5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('hud')}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'hud' ? 'text-[#E0E1F7]' : 'text-[#64748B] hover:text-[#00E5FF]'
                }`}
              >
                HUD Terminal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'logs' ? 'text-[#00E5FF]' : 'text-[#64748B] hover:text-[#00E5FF]'
                }`}
              >
                Telemetry Logs{history.length > 0 ? ` (${history.length})` : ''}
              </button>
            </nav>

            <button
              type="button"
              onClick={handleResetConsole}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#E0526E] hover:text-[#FF2A5F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>RESET</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setInfoOpen((prev) => !prev)}
                aria-label="Toggle sandbox posture info"
                className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#1E293B] hover:border-[#00E5FF] text-[#94A3B8] hover:text-[#00E5FF] flex items-center justify-center transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" aria-hidden="true" />
              </button>

              {infoOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0B101B] border border-[#1B2436] rounded-xl p-4 shadow-2xl z-40">
                  <div className="flex items-center justify-between border-b border-[#1B2436] pb-2 mb-2.5">
                    <span className="font-mono text-[11px] font-bold text-[#00E5FF]">
                      SANDBOX GUARDRAILS
                    </span>
                    <button
                      type="button"
                      onClick={() => setInfoOpen(false)}
                      className="text-[#64748B] hover:text-[#E0E1F7] cursor-pointer"
                      aria-label="Close info"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#BAC9CC]">
                    <li>• Zero HTTP fetching of pasted URLs</li>
                    <li>• Zero shell execution of pasted scripts</li>
                    <li>• Automatic IOC defanging (hxxp / [.])</li>
                    <li>• Server-side Gemini triage isolation</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="relative z-10 flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Hero Title Band matching Stitch Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-7 border-b border-[#161E2E]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-white uppercase leading-none">
                ARCADE TRIAGE CONSOLE
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-[#071D26] border border-[#00E5FF]/40 text-[#00E5FF] font-mono text-[11px] font-bold tracking-wider">
                LIVE HUD
              </span>
            </div>
            <p className="mt-2 font-mono text-xs text-[#64748B] tracking-wide">
              // REAL-TIME STATIC EXECUTION ANALYSIS &amp; THREAT INTEL ENGINE
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09121B] border border-[#18332E] self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" aria-hidden="true" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#00E676]">
              SANDBOX ENGINE ONLINE
            </span>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex sm:hidden items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('hud')}
            className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
              activeTab === 'hud'
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#0B101B] border-[#1B2436] text-[#849396]'
            }`}
          >
            HUD Terminal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#0B101B] border-[#1B2436] text-[#849396]'
            }`}
          >
            Telemetry Logs ({history.length})
          </button>
        </div>

        {/* 12-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Artifact Intake & Parser + Security Notice */}
          <div className="lg:col-span-5 space-y-5">
            <section
              aria-label="Artifact Intake & Parser"
              className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-4 h-4 text-[#00E5FF] shrink-0" aria-hidden="true" />
                  <h2 className="font-mono text-xs font-bold tracking-wider text-[#00E5FF] truncate">
                    ARTIFACT INTAKE &amp; PARSER
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Accessible Load Sample selector integrated cleanly */}
                  <div className="relative">
                    <label htmlFor="sample-select" className="sr-only">
                      Load Sample
                    </label>
                    <select
                      id="sample-select"
                      value={selectedSampleId}
                      onChange={(e) => handleLoadSample(e.target.value)}
                      className="appearance-none bg-[#06090F] border border-[#1B2436] hover:border-[#00E5FF]/60 focus:border-[#00E5FF] focus:outline-none rounded px-2.5 py-1 pr-6 font-mono text-[11px] text-[#94A3B8] cursor-pointer"
                    >
                      <option value="">Load Sample</option>
                      {SYNTHETIC_SAMPLES.map((sample) => (
                        <option key={sample.id} value={sample.id}>
                          {sample.category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none w-3 h-3 text-[#64748B] absolute right-1.5 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleClearInput}
                    disabled={!input && !error}
                    className="font-mono text-[11px] font-semibold tracking-wider text-[#64748B] hover:text-[#E0E1F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              {/* Input Label */}
              <label
                htmlFor="artifact-textarea"
                className="block font-mono text-[11px] tracking-wider text-[#64748B] mb-2"
              >
                PASTE E-MAIL, URL, OR POWERSHELL LURE
              </label>

              {/* Line-Numbered Code/Payload Textarea */}
              <div className="bg-[#06090F] border border-[#1B2436] focus-within:border-[#00E5FF] rounded-lg flex overflow-hidden transition-colors">
                <div
                  aria-hidden="true"
                  className="w-9 py-3 bg-[#080C14] border-r border-[#161E2E] text-right pr-2.5 font-mono text-xs leading-relaxed text-[#475569] select-none shrink-0"
                >
                  {Array.from({ length: lineCount }).map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  id="artifact-textarea"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  rows={7}
                  spellCheck={false}
                  placeholder="Paste raw headers, URLs, or obfuscated clickfix commands here..."
                  className="flex-1 bg-transparent p-3 font-mono text-xs leading-relaxed text-[#E0E1F7] placeholder:text-[#475569] focus:outline-none resize-y min-h-[172px]"
                />
              </div>

              {/* Chars / Encoding Status Bar */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#64748B] tabular-nums">
                  {input.length.toLocaleString()} chars
                </span>
                <span className="text-[#00E5FF] font-semibold tracking-wider">
                  UTF-8 / ASCII SECURE
                </span>
              </div>

              {/* Quick Load Sample Scenario 3-Card Row */}
              <div className="mt-5">
                <span className="block font-mono text-[11px] tracking-wider text-[#64748B] mb-2.5">
                  QUICK LOAD SAMPLE SCENARIO
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {QUICK_SCENARIO_META.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleQuickInspectSample(item.id)}
                      disabled={loading}
                      className="bg-[#101624] hover:bg-[#151D30] border border-[#1F293D] hover:border-[#00E5FF]/60 rounded-lg p-3 text-left transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <span
                        className="block font-mono text-[11px] font-bold"
                        style={{ color: item.numColor }}
                      >
                        {item.num}
                      </span>
                      <span className="block text-xs font-bold text-[#E0E1F7] mt-1 truncate">
                        {item.title}
                      </span>
                      <span className="block font-mono text-[10px] text-[#64748B] mt-0.5">
                        Load &amp; Scan
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Glowing Cyan CTA Button */}
              <button
                type="button"
                onClick={() => void handleAnalyze()}
                disabled={loading}
                className="mt-5 w-full py-3.5 px-5 rounded-lg bg-[#00E5FF] hover:bg-[#5CEEFF] text-[#04141A] font-mono text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                <span>{loading ? 'ANALYZING ARTIFACT...' : 'ANALYZE ARTIFACT'}</span>
              </button>
            </section>

            {/* Security Notice Card underneath Intake */}
            <aside
              aria-label="Security Notice"
              className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5"
            >
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#00E5FF]">
                SECURITY NOTICE
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Static analysis only. Nothing is fetched or executed.
              </p>
            </aside>
          </div>

          {/* Right Column (7 cols): Empty Standby State / Loader / Results State / Logs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Actionable Error Banner */}
            {error && (
              <div
                role="alert"
                className="bg-[#FF2A5F]/15 border border-[#FF2A5F]/70 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#FF2A5F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-bold text-[#FF2A5F]">Triage Error</h3>
                    <p className="mt-1 text-sm text-[#E0E1F7] leading-relaxed">{error}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error message"
                  className="p-1 text-[#BAC9CC] hover:text-[#E0E1F7] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Telemetry Logs Tab */}
            {activeTab === 'logs' ? (
              <section
                aria-label="Session Telemetry Logs"
                className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6 min-h-[480px]"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1B2436]">
                  <h2 className="font-mono text-xs font-bold tracking-wider text-[#00E5FF]">
                    SESSION TELEMETRY LOGS
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hud')}
                    className="font-mono text-xs text-[#94A3B8] hover:text-[#00E5FF] cursor-pointer"
                  >
                    Back to HUD →
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-base font-semibold text-[#E0E1F7]">No Scans Recorded Yet</p>
                    <p className="mt-2 text-sm text-[#849396] max-w-md mx-auto">
                      Analyze an artifact or trigger one of the quick-load scenarios to inspect real
                      session triage records here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 divide-y divide-[#1B2436] border border-[#1B2436] rounded-lg bg-[#06090F] overflow-hidden">
                    {history.map((item) => {
                      const theme = VERDICT_THEME[item.result.verdict];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setInput(item.input);
                            setResult(item.result);
                            setError(null);
                            setActiveTab('hud');
                          }}
                          className="w-full text-left px-4 py-3.5 hover:bg-[#101829] transition-colors flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-[#E0E1F7] truncate">
                              {item.preview}
                            </p>
                            <p className="font-mono text-[11px] text-[#64748B] mt-1">
                              {item.timestamp} · {item.result.attack_type}
                            </p>
                          </div>
                          <span
                            className="font-mono text-xs font-bold tabular-nums shrink-0"
                            style={{ color: theme.color }}
                          >
                            {item.result.verdict} ({item.result.risk_score}/100)
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : loading ? (
              <ScanningLoader />
            ) : result ? (
              <AnalysisDashboard result={result} />
            ) : (
              /* Empty State matching Stitch Screenshot exactly */
              <section
                aria-label="Awaiting Artifact Intake"
                className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl min-h-[476px] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0F1826] border border-[#1C2A3E] flex items-center justify-center text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.12)] mb-5">
                  <PhishLensEmblem className="w-7 h-7" />
                </div>

                <h2 className="text-xl font-bold text-[#E0E1F7] tracking-tight">
                  Awaiting Artifact Intake...
                </h2>

                <p className="mt-2.5 text-sm text-[#849396] max-w-md leading-relaxed">
                  Paste a suspicious URL, email snippet, or malicious script payload into the intake
                  panel or select a quick-load scenario to begin cyber-arcade triage.
                </p>

                <button
                  type="button"
                  onClick={() => handleQuickInspectSample('clickfix-verify')}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#101827] border border-[#1F2C40] hover:border-[#00E5FF] text-xs font-mono font-semibold tracking-wider text-[#BAC9CC] hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  <span>LOAD DEMO ATTACK VECTOR</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
