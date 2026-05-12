"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import type { AsyncState, RiskAnalysis, RiskFinding, RiskLevel } from "@/lib/types";

// Timing constants — tune here to adjust demo feel
const REVEAL_DELAYS_MS = [600, 1300, 2100];
const ANIMATION_DONE_MS = 3400; // when the stagger animation is "complete"

interface AnalysisStepProps {
  riskAnalysis: AsyncState<RiskAnalysis>;
  onNext: () => void;
  onRestart: () => void;
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    HIGH: "text-red-400 bg-red-950 border-red-900",
    MEDIUM: "text-amber-400 bg-amber-950 border-amber-900",
    LOW: "text-zinc-400 bg-zinc-800 border-zinc-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${styles[level]}`}>
      {level}
    </span>
  );
}

function RiskIcon({ level }: { level: RiskLevel }) {
  if (level === "HIGH")
    return <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden />;
  if (level === "MEDIUM")
    return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />;
  return <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" aria-hidden />;
}

export function AnalysisStep({ riskAnalysis, onNext }: AnalysisStepProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  // Stagger the finding reveals; mark animation as done after last delay
  useEffect(() => {
    const timers = REVEAL_DELAYS_MS.map((ms, i) =>
      setTimeout(() => setVisibleCount(i + 1), ms)
    );
    const done = setTimeout(() => setAnimationDone(true), ANIMATION_DONE_MS);
    return () => [...timers, done].forEach(clearTimeout);
  }, []);

  // Advance only when BOTH animation is done AND API has resolved (fast or slow)
  useEffect(() => {
    if (animationDone && riskAnalysis.status !== "loading") {
      onNextRef.current();
    }
  }, [animationDone, riskAnalysis.status]);

  const findings: RiskFinding[] =
    riskAnalysis.status === "success" ? riskAnalysis.data.findings : [];

  const isApiDone = riskAnalysis.status !== "loading" && riskAnalysis.status !== "idle";

  const scanLabel = (() => {
    if (isApiDone && animationDone) return `Analysis complete — ${findings.length} risks found`;
    if (visibleCount === 0) return "Initializing scan…";
    if (visibleCount === 1) return "Checking destination history…";
    if (visibleCount === 2) return "Verifying program authority…";
    return "Finalizing analysis…";
  })();

  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400">
          Risk Analysis
        </p>
        <h1 className="text-2xl font-bold text-zinc-50">Scanning transaction…</h1>
        <p className="text-zinc-400 text-sm">
          Checking destination, program, and transaction pattern.
        </p>
      </div>

      {/* Scanning status bar */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-950/50 border border-indigo-900/60">
        {riskAnalysis.status === "loading" ? (
          <Spinner size="sm" className="border-indigo-700 border-t-indigo-300" />
        ) : (
          <div className="flex gap-1 shrink-0" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        <p className="text-sm text-indigo-300 transition-all duration-300">{scanLabel}</p>
      </div>

      {/* Risk findings — appear progressively when data arrives */}
      <div className="space-y-3" aria-live="polite" aria-label="Risk findings">
        {(findings.length > 0 ? findings : Array(3).fill(null)).map((finding, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 ${
              i < visibleCount && finding
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            {finding && (
              <>
                <RiskIcon level={(finding as RiskFinding).level} />
                <p className="flex-1 text-sm text-zinc-200 leading-relaxed">
                  {(finding as RiskFinding).reason}
                </p>
                <RiskBadge level={(finding as RiskFinding).level} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
