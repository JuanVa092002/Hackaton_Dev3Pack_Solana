import time

# Matrix
RISK_WEIGHTS = {
    "new_address": 12,
    "velocity": 5,
    "honeypot_trigger": 30,
    "suspicious_mint": 20,
    "unlocked_lp": 15
}

def calculate_risk_score(wallet_data: dict, contract_data: dict = None):
    """
    Motor de decisión del Airbag Protocol.
    Procesa datos crudos y devuelve el score y veredicto.
    """
    score = 0
    alerts = []
    is_honeypot = False

    # --- 1. Identity Logic ---
    if wallet_data.get("is_new"):
        score += RISK_WEIGHTS["new_address"]
        alerts.append("Section 1: New Address (<24h)")
    
    if wallet_data.get("tx_count", 0) > 15:
        score += RISK_WEIGHTS["velocity"]
        alerts.append("Section 2: High Transaction Velocity")

    # --- 2. Contract Logic ---
    if contract_data:
        rc_score = contract_data.get("score", 0)
        
        if rc_score > 500:
            score += RISK_WEIGHTS["suspicious_mint"]
            alerts.append("Section 3: Suspicious Mint Reputation")

        # Risk liquidez
        markets = contract_data.get("markets", [])
        lp_locked = any(m.get("lp", {}).get("lpLocked", 0) > 0 for m in markets)
        if not lp_locked:
            score += RISK_WEIGHTS["unlocked_lp"]
            alerts.append("CRITICAL: LP 100% Unlocked")

        # Technical Risks (Honeypot)
        risks = contract_data.get("risks", [])
        for risk in risks:
            name = risk.get("name", "")
            if any(x in name for x in ["Freeze Authority", "Transfer Hook", "Simulation", "Mint Authority"]):
                is_honeypot = True
                score += RISK_WEIGHTS["honeypot_trigger"]
                alerts.append(f"Honeypot Trigger: {name}")

    # --- 3. Trafic Light ---
    if score >= 50:
        verdict, semaphore = "AIRBAG_INTERCEPTION", "RED"
    elif score >= 20 or is_honeypot: 
        verdict, semaphore = "WARN_USER_VOICE", "YELLOW"
    else:
        verdict, semaphore = "ALLOW", "GREEN"

    return {
        "score": score,
        "semaphore": semaphore,
        "verdict": verdict,
        "details": {"honeypot_logic": is_honeypot, "alerts": list(set(alerts))}
    }