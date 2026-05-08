"use client";

import { Shield, AlertTriangle, RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import type { AsyncState, ProtectionResult, TransactionIntent } from "@/lib/types";

interface DecisionStepProps {
  intent: TransactionIntent;
  riskScore: number;
  decisionStatus: AsyncState<ProtectionResult>;
  onActivateAirbag: () => void;
  onProceedDespiteRisk: () => void;
  onRestart: () => void;
}

export function DecisionStep({
  intent,
  riskScore,
  decisionStatus,
  onActivateAirbag,
  onProceedDespiteRisk,
  onRestart,
}: DecisionStepProps) {
  const isLoading = decisionStatus.status === "loading";
  const proceeded =
    decisionStatus.status === "success" && decisionStatus.data.status === "proceeded";

  // ── Error state ──────────────────────────────────────────────────────────
  if (decisionStatus.status === "error") {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-zinc-50">Something went wrong</h1>
          <p className="text-sm text-zinc-400">{decisionStatus.message}</p>
        </div>
        <button
          onClick={onActivateAirbag}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <Shield className="w-5 h-5" aria-hidden />
          Try again — Activate Airbag
        </button>
      </div>
    );
  }

  // ── Danger path: user proceeded despite warning ──────────────────────────
  if (proceeded) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-red-950 border border-red-900 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-50">Transaction executed</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            You proceeded despite a high-risk warning. This is the outcome Trustbound Airbag
            exists to prevent.
          </p>
        </div>
        <div className="w-full p-4 rounded-2xl bg-red-950/60 border border-red-900 text-sm text-red-300 text-left space-y-1">
          <p className="font-semibold">Risk accepted:</p>
          <p>
            {intent.amount} sent to an unverified destination with no on-chain history.
          </p>
        </div>
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <RotateCcw className="w-4 h-4" aria-hidden />
          Run demo again
        </button>
      </div>
    );
  }

  // ── Main decision screen ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-400">
          Your decision
        </p>
        <h1 className="text-2xl font-bold text-zinc-50">This transaction is dangerous</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Risk score{" "}
          <span className="text-red-400 font-semibold">{riskScore}/100</span> — activate
          the airbag to protect your {intent.amount}.
        </p>
      </div>

      {/* PRIMARY: Activate Airbag */}
      <button
        onClick={onActivateAirbag}
        disabled={isLoading}
        className="w-full flex flex-col items-center gap-1.5 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Spinner size="sm" className="border-emerald-700 border-t-emerald-200" />
            Activating…
          </div>
        ) : (
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Shield className="w-5 h-5" aria-hidden />
            Activate Airbag
          </div>
        )}
        <span className="text-emerald-200 text-sm font-normal">
          Block this transaction — keep funds safe
        </span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-700 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* SECONDARY: Proceed anyway — intentionally demoted */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onProceedDespiteRisk}
          disabled={isLoading}
          className="text-zinc-600 hover:text-zinc-500 disabled:opacity-40 text-sm underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Proceed anyway
        </button>
        <p className="text-xs text-zinc-700 text-center">
          I understand the risks. This cannot be undone.
        </p>
      </div>
    </div>
  );
}
