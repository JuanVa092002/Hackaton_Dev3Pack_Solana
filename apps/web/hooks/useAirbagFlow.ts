"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { TransactionIntent, RiskAnalysis, ProtectionResult, AsyncState } from "@/lib/types";
import { getTransactionPreview, analyzeRisk, submitUserDecision } from "@/lib/api/client";
import { mockIntent } from "@/lib/mock/fixtures";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AirbagFlow {
  // Navigation state
  step: number;
  visible: boolean;

  // Domain state
  transactionIntent: TransactionIntent;
  riskAnalysis: AsyncState<RiskAnalysis>;
  decisionStatus: AsyncState<ProtectionResult>;

  // Actions — step components call these; the hook owns the logic
  onNext: () => void;        // advances from current step (context-aware)
  onRestart: () => void;     // resets to step 0
  activateAirbag: () => void;       // DecisionStep primary action
  proceedDespiteRisk: () => void;   // DecisionStep secondary action
}

const TRANSITION_MS = 180;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAirbagFlow(): AirbagFlow {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [transactionIntent, setTransactionIntent] = useState<TransactionIntent>(mockIntent);
  const [riskAnalysis, setRiskAnalysis] = useState<AsyncState<RiskAnalysis>>({ status: "idle" });
  const [decisionStatus, setDecisionStatus] = useState<AsyncState<ProtectionResult>>({
    status: "idle",
  });

  // Ref so callbacks always see the current step without stale closures
  const stepRef = useRef(step);
  stepRef.current = step;

  // Load transaction preview on mount (no-op if mock resolves before render)
  useEffect(() => {
    getTransactionPreview(null)
      .then(setTransactionIntent)
      .catch(() => {
        /* keep mockIntent default */
      });
  }, []);

  const goTo = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, TRANSITION_MS);
  }, []);

  // ── Step 0 → 1: kick off risk analysis and navigate to AnalysisStep ────────
  const startAnalysis = useCallback(async () => {
    setRiskAnalysis({ status: "loading" });
    goTo(1); // show AnalysisStep immediately; it animates while API resolves
    try {
      const result = await analyzeRisk(transactionIntent.id);
      setRiskAnalysis({ status: "success", data: result });
    } catch (err) {
      setRiskAnalysis({
        status: "error",
        message: err instanceof Error ? err.message : "Analysis failed. Try again.",
      });
    }
  }, [transactionIntent.id, goTo]);

  // ── Step 3 primary: block the transaction ────────────────────────────────
  const activateAirbag = useCallback(async () => {
    setDecisionStatus({ status: "loading" });
    try {
      const result = await submitUserDecision(transactionIntent.id, "block");
      setDecisionStatus({ status: "success", data: result });
      goTo(4); // AirbagStep
    } catch (err) {
      setDecisionStatus({
        status: "error",
        message: err instanceof Error ? err.message : "Could not activate. Try again.",
      });
    }
  }, [transactionIntent.id, goTo]);

  // ── Step 3 secondary: user accepts risk and proceeds ─────────────────────
  const proceedDespiteRisk = useCallback(async () => {
    setDecisionStatus({ status: "loading" });
    try {
      const result = await submitUserDecision(transactionIntent.id, "proceed");
      setDecisionStatus({ status: "success", data: result });
      // Stay on DecisionStep — it renders the danger-path UI based on decisionStatus
    } catch (err) {
      setDecisionStatus({
        status: "error",
        message: err instanceof Error ? err.message : "Action failed. Try again.",
      });
    }
  }, [transactionIntent.id]);

  // ── Context-aware onNext: each step just calls onNext() ──────────────────
  const onNext = useCallback(() => {
    switch (stepRef.current) {
      case 0: startAnalysis(); break;
      case 1: goTo(2); break; // AnalysisStep → AlertStep
      case 2: goTo(3); break; // AlertStep → DecisionStep
      case 4: goTo(5); break; // AirbagStep → ProtectedStep
      default: break;
    }
  }, [startAnalysis, goTo]);

  const onRestart = useCallback(() => {
    setStep(0);
    setVisible(true);
    setRiskAnalysis({ status: "idle" });
    setDecisionStatus({ status: "idle" });
  }, []);

  return {
    step,
    visible,
    transactionIntent,
    riskAnalysis,
    decisionStatus,
    onNext,
    onRestart,
    activateAirbag,
    proceedDespiteRisk,
  };
}
