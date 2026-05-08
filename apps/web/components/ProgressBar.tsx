const STEP_LABELS = ["Intent", "Analysis", "Alert", "Decision", "Airbag", "Protected"];

const STEP_COLORS = [
  "bg-zinc-400",
  "bg-indigo-400",
  "bg-red-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-emerald-300",
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div
      className="w-full pt-6 pb-4"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}: ${STEP_LABELS[currentStep]}`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= currentStep ? STEP_COLORS[currentStep] : "bg-zinc-800"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500 mt-2 text-center tracking-widest uppercase">
        {STEP_LABELS[currentStep]}
      </p>
    </div>
  );
}
