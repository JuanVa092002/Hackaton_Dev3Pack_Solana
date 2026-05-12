import os
import json
import struct
import hashlib
import traceback
from solana.rpc.async_api import AsyncClient 
from solders.keypair import Keypair    
from solders.pubkey import Pubkey 
from solders.instruction import Instruction, AccountMeta
from solders.transaction import VersionedTransaction
from solders.message import MessageV0

# --- CONFIGURACIÓN ---
PROGRAM_ID = Pubkey.from_string(os.getenv("PROGRAM_ID", "CV6iCLpzwJxZReN6kvwdDVnZUmCNPL1cdGAr7tHzfBkR"))

async def send_risk_to_solana(status: str, config_pda_address: str):
    try:
        # Conexión al validador local
        client = AsyncClient("http://127.0.0.1:8899")
        
        # Cargar la Wallet
        wallet_path = os.path.expanduser("~/.config/solana/id.json")
        with open(wallet_path, "r") as f:
            keypair_data = json.load(f)
        payer = Keypair.from_bytes(bytes(keypair_data))
        
        # Calcular el Discriminador de Anchor para 'update_risk_status'
        sha = hashlib.sha256(b"global:update_risk_status").digest()
        discriminator = sha[:8]

        # Serializar el argumento (Enum RiskStatus)
        # Green=0, Yellow=1, Red=2
        status_map = {"Green": 0, "Yellow": 1, "Red": 2}
        status_val = status_map.get(status.capitalize(), 1) # Default Yellow
        data = discriminator + struct.pack("<B", status_val)

        # Configurar Cuentas
        config_pda = Pubkey.from_string(config_pda_address)
        accounts = [
            AccountMeta(pubkey=config_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=payer.pubkey(), is_signer=True, is_writable=False),
        ]

        # Construir la Transacción
        res = await client.get_latest_blockhash()
        blockhash = res.value.blockhash
        
        ix = Instruction(PROGRAM_ID, data, accounts)
        msg = MessageV0.try_compile(payer.pubkey(), [ix], [], blockhash)
        tx = VersionedTransaction(msg, [payer])

        print(f"Enviando Transacción Raw para status {status}...")
        
        response = await client.send_raw_transaction(bytes(tx))
        
        signature = response.value
        print(f"ÉXITO ON-CHAIN: {signature}")
        return str(signature)

    except Exception:
        print("ERROR EN EL SIGNER:")
        traceback.print_exc()
        return None