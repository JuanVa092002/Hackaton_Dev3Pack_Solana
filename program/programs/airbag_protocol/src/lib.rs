pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("HwH7yKX4copxVziXv1U9SxdR4m3FkE7PTEH4sa1Zpfcn");

#[program]
pub mod airbag_protocol {
    use super::*;

    // Creación del Vault PDA para el usuario
    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        instructions::initialize_vault::handler(ctx)
    }
}