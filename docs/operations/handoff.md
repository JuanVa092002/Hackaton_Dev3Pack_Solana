# Handoff

## Current objective

Frontend MVP is API-ready and Telegram-safe. Next step: connect a real backend or add
Telegram Mini App SDK packaging.

## Current state

Batch 4 complete. Clean build (Next.js 16.2.6, exit 0).

Architecture layers are separated:
- `lib/types/index.ts` — canonical types
- `lib/mock/fixtures.ts` — all demo data + async mock functions
- `lib/api/client.ts` — 5 API contracts (mock-backed, swap-ready)
- `hooks/useAirbagFlow.ts` — flow orchestration + AsyncState
- `components/StepFlow.tsx` + all step components — pure UI, typed props
- `lib/scenarios.ts` — deprecated shim, remove after cleanup

## How to run

```
npm run dev
```

Open `http://localhost:3000` in a mobile browser or resize to ~430 px wide.

## Next batch options

**A — Telegram packaging:** add `@telegram-apps/sdk-react`, init the Telegram Mini App,
theme CSS variables from `window.Telegram.WebApp.themeParams`.

**B — Backend connection:** implement the 5 real API routes in `app/api/`, remove mock
from `lib/api/client.ts`.

**C — Polish pass:** error boundary, haptic-style button press feedback, real device test.

## Open risks

- `lib/scenarios.ts` shim still exists — delete it after confirming no remaining imports.
- `AnalysisStep` advances only after API + animation both done; if real API is very slow
  (>3.4s) the scan animation loops visually. Acceptable for demo; revisit before prod.
- No error boundary wrapping `StepFlow` yet.

## Files in focus

- `lib/api/client.ts` — swap mock for real fetch here (one file, zero UI changes)
- `hooks/useAirbagFlow.ts` — add Telegram context or wallet state here when needed
- `lib/mock/fixtures.ts` — tune `MOCK_DELAY_MS` to adjust demo loading feel
