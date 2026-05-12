import { CheckCircle2, Lock, RotateCcw } from "lucide-react";
import type { ProtectionResult } from "@/lib/types";
import { mockProtectionResult } from "@/lib/mock/fixtures";

interface ProtectedStepProps {
  protectionResult: ProtectionResult | null;
  onRestart: () => void;
}

export function ProtectedStep({ protectionResult, onRestart }: ProtectedStepProps) {
  // Fall back to mock if result not yet available (should not happen in normal flow)
  const result = protectionResult ?? mockProtectionResult;

  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 pt-2">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center">
          <Lock className="w-8 h-8 text-emerald-400" aria-hidden />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Funds Protected</h1>
          <p className="text-emerald-400 font-semibold mt-1">Successfully</p>
        </div>
      </div>

      {/* Protection summary */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm font-medium text-zinc-200">Assets secured</p>
          </div>
          <p className="text-sm font-bold text-emerald-400">{result.assetsSecured}</p>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm font-medium text-zinc-200">Chain activity</p>
          </div>
          <p className="text-sm font-bold text-zinc-500">None</p>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm font-medium text-zinc-200">Wallet status</p>
          </div>
          <p className="text-sm font-bold text-emerald-400">Intact</p>
        </div>
      </div>

      {/* Reassurance quote */}
      <div className="px-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <p className="text-sm text-zinc-400 leading-relaxed text-center italic">
          &ldquo;{result.detail}&rdquo;
        </p>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 mt-auto"
      >
        <RotateCcw className="w-4 h-4" aria-hidden />
        Run demo again
      </button>
    </div>
  );
}
