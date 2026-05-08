from fastapi import FastAPI, Request
import requests
from apps.backend.app import RISK_WEIGHTS
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

app = FastAPI(title="Airbag Protocol Risk Engine")

HELIUS_RPC = f"https://mainnet.helius-rpc.com/?api-key={API_KEY}"

# --- 0. STATS: WALLET ---
@app.post("/") 
async def proxy_helius_rpc(request: Request):
    """
    Este endpoint recibe EXACTAMENTE el mismo JSON que el curl de la documentación
    y lo reenvía a Helius.
    """
    # 1. Obtenemos el cuerpo JSON que viene en la petición (el -d del curl)
    payload = await request.json()
    
    # 2. Definimos las cabeceras (-H del curl)
    headers = {"Content-Type": "application/json"}
    
    # 3. Ejecutamos la petición POST (-X POST del curl)
    response = requests.post(HELIUS_RPC, json=payload, headers=headers)
    
    return response.json()
        