import { useEffect, useState } from 'react';
import { ScanLine } from 'lucide-react';

const SCAN_STAGES = [
  'Tokenizing headers, URI schemes, and redirect parameters',
  'Inspecting obfuscated payloads and ClickFix command chains',
  'Extracting and defanging network & host IOCs',
  'Mapping MITRE ATT&CK techniques and containment steps',
];

export function ScanningLoader() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % SCAN_STAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hud-panel relative overflow-hidden bg-[#0B101B] border border-[#00E5FF]/50 rounded-xl p-6"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[#00E5FF]/15 to-transparent animate-hud-sweep"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-4 border-b border-[#1B2436] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <ScanLine className="w-5 h-5 text-[#00E5FF]" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#E0E1F7] tracking-tight">
            Static Threat Triage in Progress
          </h2>
        </div>
        <span className="font-mono text-xs text-[#00E5FF] tabular-nums">
          STAGE {stageIndex + 1}/{SCAN_STAGES.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {SCAN_STAGES.map((label, idx) => {
          const isCurrent = idx === stageIndex;
          const isDone = idx < stageIndex;
          return (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-2.5 px-3.5 bg-[#06090F] border border-[#1B2436] rounded-lg"
            >
              <span
                className={`text-xs sm:text-sm font-mono ${
                  isCurrent
                    ? 'text-[#00E5FF]'
                    : isDone
                      ? 'text-[#00E676]'
                      : 'text-[#849396]'
                }`}
              >
                {label}
              </span>
              <span
                className={`text-[11px] font-mono font-bold shrink-0 ${
                  isCurrent
                    ? 'text-[#00E5FF]'
                    : isDone
                      ? 'text-[#00E676]'
                      : 'text-[#849396]'
                }`}
              >
                {isCurrent ? 'ACTIVE' : isDone ? 'DONE' : 'QUEUED'}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-[#849396]">
        Zero-execution sandbox active: no external URLs are fetched and no commands are executed.
      </p>
    </div>
  );
}
