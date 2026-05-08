
# --- Scoring Matrix
RISK_WEIGHTS = {
    "new_address_24h": 12,
    "sanctioned_wallet": 10,
    "unknown_reputation": 8,
    "drainer_pattern": 15,
    "malicious_contract": 10,
    "velocity_spike": 5,
    "fake_mint": 8,
    "low_liquidity": 7,
    "suspicious_mint": 5,
    "funds_from_mixer": 12,
    "unverified_bridge": 8
}

# --- 0. STATS: WALLET ---
'''
@app.get("/v1/creators/{wallet}")
def analyze_token(wallet: str):
    detected_flags = []
    honeypot_warning = False

    # 0. CHECK RUGCHECK
    try:
        rc_response = requests.get(f"{RUGCHECK_BASE}/creators/{wallet}")
        if rc_response.status_code == 200:
            data = rc_response.json()
            risks = data.get("ruggedTokens", [])
            
            # Mapeo de riesgos de RugCheck a tus puntos
            for r in risks:
                name = r.get("name", "").lower()
                # Ejemplo de cruce de datos:
                if "honeypot" in name: honeypot_warning = True
                if "liquidity" in name and "low" in name: detected_flags.append("low_liquidity")
                if "mint" in name and "suspicious" in name: detected_flags.append("suspicious_mint")
                if "rugged" in name: detected_flags.append("malicious_contract")
    except Exception:
        pass
'''