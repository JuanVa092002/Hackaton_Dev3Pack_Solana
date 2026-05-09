import os
import time
import asyncio
import httpx
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# calculate_risk_score import 
from apps.backend.app import calculate_risk_score

load_dotenv()

app = FastAPI(title="TrustBond Airbag Engine")

API_KEY = os.getenv("API_KEY")
HELIUS_URL = f"https://mainnet.helius-rpc.com/?api-key={API_KEY}"
RUGCHECK_URL = "https://api.rugcheck.xyz/v1/tokens/{}/report"

# CORS configuration
# Read comma-separated origins from CORS_ALLOWED_ORIGINS.
# In production set to the Vercel domain (e.g. https://hackaton-dev3-pack-solana.vercel.app).
# If empty, defaults to ["*"] which is allowed for local development only.
cors_allowed = os.getenv("CORS_ALLOWED_ORIGINS", "")
if cors_allowed:
    origins = [o.strip() for o in cors_allowed.split(",") if o.strip()]
else:
    # WARNING: wildcard is intended only for local development/testing.
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def fetch_helius_data(address: str, client: httpx.AsyncClient):
    payload = {
        "jsonrpc": "2.0", 
        "id": 1, 
        "method": "getSignaturesForAddress", 
        "params": [address, {"limit": 20}]
    }
    try:
        resp = await client.post(HELIUS_URL, json=payload)
        data = resp.json().get("result", [])
        if not data: return {"is_new": True, "tx_count": 0}
        
        first_tx = data[-1].get("blockTime", 0)
        is_new = (time.time() - first_tx) < 86400
        return {"is_new": is_new, "tx_count": len(data)}
    except:
        return {"is_new": False, "tx_count": 0}

async def fetch_rugcheck_data(token_mint: str, client: httpx.AsyncClient):
    try:
        resp = await client.get(RUGCHECK_URL.format(token_mint))
        return resp.json() if resp.status_code == 200 else None
    except:
        return None

@app.get("/analyze/{target_address}")
async def analyze_production(target_address: str, token_mint: str = None):
    async with httpx.AsyncClient() as client:
        # Running requests 
        tasks = [fetch_helius_data(target_address, client)]
        if token_mint:
            tasks.append(fetch_rugcheck_data(token_mint, client))
        
        results = await asyncio.gather(*tasks)
        
        wallet_data = results[0]
        contract_data = results[1] if len(results) > 1 else None

    # Pulling logic
    analysis = calculate_risk_score(wallet_data, contract_data)

    return {
        "status": "success",
        "data": {
            "address": target_address,
            **analysis
        },
        "timestamp": int(time.time())
    }