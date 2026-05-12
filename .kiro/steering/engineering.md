# Engineering (steering)

**Intent**

Ship a minimal, explainable frontend MVP. No backend requirement until an approved batch says otherwise.

**Stack direction (not implemented until approved)**

Next.js, Tailwind CSS, shadcn/ui — chosen for speed and consistent mobile UI.

**Surfaces**

One responsive web UI: mobile browser and Telegram Mini App constraints treated as the same layout and flow.

**Solana**

Wallet Adapter–style integration only when a batch explicitly approves wallet wiring; until then, UI and simulated intents are enough.

**Principles**

Small modules, obvious file boundaries, no premature platform abstractions. Stable product text lives in `docs/context/`; session state in `docs/operations/handoff.md`.
