import { ArrowRight, Wallet } from "lucide-react";
import type { TransactionIntent } from "@/lib/types";

interface IntentStepProps {
  intent: TransactionIntent;
  onNext: () => void;
  onRestart: () => void;
}

export function IntentStep({ intent, onNext }: IntentStepProps) {
  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Transaction Request
        </p>
        <h1 className="text-2xl font-bold text-zinc-50">Review before you sign</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          A transaction is requesting your approval. Run a safety check first.
        </p>
      </div>

      {/* Transaction card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        {/* Amount row */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-zinc-400" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Sending</p>
              <p className="text-2xl font-bold text-zinc-50">{intent.amount}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">To</p>
            <p className="text-sm font-mono text-zinc-300">{intent.destination}</p>
          </div>
        </div>

        {/* Program row */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Via program</p>
            <p className="text-sm text-zinc-300 truncate">{intent.programName}</p>
          </div>
          {!intent.programVerified && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-900 shrink-0">
              UNVERIFIED
            </span>
          )}
        </div>
      </div>

      {/* Demo disclaimer */}
      {intent.note && (
        <p className="text-center text-xs text-zinc-700">{intent.note}</p>
      )}

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        Analyze Risk
        <ArrowRight className="w-5 h-5" aria-hidden />
      </button>
    </div>
  );
}
