"use client";

import { useAirbagFlow } from "@/hooks/useAirbagFlow";
import { ProgressBar } from "./ProgressBar";
import { IntentStep } from "./steps/IntentStep";
import { AnalysisStep } from "./steps/AnalysisStep";
import { AlertStep } from "./steps/AlertStep";
import { DecisionStep } from "./steps/DecisionStep";
import { AirbagStep } from "./steps/AirbagStep";
import { ProtectedStep } from "./steps/ProtectedStep";

const TOTAL_STEPS = 6;

export function StepFlow() {
  const flow = useAirbagFlow();

  const protectionResult =
    flow.decisionStatus.status === "success" ? flow.decisionStatus.data : null;

  const riskData =
    flow.riskAnalysis.status === "success" ? flow.riskAnalysis.data : null;

  const steps = [
    <IntentStep
      key="intent"
      intent={flow.transactionIntent}
      onNext={flow.onNext}
      onRestart={flow.onRestart}
    />,
    <AnalysisStep
      key="analysis"
      riskAnalysis={flow.riskAnalysis}
      onNext={flow.onNext}
      onRestart={flow.onRestart}
    />,
    <AlertStep
      key="alert"
      riskData={riskData}
      onNext={flow.onNext}
      onRestart={flow.onRestart}
    />,
    <DecisionStep
      key="decision"
      intent={flow.transactionIntent}
      riskScore={riskData?.score ?? 87}
      decisionStatus={flow.decisionStatus}
      onActivateAirbag={flow.activateAirbag}
      onProceedDespiteRisk={flow.proceedDespiteRisk}
      onRestart={flow.onRestart}
    />,
    <AirbagStep
      key="airbag"
      intent={flow.transactionIntent}
      protectionResult={protectionResult}
      onNext={flow.onNext}
      onRestart={flow.onRestart}
    />,
    <ProtectedStep
      key="protected"
      protectionResult={protectionResult}
      onRestart={flow.onRestart}
    />,
  ];

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col">
      <div className="w-full max-w-[430px] mx-auto px-5 flex flex-col flex-1 pb-safe">
        <ProgressBar currentStep={flow.step} totalSteps={TOTAL_STEPS} />
        <div
          className={`flex-1 flex flex-col transition-all duration-200 ${
            flow.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {steps[flow.step]}
        </div>
      </div>
    </div>
  );
}
