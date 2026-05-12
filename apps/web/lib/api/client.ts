// ─── API client ───────────────────────────────────────────────────────────────
// These are the canonical async contracts between frontend and backend.
// TODAY: each function delegates to a mock in lib/mock/fixtures.ts.
// TO CONNECT REAL BACKEND: replace the mock call in each function with
//   a real fetch(). The function signature and return type do not change.
//   No other files need to be touched.

import type {
  RecipientInfo,
  TransactionIntent,
  RiskAnalysis,
  ProtectionResult,
  UserDecision,
} from "@/lib/types";

import {
  mockResolveRecipient,
  mockGetTransactionPreview,
  mockAnalyzeRisk,
  mockSubmitUserDecision,
  mockGetProtectionStatus,
} from "@/lib/mock/fixtures";

export async function resolveRecipient(address: string): Promise<RecipientInfo> {
  // TODO: replace with → return fetch(`/api/recipient/${address}`).then(r => r.json())
  return mockResolveRecipient(address);
}

export async function getTransactionPreview(
  _txData: unknown
): Promise<TransactionIntent> {
  // TODO: replace with → return fetch("/api/tx/preview", { method: "POST", body: JSON.stringify(_txData) }).then(r => r.json())
  return mockGetTransactionPreview();
}

export async function analyzeRisk(txId: string): Promise<RiskAnalysis> {
  // TODO: replace with → return fetch(`/api/risk/${txId}`).then(r => r.json())
  return mockAnalyzeRisk(txId);
}

export async function submitUserDecision(
  txId: string,
  decision: UserDecision
): Promise<ProtectionResult> {
  // TODO: replace with → return fetch(`/api/decision/${txId}`, { method: "POST", body: JSON.stringify({ decision }) }).then(r => r.json())
  return mockSubmitUserDecision(txId, decision);
}

export async function getProtectionStatus(txId: string): Promise<ProtectionResult> {
  // TODO: replace with → return fetch(`/api/protection/${txId}`).then(r => r.json())
  return mockGetProtectionStatus(txId);
}
