import os
import time
import asyncio
import httpx
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from apps.backend.app import calculate_risk_score

load_dotenv()
app = FastAPI(title="TrustBond Airbag Engine")

API_KEY = os.getenv("API_KEY")
API_KEY_X402 = os.getenv("API_KEY_X402")
HELIUS_URL = f"https://mainnet.helius-rpc.com/?api-key={API_KEY}"
RUGCHECK_URL = "https://api.rugcheck.xyz/v1/tokens/{}/report"
X402_URL = f"https://api.developer.coinbase.com/rpc/v1/base/{API_KEY_X402}"


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
        if not data:
            return {"is_new": True, "tx_count": 0}

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


def normalize_rugcheck(raw: dict) -> dict:
    """
    Maps RugCheck API response fields to the structure
    that calculate_risk_score() expects.
    """
    if not raw or not isinstance(raw, dict):
        return None

    # RugCheck returns score as "score" or nested under "tokenMeta"
    score = raw.get("score", 0) or raw.get("totalMarketLiquidity", 0)

    # RugCheck markets: list of market objects with lp info
    raw_markets = raw.get("markets", []) or []
    markets = []
    for m in raw_markets:
        if not isinstance(m, dict):
            continue
        lp_locked = (
            m.get("lp", {}).get("lpLockedPct", 0) > 0       # percentage locked
            or m.get("lp", {}).get("lpLocked", 0) > 0        # absolute locked
        )
        markets.append({
            "lp": {
                "lpLocked": 1 if lp_locked else 0            # normalize to int flag
            }
        })

    # RugCheck risks: already a list of {name, description, level, score}
    raw_risks = raw.get("risks", []) or []
    risks = []
    for r in raw_risks:
        if not isinstance(r, dict):
            continue
        risks.append({
            "name": r.get("name", ""),
            "level": r.get("level", ""),         # "danger" | "warn" | "good"
            "description": r.get("description", ""),
            "score": r.get("score", 0),
        })

    return {
        "score": score,
        "markets": markets,
        "risks": risks,
        # Pass through raw fields for the full_contract_data in response
        "tokenMeta": raw.get("tokenMeta", {}),
        "token": raw.get("token", {}),
        "creator": raw.get("creator", ""),
        "detectedAt": raw.get("detectedAt", ""),
    }

@app.get("/analyze/{target_address}")
async def analyze_production(target_address: str):  # ← single param, no token_mint
    async with httpx.AsyncClient() as client:
        tasks = [
            fetch_helius_data(target_address, client),
            fetch_rugcheck_data(target_address, client)  # ← always uses target_address
        ]
        results = await asyncio.gather(*tasks)

        wallet_data = results[0]
        raw_contract = results[1]

    contract_data = normalize_rugcheck(raw_contract) if raw_contract else None
    analysis = calculate_risk_score(wallet_data, contract_data)

    return {
        "status": "success",
        "data": {
            "address": target_address,
            **analysis,
            "contract_meta": {
                "token": contract_data.get("token", {}) if contract_data else None,
                "tokenMeta": contract_data.get("tokenMeta", {}) if contract_data else None,
                "creator": contract_data.get("creator", "") if contract_data else None,
                "detectedAt": contract_data.get("detectedAt", "") if contract_data else None,
            } if contract_data else None
        },
        "timestamp": int(time.time())
    }