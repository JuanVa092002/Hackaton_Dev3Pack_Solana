import { ShieldAlert, AlertCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import type { RiskAnalysis, RiskLevel } from "@/lib/types";

interface AlertStepProps {
  riskData: RiskAnalysis | null; // null while loading (edge case: slow real API)
  onNext: () => void;
  onRestart: () => void;
}

function RiskIcon({ level }: { level: RiskLevel }) {
  if (level === "HIGH")
    return <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden />;
  return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />;
}

export function AlertStep({ riskData, onNext }: AlertStepProps) {
  // Edge case: real API slower than animation. Show loading state until data arrives.
  if (!riskData) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 py-6">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Finalizing analysis…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-up">
      {/* Icon + title */}
      <div className="flex flex-col items-center text-center gap-4 pt-2">
        <div className="w-20 h-20 rounded-full bg-red-950 border border-red-900 flex items-center justify-center animate-pulse-glow">
          <ShieldAlert className="w-10 h-10 text-red-400" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-red-400 mb-1">
            Threat Detected
          </p>
          <h1 className="text-3xl font-bold text-zinc-50">High Risk</h1>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-red-950/60 border border-red-900">
        <p className="text-sm font-medium text-red-200">Risk score</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-red-400">{riskData.score}</span>
          <span className="text-sm text-red-700">/ 100</span>
        </div>
      </div>

      {/* Risk list */}
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Detected risks
        </p>
        {riskData.findings.map((finding, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <RiskIcon level={finding.level} />
            <p className="text-sm text-zinc-300 leading-relaxed">{finding.reason}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-50 hover:bg-white active:bg-zinc-100 text-zinc-950 font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 mt-auto"
      >
        Review your options
        <ChevronRight className="w-5 h-5" aria-hidden />
      </button>
    </div>
  );
}
