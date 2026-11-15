import { useState } from 'react';
import {
  Check,
  Copy,
  FileText,
  GitFork,
  Terminal,
  Shield,
  Flag,
  Crosshair,
  ListChecks,
  Lightbulb,
} from 'lucide-react';
import type { AnalysisResult } from '../types/phishlens';
import { formatIocsForClipboard } from '../utils/defang';
import { RiskGauge, VERDICT_THEME, VerdictIcon } from './RiskGauge';
import { IncidentTicketModal } from './IncidentTicketModal';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

export function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  const [iocsCopied, setIocsCopied] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const theme = VERDICT_THEME[result.verdict];

  const totalIocCount =
    result.iocs.domains.length +
    result.iocs.urls.length +
    result.iocs.ips.length +
    result.iocs.files.length +
    result.iocs.commands.length;

  const handleCopyAllIocs = async () => {
    const formatted = formatIocsForClipboard(result.iocs);
    try {
      await navigator.clipboard.writeText(formatted);
      setIocsCopied(true);
      setTimeout(() => setIocsCopied(false), 2400);
    } catch {
      setIocsCopied(false);
    }
  };

  const iocGroups: { key: keyof AnalysisResult['iocs']; label: string; items: string[] }[] = [
    { key: 'domains', label: 'Domains', items: result.iocs.domains },
    { key: 'urls', label: 'URLs', items: result.iocs.urls },
    { key: 'ips', label: 'IP Addresses', items: result.iocs.ips },
    { key: 'files', label: 'Files', items: result.iocs.files },
    { key: 'commands', label: 'Commands', items: result.iocs.commands },
  ];

  return (
    <div className="space-y-5">
      {/* Clipboard confirmation banner */}
      {iocsCopied && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 px-4 py-3 bg-[#00E676]/15 border border-[#00E676]/70 rounded-xl text-[#00E676] text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Copied! Categorized defanged IOCs copied to clipboard.</span>
          </div>
          <span className="tabular-nums shrink-0">{totalIocCount} IOCs</span>
        </div>
      )}

      {/* 1. Verdict Banner & Risk Meter */}
      <section
        id="section-verdict"
        className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6"
        aria-label="Verdict banner and risk meter"
      >
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
          <div className="flex-1 flex flex-col justify-between gap-5 min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold border ${theme.bgTint} ${theme.border}`}
                  style={{ color: theme.color }}
                >
                  <VerdictIcon verdict={result.verdict} className="w-4 h-4 shrink-0" />
                  <span>{theme.badgeLabel}</span>
                </span>

                <span className="text-xs font-mono text-[#849396]">
                  Severity: {theme.severityLabel}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#E0E1F7] tracking-tight text-balance">
                {result.attack_type}
              </h2>

              <div className="mt-4 pt-4 border-t border-[#1B2436] flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-[#00E5FF] shrink-0 mt-1" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block text-[11px] font-mono text-[#64748B] mb-1 tracking-wider">
                    USER AWARENESS TAKEAWAY
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#E0E1F7] leading-relaxed">
                    {result.user_awareness_tip}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyAllIocs}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#06090F] text-[#00E5FF] border border-[#00E5FF]/60 hover:bg-[#00E5FF] hover:text-[#04141A] transition-colors cursor-pointer whitespace-nowrap"
              >
                {iocsCopied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>COPY ALL IOCs ({totalIocCount})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTicketOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-[#00E5FF] text-[#04141A] hover:bg-[#5CEEFF] shadow-[0_0_18px_rgba(0,229,255,0.28)] transition-all cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>GENERATE INCIDENT TICKET</span>
              </button>
            </div>
          </div>

          <RiskGauge score={result.risk_score} verdict={result.verdict} />
        </div>
      </section>

      {/* 2. URL & Redirect Inspector Card */}
      <section
        id="section-redirect"
        className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6"
        aria-label="URL and Redirect Inspector"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B2436]">
          <div className="flex items-center gap-2.5">
            <GitFork className="w-4 h-4 text-[#00E5FF] shrink-0" aria-hidden="true" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#00E5FF]">
              URL &amp; REDIRECT INSPECTOR
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${
              result.redirect_analysis.has_redirect
                ? 'text-[#FFB800] border-[#FFB800]/60 bg-[#FFB800]/10'
                : 'text-[#849396] border-[#1B2436] bg-[#06090F]'
            }`}
          >
            {result.redirect_analysis.has_redirect ? 'REDIRECT DETECTED' : 'NO REDIRECT CHAIN'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-[#06090F] border border-[#1B2436] rounded-lg p-4 min-w-0">
            <span className="block text-[11px] font-mono text-[#64748B] mb-1.5">
              VISIBLE URL (DEFANGED)
            </span>
            <p className="font-mono text-xs sm:text-[13px] text-[#E0E1F7] break-all leading-relaxed">
              {result.redirect_analysis.visible_url || 'None extracted'}
            </p>
          </div>

          <div className="bg-[#06090F] border border-[#1B2436] rounded-lg p-4 min-w-0">
            <span className="block text-[11px] font-mono text-[#64748B] mb-1.5">
              TRUE DESTINATION (DEFANGED)
            </span>
            <p className="font-mono text-xs sm:text-[13px] text-[#FFB800] break-all leading-relaxed">
              {result.redirect_analysis.true_destination || 'None extracted'}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-[15px] text-[#BAC9CC] leading-relaxed">
          {result.redirect_analysis.assessment}
        </p>
      </section>

      {/* 3. Command Decoder Card (visible when a command is detected) */}
      {result.decoded_command.command_present && (
        <section
          id="section-commands"
          className="hud-panel bg-[#0B101B] border border-[#FF2A5F]/50 rounded-xl p-5 sm:p-6"
          aria-label="Command Decoder"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B2436]">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-[#00E5FF] shrink-0" aria-hidden="true" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#00E5FF]">
                COMMAND DECODER
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold border text-[#FF2A5F] border-[#FF2A5F]/60 bg-[#FF2A5F]/15">
              DEOBFUSCATED PAYLOAD
            </span>
          </div>

          <div className="mt-4">
            <span className="block text-[11px] font-mono text-[#64748B] mb-1.5">
              OBFUSCATION TECHNIQUES SPOTTED
            </span>
            <p className="text-xs sm:text-sm font-mono text-[#E0E1F7] bg-[#06090F] border border-[#1B2436] rounded-lg p-3.5 break-words leading-relaxed">
              {result.decoded_command.obfuscation_spotted}
            </p>
          </div>

          {result.decoded_command.step_by_step.length > 0 && (
            <div className="mt-4">
              <span className="block text-[11px] font-mono text-[#64748B] mb-2">
                PLAIN-ENGLISH EXECUTION BREAKDOWN
              </span>
              <ol className="divide-y divide-[#1B2436] border border-[#1B2436] rounded-lg bg-[#06090F] overflow-hidden">
                {result.decoded_command.step_by_step.map((step, idx) => (
                  <li key={idx} className="flex items-baseline gap-3 px-4 py-3 text-sm">
                    <span className="font-mono text-xs font-bold text-[#00E5FF] tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-[#E0E1F7] break-words leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* 4. Red Flags & MITRE ATT&CK Cards */}
      <section
        id="section-forensics"
        className="grid grid-cols-1 xl:grid-cols-12 gap-5"
        aria-label="Red Flags and MITRE ATT&CK Mapping"
      >
        {/* Red Flags Card */}
        <div className="xl:col-span-7 hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1B2436]">
            <div className="flex items-center gap-2.5">
              <Flag className="w-4 h-4 text-[#FF2A5F] shrink-0" aria-hidden="true" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#FF2A5F]">
                RED FLAGS
              </h3>
            </div>
            <span className="text-xs font-mono text-[#849396] tabular-nums">
              {result.red_flags.length} {result.red_flags.length === 1 ? 'INDICATOR' : 'INDICATORS'}
            </span>
          </div>

          {result.red_flags.length === 0 ? (
            <p className="mt-4 text-sm text-[#849396]">
              No malicious or suspicious indicators were flagged in this artifact.
            </p>
          ) : (
            <div className="divide-y divide-[#1B2436] mt-2">
              {result.red_flags.map((flag, idx) => (
                <div
                  key={`${flag.indicator}-${idx}`}
                  className="py-3.5 hover:bg-[#101829] px-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-[#FF2A5F] tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-[15px] font-semibold text-[#E0E1F7] break-words">
                        {flag.indicator}
                      </h4>
                      <p className="mt-1 text-sm text-[#BAC9CC] leading-relaxed break-words">
                        {flag.why_it_matters}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MITRE ATT&CK Card */}
        <div className="xl:col-span-5 hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1B2436]">
            <div className="flex items-center gap-2.5">
              <Crosshair className="w-4 h-4 text-[#FFB800] shrink-0" aria-hidden="true" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#FFB800]">
                MITRE ATT&amp;CK
              </h3>
            </div>
            <span className="text-xs font-mono text-[#849396] tabular-nums">
              {result.mitre_attack.length} TTPs
            </span>
          </div>

          {result.mitre_attack.length === 0 ? (
            <p className="mt-4 text-sm text-[#849396]">No MITRE ATT&amp;CK techniques mapped.</p>
          ) : (
            <div className="divide-y divide-[#1B2436] mt-2">
              {result.mitre_attack.map((tech, idx) => (
                <div key={`${tech.technique_id}-${idx}`} className="py-3 flex items-start gap-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/50 shrink-0 tabular-nums">
                    {tech.technique_id}
                  </span>
                  <span className="text-sm text-[#E0E1F7] leading-snug">{tech.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. IOC Vault */}
      <section
        id="section-iocs"
        className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6"
        aria-label="IOC Vault"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B2436]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#00E5FF] shrink-0" aria-hidden="true" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#00E5FF]">
              IOC VAULT
            </h3>
            <span className="text-xs font-mono text-[#64748B] tabular-nums">
              ({totalIocCount} DEFANGED)
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyAllIocs}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#00E5FF] border border-[#00E5FF]/60 hover:bg-[#00E5FF] hover:text-[#04141A] transition-colors cursor-pointer whitespace-nowrap"
          >
            {iocsCopied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>COPY ALL IOCs</span>
              </>
            )}
          </button>
        </div>

        {totalIocCount === 0 ? (
          <p className="mt-4 text-sm text-[#849396]">No IOCs extracted from this artifact.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {iocGroups
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <div key={group.key} className="min-w-0">
                  <span className="block text-[11px] font-mono text-[#64748B] mb-1.5">
                    {group.label.toUpperCase()} ({group.items.length})
                  </span>
                  <ul className="divide-y divide-[#1B2436] border border-[#1B2436] rounded-lg bg-[#06090F] overflow-hidden">
                    {group.items.map((item, idx) => (
                      <li
                        key={`${item}-${idx}`}
                        className="px-3.5 py-2.5 font-mono text-xs text-[#E0E1F7] break-all select-all leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* 6. Containment Actions */}
      <section
        id="section-playbook"
        className="hud-panel bg-[#0B101B] border border-[#1B2436] rounded-xl p-5 sm:p-6"
        aria-label="Containment actions"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1B2436]">
          <div className="flex items-center gap-2.5">
            <ListChecks className="w-4 h-4 text-[#00E676] shrink-0" aria-hidden="true" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#00E676]">
              CONTAINMENT ACTIONS
            </h3>
          </div>
          <span className="text-xs font-mono text-[#849396] tabular-nums">
            {result.recommended_actions.length} STEPS
          </span>
        </div>

        {result.recommended_actions.length === 0 ? (
          <p className="mt-4 text-sm text-[#849396]">No containment actions required.</p>
        ) : (
          <ol className="divide-y divide-[#1B2436] mt-2">
            {result.recommended_actions.map((action, idx) => (
              <li key={idx} className="py-3.5 flex items-baseline gap-3 text-sm sm:text-[15px]">
                <span className="font-mono text-xs font-bold text-[#00E676] tabular-nums shrink-0">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="text-[#E0E1F7] leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <IncidentTicketModal
        isOpen={ticketOpen}
        onClose={() => setTicketOpen(false)}
        result={result}
      />
    </div>
  );
}
