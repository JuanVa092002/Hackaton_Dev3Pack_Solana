use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AirbagVault {
    pub owner: Pubkey,
    pub balance: u64,
    pub bump: u8,
    pub is_locked: bool,
}

// Usamos un bloque const para que el compilador calcule el espacio de forma segura
pub const VAULT_SPACE: usize = 8usize.saturating_add(AirbagVault::INIT_SPACE);