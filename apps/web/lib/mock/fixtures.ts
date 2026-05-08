// ─── Mock fixtures ────────────────────────────────────────────────────────────
// Single source of truth for demo data.
// lib/api/client.ts calls these functions.
// Swap delay or data here to tune the demo; do not scatter mock values elsewhere.

import type {
  RecipientInfo,
  TransactionIntent,
  RiskAnalysis,
  ProtectionResult,
  UserDecision,
} from "@/lib/types";

/** Adjust to control how realistic the loading states feel during demo. */
export const MOCK_DELAY_MS = 600;

const delay = (ms = MOCK_DELAY_MS) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Static fixtures ──────────────────────────────────────────────────────────

export const mockIntent: TransactionIntent = {
  id: "demo-tx-001",
  type: "Token Transfer",
  amount: "12.5 SOL",
  destination: "7xK9...mR2p",
  programName: "Unknown Program (unverified)",
  programVerified: false,
  note: "Demo — simulated transaction",
};

export const mockRecipient: RecipientInfo = {
  address: "7xK9...mR2p",
  hasOnChainHistory: false,
};

export const mockRiskAnalysis: RiskAnalysis = {
  txId: "demo-tx-001",
  score: 87,
  level: "HIGH",
  findings: [
    { level: "HIGH", reason: "Destination has no on-chain history" },
    { level: "HIGH", reason: "Program is unverified and not audited" },
    { level: "MEDIUM", reason: "Amount exceeds typical user pattern" },
  ],
  summary: "3 risks detected — high probability of malicious intent.",
};

export const mockProtectionResult: ProtectionResult = {
  txId: "demo-tx-001",
  status: "protected",
  assetsSecured: "12.5 SOL",
  message: "12.5 SOL secured and contained.",
  detail:
    "The transaction was intercepted before any chain interaction occurred. Your wallet and assets are fully intact.",
};

// ─── Async mock functions (called by lib/api/client.ts) ──────────────────────

export async function mockResolveRecipient(_address: string): Promise<RecipientInfo> {
  await delay();
  return mockRecipient;
}

export async function mockGetTransactionPreview(): Promise<TransactionIntent> {
  await delay();
  return mockIntent;
}

export async function mockAnalyzeRisk(_txId: string): Promise<RiskAnalysis> {
  await delay();
  return mockRiskAnalysis;
}

export async function mockSubmitUserDecision(
  _txId: string,
  decision: UserDecision
): Promise<ProtectionResult> {
  await delay(400);
  if (decision === "proceed") {
    return {
      ...mockProtectionResult,
      status: "proceeded",
      message: "Transaction executed despite high risk.",
      detail: "You accepted the risk. No containment was applied.",
    };
  }
  return mockProtectionResult;
}

export async function mockGetProtectionStatus(_txId: string): Promise<ProtectionResult> {
  await delay(200);
  return mockProtectionResult;
}
