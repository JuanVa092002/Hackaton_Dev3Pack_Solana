/**
 * @deprecated TRANSITIONAL SHIM — backward-compat only.
 *
 * This file is NOT a source of truth for types or mock data.
 * - Types  → lib/types/index.ts
 * - Mocks  → lib/mock/fixtures.ts
 * - API    → lib/api/client.ts
 *
 * Remove this file once all imports have been migrated.
 * Do not add new exports here.
 */

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface RiskFinding {
  level: RiskLevel;
  reason: string;
}

export const demoScenario = {
  intent: {
    type: "Token Transfer",
    amount: "12.5 SOL",
    destination: "7xK9...mR2p",
    program: "Unknown Program (unverified)",
    note: "Demo — simulated transaction",
  },
  risks: [
    { level: "HIGH" as RiskLevel, reason: "Destination has no on-chain history" },
    { level: "HIGH" as RiskLevel, reason: "Program is unverified and not audited" },
    { level: "MEDIUM" as RiskLevel, reason: "Amount exceeds typical user pattern" },
  ],
  score: 87,
  outcome: {
    message: "12.5 SOL secured and contained.",
    detail:
      "The transaction was intercepted before any chain interaction occurred. Your wallet and assets are fully intact.",
  },
};

export type Scenario = typeof demoScenario;

export interface StepProps {
  scenario: Scenario;
  onNext: () => void;
  onRestart: () => void;
}
