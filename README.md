# Trustbound Airbag Monorepo

This repository is organized as a local-first monorepo so teams can work in parallel without mixing concerns.

Core loop: `Intent -> Risk Analysis -> Alert -> Decision -> Containment`

## Top-level structure

- `apps/web` - mobile-first Next.js frontend demo
- `apps/backend` - FastAPI risk-analysis backend
- `programs/trustbond-airbag` - on-chain Anchor program (main)
- `programs/airbag-logic` - on-chain Anchor program (logic module)
- `oracle/` - Python oracle/gateway tooling for on-chain interaction
- `migrations/` - Anchor deploy migrations
- `security` - testing, pentest, and audit workspace
- `docs` - product/context/architecture/API/operations/security docs
- `scripts` - local automation scripts by lifecycle
- `.github/workflows` - CI workflow definitions

## Quick start

### Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

### Backend (FastAPI)

```bash
cd apps/backend
pip install -r requirements.txt
python main.py
```

### On-chain programs (Anchor/Rust)

```bash
anchor build
anchor test
```

## Team rule of thumb

Keep frontend, backend, on-chain, and security work isolated in their own areas. Add integration points through clear contracts, not cross-folder business logic.
