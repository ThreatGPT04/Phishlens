import { useEffect, useState } from 'react';
import { Check, Copy, FileText, X } from 'lucide-react';
import type { AnalysisResult } from '../types/phishlens';
import { formatIncidentTicket } from '../utils/defang';
import { VERDICT_THEME } from './RiskGauge';

interface IncidentTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export function IncidentTicketModal({ isOpen, onClose, result }: IncidentTicketModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setCopied(false);
  }, [isOpen, result]);

  if (!isOpen) return null;

  const ticketText = formatIncidentTicket(result);
  const theme = VERDICT_THEME[result.verdict];

  const handleCopyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticketText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incident-ticket-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] flex flex-col bg-[#0B101B] border border-[#1B2436] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#080C15] border-b border-[#1B2436]">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-[#00E5FF] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="incident-ticket-title"
                className="text-base font-semibold text-[#E0E1F7] truncate"
              >
                SOC Incident Ticket
              </h2>
              <p className="text-xs font-mono text-[#BAC9CC] truncate">
                {result.attack_type} ·{' '}
                <span style={{ color: theme.color }}>{result.verdict}</span> ({result.risk_score}/100)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyTicket}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono bg-[#00E5FF] text-[#04141A] rounded-lg hover:bg-[#9CF0FF] transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>COPY TICKET</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close incident ticket modal"
              className="p-2 text-[#BAC9CC] hover:text-[#E0E1F7] hover:bg-[#131C2E] border border-[#1B2436] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-[#060911]">
          <pre className="font-mono text-xs leading-relaxed text-[#E0E1F7] whitespace-pre-wrap break-words bg-[#06090F] border border-[#1B2436] rounded-lg p-4 select-all">
            {ticketText}
          </pre>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[#080C15] border-t border-[#1B2436] text-xs text-[#849396]">
          <span>All URLs, domains, and IPs inside this ticket are strictly defanged.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-[#E0E1F7] border border-[#1B2436] rounded-lg hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
