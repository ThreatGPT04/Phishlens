import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { Verdict } from '../types/phishlens';

interface RiskGaugeProps {
  score: number;
  verdict: Verdict;
}

export const VERDICT_THEME: Record<
  Verdict,
  {
    color: string;
    bgTint: string;
    border: string;
    badgeLabel: string;
    severityLabel: string;
  }
> = {
  Malicious: {
    color: '#FF2A5F',
    bgTint: 'bg-[#FF2A5F]/15',
    border: 'border-[#FF2A5F]/70',
    badgeLabel: 'Red Flag (Malicious)',
    severityLabel: 'HIGH / CRITICAL',
  },
  Suspicious: {
    color: '#FFB800',
    bgTint: 'bg-[#FFB800]/15',
    border: 'border-[#FFB800]/70',
    badgeLabel: 'Amber Flag (Suspicious)',
    severityLabel: 'MEDIUM / REVIEW',
  },
  'Likely Safe': {
    color: '#00E676',
    bgTint: 'bg-[#00E676]/15',
    border: 'border-[#00E676]/70',
    badgeLabel: 'Green Flag (Likely Safe)',
    severityLabel: 'LOW / BENIGN',
  },
};

export function VerdictIcon({ verdict, className }: { verdict: Verdict; className?: string }) {
  if (verdict === 'Malicious') {
    return <ShieldAlert className={className} aria-hidden="true" />;
  }
  if (verdict === 'Suspicious') {
    return <AlertTriangle className={className} aria-hidden="true" />;
  }
  return <ShieldCheck className={className} aria-hidden="true" />;
}

export function RiskGauge({ score, verdict }: RiskGaugeProps) {
  const clampedTarget = Math.max(0, Math.min(100, Math.round(score)));
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayScore(clampedTarget);
      return;
    }

    let frameId = 0;
    const duration = 680;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * clampedTarget));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setDisplayScore(0);
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [clampedTarget, verdict]);

  const theme = VERDICT_THEME[verdict];
  const radius = 58;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (displayScore / 100) * circumference;

  const totalSegments = 20;
  const activeSegments = Math.round((displayScore / 100) * totalSegments);

  return (
    <div className="flex flex-col items-center justify-center bg-[#06090F] border border-[#1B2436] rounded-lg p-5 w-full md:w-[236px] shrink-0">
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#849396] mb-2">
        <span>THREAT METER</span>
        <span className="tabular-nums font-bold" style={{ color: theme.color }}>
          {displayScore}/100
        </span>
      </div>

      <div className="relative w-[160px] h-[94px] flex items-end justify-center">
        <svg
          viewBox="0 0 140 84"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Risk score ${clampedTarget} out of 100 (${verdict})`}
        >
          <path
            d="M 12 72 A 58 58 0 0 1 128 72"
            fill="none"
            stroke="#161E2E"
            strokeWidth="11"
            strokeLinecap="butt"
          />
          <path
            d="M 12 72 A 58 58 0 0 1 128 72"
            fill="none"
            stroke="#06090F"
            strokeWidth="13"
            strokeDasharray="2 7.1"
          />
          <path
            d="M 12 72 A 58 58 0 0 1 128 72"
            fill="none"
            stroke={theme.color}
            strokeWidth="11"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 6px ${theme.color}66)`,
            }}
          />
        </svg>

        <div className="absolute bottom-0 flex flex-col items-center">
          <span
            className="text-4xl font-bold font-mono tabular-nums tracking-tight leading-none"
            style={{ color: theme.color }}
          >
            {displayScore}
          </span>
          <span className="text-[10px] font-mono text-[#849396] mt-1 tracking-wider">
            RISK SCORE
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-20 gap-[2px] mt-4" aria-hidden="true">
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isLit = idx < activeSegments;
          return (
            <div
              key={idx}
              className="h-2 transition-colors duration-150"
              style={{
                backgroundColor: isLit ? theme.color : '#161E2E',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
