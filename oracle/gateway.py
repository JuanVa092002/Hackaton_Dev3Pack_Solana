import os
import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from dotenv import load_dotenv

# Importamos tu lógica de firma local
from .signer import send_risk_to_solana

load_dotenv()

app = FastAPI(title="TrustBond Airbag Professional Gateway")

# Configuramos el cliente HTTP global
ENGINE_BASE_URL = os.getenv("ENGINE_URL", "https://hackaton-dev3pack-solana.onrender.com")

@app.get("/protect/{target_address}")
async def protect_and_sign(
    target_address: str, 
    token_mint: str = Query(None, description="Mint del token sospechoso")
):
    """
    Consume el Engine, evalúa el semáforo y dispara el Airbag en Solana si hay riesgo.
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # CONSULTA AL ENGINE DE ANÁLISIS
        url = f"{ENGINE_BASE_URL}/analyze/{target_address}"
        params = {"token_mint": token_mint} if token_mint else {}
        
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            analysis_data = response.json()
        except Exception as e:
            # Si el Engine falla, entramos en Modo Preventivo (YELLOW)
            print(f"Engine Down o Error: {e}. Aplicando modo preventivo.")
            analysis_data = {
                "data": {
                    "semaphore": "YELLOW",
                    "score": 40,
                    "verdict": "ENGINE_ERROR_PREVENTIVE_MODE"
                }
            }

        # PROCESAMIENTO DE RESULTADOS
        # Extraemos los datos del campo 'data' del JSON del Engine
        data_payload = analysis_data.get("data", {})
        semaphore = data_payload.get("semaphore", "GREEN")
        score = data_payload.get("score", 0)

        # DISPARADOR DEL AIRBAG (Lógica On-Chain)
        tx_signature = None
        protection_active = False

        # Si es YELLOW o RED, el Airbag debe inflarse en la Blockchain
        if semaphore in ["RED", "YELLOW"]:
            print(f"ALERT: {semaphore} detected (Score: {score}). Triggering On-Chain Protection...")
            
            config_pda = os.getenv("CONFIG_PDA")
            if not config_pda:
                print("Error: CONFIG_PDA no definida en el archivo .env")
            else:
                # Llamada al signer.py
                tx_signature = await send_risk_to_solana(semaphore, config_pda)
                
                if tx_signature:
                    protection_active = True
                    print(f"Airbag Inflado con éxito. TX: {tx_signature}")
                else:
                    print("El Airbag no pudo inflarse (Revisa los logs del validador).")

        # RESPUESTA UNIFICADA PARA EL FRONTEND/CLI
        return {
            "address": target_address,
            "engine_analysis": data_payload,
            "airbag_status": {
                "is_protected": protection_active,
                "on_chain_signature": tx_signature,
                "mode": semaphore
            },
            "system": "TrustBond Airbag v1.0"
        }

if __name__ == "__main__":
    # Ejecución directa en puerto 8001
    uvicorn.run(app, host="0.0.0.0", port=8001)