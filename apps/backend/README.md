# Backend (`apps/backend`)

This folder contains the FastAPI backend for Trustbound Airbag.

Local setup
-----------
1. Create and activate a virtual environment:
   - Unix/macOS:
     python3 -m venv .venv
     source .venv/bin/activate
   - Windows (PowerShell):
     python -m venv .venv
     .\\.venv\\Scripts\\Activate.ps1

2. Install dependencies:
   python -m pip install --upgrade pip
   pip install -r requirements.txt

3. Run locally:
   python -m uvicorn apps.backend.api:app --reload --host 0.0.0.0 --port 8000

Environment
-----------
Copy `.env.example` to `.env` and fill in:
- API_KEY: (optional) Helius RPC key for on-chain data
- CORS_ALLOWED_ORIGINS: comma-separated allowed origins (set to your Vercel origin)
- RUGCHECK_URL: optional
- LOG_LEVEL: info

Render deploy (recommended)
--------------------------
- Runtime: Python 3.11
- Build command (optional): pip install -r apps/backend/requirements.txt
- Start command: python -m uvicorn apps.backend.api:app --host 0.0.0.0 --port $PORT
- Environment variables to set in Render: API_KEY, CORS_ALLOWED_ORIGINS, RUGCHECK_URL, LOG_LEVEL

Notes
-----
- The frontend is deployed on Vercel at `https://hackaton-dev3-pack-solana.vercel.app`. If you switch the frontend to call this backend, set `NEXT_PUBLIC_API_BASE_URL` to the Render service URL.
- Do not commit secrets to repo. Use the platform's environment variable handling.
