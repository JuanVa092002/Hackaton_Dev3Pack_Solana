# Architecture Overview

Trustbound Airbag uses a simple monorepo with clear boundaries:

- `apps/web` owns frontend UX and API consumption contracts.
- `apps/backend` will own service endpoints and orchestration logic.
- `programs/airbag` will own on-chain program code.
- `security` owns testing, pentest, and audit artifacts.

## Design goals

- Separation of concerns by directory.
- Low cognitive load for new contributors.
- Easy parallel work across teams.
- Replaceable integration boundaries (frontend mock -> backend API).

## Ownership model

- Frontend changes should stay inside `apps/web`.
- Backend changes should stay inside `apps/backend`.
- On-chain changes should stay inside `programs/airbag`.
- Security documentation and checks should stay inside `security`.
