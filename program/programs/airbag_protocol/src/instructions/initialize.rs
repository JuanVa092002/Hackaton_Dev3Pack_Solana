use anchor_lang::prelude::*;
use crate::state::*;

pub fn handler(ctx: Context<InitializeVault>) -> Result<()> {
    let vault = &mut ctx.accounts.vault_account;
    vault.owner = *ctx.accounts.user.key;
    vault.balance = 0;
    vault.is_locked = false;
    vault.bump = ctx.bumps.vault_account; // Necesario para firmas firmadas por el programa (CPI)
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = VAULT_SPACE,
        // La semilla "vault" + la pubkey del user aseguran unicidad
        seeds = [b"vault", user.key().as_ref()], 
        bump
    )]
    pub vault_account: Account<'info, AirbagVault>,
    
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}