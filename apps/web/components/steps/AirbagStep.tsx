import { ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import type { TransactionIntent, ProtectionResult } from "@/lib/types";

interface AirbagStepProps {
  intent: TransactionIntent;
  protectionResult: ProtectionResult | null;
  onNext: () => void;
  onRestart: () => void;
}

export function AirbagStep({ intent, protectionResult, onNext }: AirbagStepProps) {
  const contained = [
    `${protectionResult?.assetsSecured ?? intent.amount} never left your wallet`,
    "No chain interaction occurred",
    "Destination flagged for future protection",
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center animate-fade-up">
      {/* Wow icon */}
      <div className="pt-4">
        <div className="w-32 h-32 rounded-full bg-emerald-950 border-2 border-emerald-800 flex items-center justify-center animate-pop-in">
          <ShieldCheck
            className="w-16 h-16 text-emerald-400 animate-shield-pulse"
            aria-hidden
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
          Deployed
        </p>
        <h1 className="text-3xl font-bold text-zinc-50">Airbag Activated</h1>
        <p className="text-zinc-300 text-base">Transaction intercepted before execution.</p>
      </div>

      {/* Containment summary */}
      <div className="w-full rounded-2xl bg-emerald-950/40 border border-emerald-900/60 p-4 space-y-3 text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald-500">
          Contained
        </p>
        {contained.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm text-emerald-200">{item}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        See protection summary
        <ChevronRight className="w-5 h-5" aria-hidden />
      </button>
    </div>
  );
}
