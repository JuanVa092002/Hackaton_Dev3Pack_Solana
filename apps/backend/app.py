import time
import random

def calculate_risk_score(wallet_data: dict, contract_data: dict = None):
    score = 0
    alerts = []
    is_honeypot = False
    critical_terms = ["freeze authority", "transfer hook", "simulation", "mint authority", "rugged"]
    highest_detected_level = None

    if not isinstance(wallet_data, dict):
        wallet_data = {}

    # --- 1. WALLET EVALUATION ---
    if wallet_data.get("is_new"):
        highest_detected_level = "warn"

    if wallet_data.get("tx_count", 0) > 15:
        if highest_detected_level is None:
            highest_detected_level = "good"

    # --- 2. CONTRACT EVALUATION ---
    if contract_data and isinstance(contract_data, dict):

        # A. Score threshold → warn
        if contract_data.get("score", 0) > 500:
            if highest_detected_level != "danger":
                highest_detected_level = "warn"

        # B. LP locked check → danger if not locked
        markets = contract_data.get("markets") or []
        lp_locked = any(
            isinstance(m, dict) and m.get("lp", {}).get("lpLocked", 0) > 0
            for m in markets
        )
        if not lp_locked:
            highest_detected_level = "danger"

    # C. Risks list processing FIRST
        risks_list = contract_data.get("risks") or []

        if isinstance(risks_list, list):
            if len(risks_list) == 0:
                # Empty risks [] → explicitly Good
                highest_detected_level = "good"  # ← Remove the None guard here
            else:
                for risk in risks_list:
                    if not isinstance(risk, dict):
                        continue

                    risk_name = risk.get("name", "")
                    if risk_name:
                        alerts.append(risk_name)

                    level = str(risk.get("level", "")).lower()
                    name_lower = risk_name.lower()

                    if any(term in name_lower for term in critical_terms):
                        is_honeypot = True
                        highest_detected_level = "danger"

                    if level == "danger":
                        highest_detected_level = "danger"
                    elif level == "warn" and highest_detected_level != "danger":
                        highest_detected_level = "warn"
                    elif level == "good" and highest_detected_level is None:
                        highest_detected_level = "good"

        # A. Score threshold → warn (only if risks didn't resolve level)
        if contract_data.get("score", 0) > 500:
            if highest_detected_level not in ("danger", "good"):
                highest_detected_level = "warn"

        # B. LP locked check → danger only if risks were empty or non-danger
        markets = contract_data.get("markets") or []
        lp_locked = any(
            isinstance(m, dict) and m.get("lp", {}).get("lpLocked", 0) > 0
            for m in markets
        )
        if not lp_locked and highest_detected_level != "good":
            highest_detected_level = "danger"

    # --- 3. SCORE BY RANGE ---
    if highest_detected_level == "danger":
        score = random.randint(50, 100)
    elif highest_detected_level == "warn":
        score = random.randint(20, 49)
    else:
        score = random.randint(1, 19)

    # --- 4. VERDICT ---
    if score >= 50:
        verdict, semaphore = "AIRBAG_INTERCEPTION", "RED"
    elif score >= 20:
        verdict, semaphore = "WARN_USER_VOICE", "YELLOW"
    else:
        verdict, semaphore = "ALLOW", "GREEN"

    return {
        "score": score,
        "semaphore": semaphore,
        "verdict": verdict,
        "details": {
            "level": highest_detected_level,
            "honeypot_logic": is_honeypot,
            "alerts": list(set(alerts))
        }
    }