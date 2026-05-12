from solders.pubkey import Pubkey

# 1. Tu Program ID real
PROGRAM_ID = Pubkey.from_string("8TsiEnpehwgM9B5Rf4UoUM1wGsDd3A1DPDM5h6CCgQfB")

# 2. Semillas (Seeds)
# Si en tu Rust pusiste #[account(init, seeds = [b"config"], bump)]
# la semilla es b"config".
seeds = [b"config"]

# 3. Cálculo de la dirección
pda, bump = Pubkey.find_program_address(seeds, PROGRAM_ID)

print(f"\n--- INFORMACIÓN DE TU AIRBAG ---")
print(f"Program ID: {PROGRAM_ID}")
print(f"Config PDA: {pda}")
print(f"Bump:       {bump}")
print(f"--------------------------------\n")