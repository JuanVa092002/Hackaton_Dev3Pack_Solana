from fastapi import FastAPI
import requests
from backend.app import RISK_WEIGHTS

app = FastAPI(title="Airbag Protocol Risk Engine")

RUGCHECK_BASE = "https://api.rugcheck.xyz/v1"

# --- 0. STATS: WALLET ---

@app.get("/v1/creators/{wallet}")

def get_recent_tokens(wallet: str):
    """Returns aggregated rug-pull history for a creator wallet"""
    return requests.get(f"{RUGCHECK_BASE}/creators/{wallet}").json()

# --- 1. STATS: RECENT ---
@app.get("/v1/stats/new_tokens")
def get_recent_tokens():
    """Recently detected tokens"""
    return requests.get(f"{RUGCHECK_BASE}/stats/recent").json()

# --- 2. TOKENS: REPORT ---
@app.get("/v1/tokens/{id}/report")
def get_token_report(id: str):
    """Get full token report"""
    return requests.get(f"{RUGCHECK_BASE}/tokens/{id}/report").json()

# --- 3. TOKENS: INSIDER NETWORKS ---
@app.get("/v1/tokens/{id}/insiders/networks")
def get_token_networks(id: str):
    """Get token insider networks"""
    return requests.get(f"{RUGCHECK_BASE}/tokens/{id}/insiders/networks").json()

# --- 4. STATS: RUGS STREAM ---
@app.get("/v1/stats/rugs/stream")
def get_rug_stream():
    """SSE stream of live rug events for ticker"""
    return {"endpoint": f"{RUGCHECK_BASE}/stats/rugs/stream", "type": "SSE Stream"}

# --- 5. STATS: VERIFIED ---
@app.get("/v1/stats/verified")
def get_verified_tokens():
    """Recently verified tokens"""
    return requests.get(f"{RUGCHECK_BASE}/stats/verified").json()
