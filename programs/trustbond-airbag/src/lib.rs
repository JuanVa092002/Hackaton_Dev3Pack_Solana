use anchor_lang::prelude::*;

declare_id!("5fk7R9F74oa8wGkCRX25XfK93B68FkMyah2SzLm3i8GJ");

#[program]
pub mod airbag_protocol {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault_account;
        vault.owner = *ctx.accounts.owner.key;
        vault.is_locked = false;
        Ok(())
    }

    pub fn trigger_airbag(ctx: Context<ManageVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault_account;
        require!(vault.owner == *ctx.accounts.owner.key, AirbagError::Unauthorized);
        vault.is_locked = true;
        msg!("AIRBAG DISPARADO: Vault Bloqueado");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    // Usamos VaultState::INIT_SPACE para que Anchor calcule el tamaño (8 para el discriminador + datos)
    #[account(init, payer = owner, space = 8 + VaultState::INIT_SPACE)]
    pub vault_account: Account<'info, VaultState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageVault<'info> {
    #[account(mut)]
    pub vault_account: Account<'info, VaultState>,
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)] // <-- Calcula automáticamente el espacio de cada campo
pub struct VaultState {
    pub owner: Pubkey,   // 32 bytes
    pub is_locked: bool, // 1 byte
}

#[error_code]
pub enum AirbagError {
    #[msg("No tienes permisos para esta acción")]
    Unauthorized,
    #[msg("El Vault está bloqueado por el Airbag")]
    VaultLocked, 
}