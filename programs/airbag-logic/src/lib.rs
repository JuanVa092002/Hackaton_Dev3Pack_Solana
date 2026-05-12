#![allow(unexpected_cfgs)]
#![allow(clippy::diverging_sub_expression)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;
use trustbond_airbag::cpi::accounts::ManageVault;
use trustbond_airbag::program::AirbagProtocol;
use trustbond_airbag::VaultState;

declare_id!("CV6iCLpzwJxZReN6kvwdDVnZUmCNPL1cdGAr7tHzfBkR");

#[program]
pub mod airbag_logic {
    use super::*;

    /// Inicializa el motor de decisión con una autoridad de riesgo (FastAPI backend)
    pub fn initialize_logic(ctx: Context<InitializeLogic>, risk_authority: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.risk_authority = risk_authority;
        config.current_status = RiskStatus::Green;
        config.last_update = Clock::get()?.unix_timestamp;
        Ok(())
    }

    /// Actualiza el semáforo de riesgo. Solo el backend autenticado puede llamar aquí.
    pub fn update_risk_status(ctx: Context<UpdateRisk>, new_status: RiskStatus) -> Result<()> {
        let config = &mut ctx.accounts.config;
        
        require_keys_eq!(
            ctx.accounts.authority.key(), 
            config.risk_authority, 
            LogicError::UnauthorizedAuthority
        );

        config.current_status = new_status;
        config.last_update = Clock::get()?.unix_timestamp;
        
        msg!("Estado de riesgo actualizado a: {:?}", new_status);
        Ok(())
    }

    /// El "Guardián": Ejecuta la transferencia o desvía al Vault según el riesgo
    pub fn protect_transfer(ctx: Context<ExecuteSecurity>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        let risk_level = config.current_status;

        match risk_level {
            RiskStatus::Green => {
                // VERDE: Transferencia directa al destino original
                msg!("Seguridad Airbag: Nivel Verde. Ejecutando transferencia directa.");
                perform_transfer(
                    &ctx.accounts.user,
                    &ctx.accounts.destination_account,
                    amount
                )?;
            },
            
            RiskStatus::Yellow | RiskStatus::Red => {
                let reason = if risk_level == RiskStatus::Red { "NIVEL ROJO: Bloqueo Crítico" } else { "NIVEL AMARILLO: Desvío Preventivo" };
                msg!("Alerta: {}. Protegiendo fondos en Vault.", reason);

                // Mover fondos al Vault
                perform_transfer(
                    &ctx.accounts.user,
                    &ctx.accounts.vault_account.to_account_info(),
                    amount
                )?;

                // Disparar el Airbag vía CPI
                // Obtenemos la llave directamente del objeto del programa
                let cpi_program_id = ctx.accounts.airbag_vault_program.key(); 
                
                let cpi_accounts = ManageVault {
                    vault_account: ctx.accounts.vault_account.to_account_info(),
                    owner: ctx.accounts.user.to_account_info(), 
                };

                let cpi_ctx = CpiContext::new(cpi_program_id, cpi_accounts);
                
                // Para que el CPI sepa qué programa ejecutar, debemos incluirlo en el conjunto de cuentas de la instrucción.
                let cpi_ctx_with_accounts = cpi_ctx.with_remaining_accounts(vec![
                    ctx.accounts.airbag_vault_program.to_account_info()
                ]);

                trustbond_airbag::cpi::trigger_airbag(cpi_ctx_with_accounts)?;
                
                msg!("Fondos asegurados y Vault bloqueado satisfactoriamente.");
            },
        }
        Ok(())
    }
}

/// Función interna de transferencia segura (System Program CPI)
fn perform_transfer<'info>(from: &Signer<'info>, to: &AccountInfo<'info>, amount: u64) -> Result<()> {
    let ix = system_instruction::transfer(
        &from.key(), 
        &to.key(), 
        amount
    );

    invoke(
        &ix, 
        &[
            from.to_account_info(), 
            to.clone()
        ]
    )?;
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeLogic<'info> {
    #[account(init, payer = payer, space = 8 + Config::INIT_SPACE)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRisk<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteSecurity<'info> {
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Esta es la cuenta de destino proporcionada por el usuario
    /// Solo se utiliza para recibir una transferencia de SOL si el riesgo es "Green"
    /// El System Program valida la dirección durante la ejecución de la transferencia
    #[account(mut)]
    pub destination_account: UncheckedAccount<'info>, 

    /// CHECK: El vauult pertecene al usuario que firma?
    #[account(
        mut,
        constraint = vault_account.owner == user.key() @ LogicError::UnauthorizedVault
    )]
    pub vault_account: Account<'info, VaultState>,
    
    pub airbag_vault_program: Program<'info, AirbagProtocol>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub risk_authority: Pubkey,
    pub current_status: RiskStatus,
    pub last_update: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug, Default)]
pub enum RiskStatus {
    #[default] Green,
    Yellow,
    Red,
}

#[error_code]
pub enum LogicError {
    #[msg("La autoridad de riesgo no está autorizada para esta operación")]
    UnauthorizedAuthority,

    #[msg("El Vault no pertenece al usuario que firma")]
    UnauthorizedVault,
}