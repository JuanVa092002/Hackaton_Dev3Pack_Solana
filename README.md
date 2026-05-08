# Trustbound Airbag Monorepo

This repository is organized as a local-first monorepo so teams can work in parallel without mixing concerns.

Core loop: `Intent -> Risk Analysis -> Alert -> Decision -> Containment`

## Top-level structure

- `apps/web` - mobile-first Next.js frontend demo
- `apps/backend` - backend service area (empty scaffold)
- `programs/airbag` - on-chain program area (empty scaffold)
- `security` - testing, pentest, and audit workspace
- `docs` - product/context/architecture/API/operations/security docs
- `scripts` - local automation scripts by lifecycle
- `.github/workflows` - CI workflow definitions

## Quick start (web app)

```bash
cd apps/web
npm install
npm run dev
```

## Team rule of thumb

Keep frontend, backend, on-chain, and security work isolated in their own areas. Add integration points through clear contracts, not cross-folder business logic.
