// ─── Domain types ────────────────────────────────────────────────────────────
// These are the canonical types for Trustbound Airbag.
// Backend, hook, and UI all import from here — one source of truth.

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface RecipientInfo {
  address: string;
  hasOnChainHistory: boolean;
  label?: string;
}

export interface TransactionIntent {
  id: string;
  type: string;
  amount: string;
  destination: string;
  programName: string;
  programVerified: boolean;
  note?: string;
}

export interface RiskFinding {
  level: RiskLevel;
  reason: string;
}

export interface RiskAnalysis {
  txId: string;
  score: number; // 0–100
  level: RiskLevel;
  findings: RiskFinding[];
  summary: string;
}

export type UserDecision = "block" | "proceed";

export interface ProtectionResult {
  txId: string;
  status: "protected" | "proceeded";
  assetsSecured: string;
  message: string;
  detail: string;
}

// ─── UI async state ───────────────────────────────────────────────────────────
// Use this for any value that comes from an async operation (API call, etc.)

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
