# API Contracts (Frontend-First)

Current frontend contract functions live in `apps/web/lib/api/client.ts`.

Defined contracts:

- `resolveRecipient`
- `getTransactionPreview`
- `analyzeRisk`
- `submitUserDecision`
- `getProtectionStatus`

## Current state

- Mock-backed in `apps/web/lib/mock/fixtures.ts`.
- No network requests yet.

## Backend integration rule

When backend is ready, replace mock calls in `apps/web/lib/api/client.ts` with real HTTP calls.
Do not rewrite UI components for API wiring.
