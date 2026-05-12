use {
    anchor_lang::{solana_program::instruction::Instruction, InstructionData, ToAccountMetas},
    litesvm::LiteSVM,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_keypair::Keypair,
    solana_transaction::versioned::VersionedTransaction,
};

#[test]
fn test_initialize() {
    let program_id = trustbond_airbag::id();
    let payer = Keypair::new();
    let vault_keypair = Keypair::new(); 
    let mut svm = LiteSVM::new();
    
    // Cargamos el binario compilado
    let bytes = include_bytes!("../../../target/deploy/trustbond_airbag.so");
    svm.add_program(program_id, bytes).unwrap();
    
    // Fondos para pagar la creación de la cuenta
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();
    
    // Sincronizado con: pub fn initialize_vault
    let instruction = Instruction::new_with_bytes(
        program_id,
        &trustbond_airbag::instruction::InitializeVault {}.data(),
        trustbond_airbag::accounts::InitializeVault {
            vault_account: vault_keypair.pubkey(),
            owner: payer.pubkey(),
            system_program: anchor_lang::solana_program::system_program::ID,
        }.to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    
    // Firmamos con el payer (que paga) y el vault_keypair
    let tx = VersionedTransaction::try_new(
        VersionedMessage::Legacy(msg), 
        &[&payer, &vault_keypair]
    ).unwrap();

    let res = svm.send_transaction(tx);
    
    // Verificación
    assert!(res.is_ok(), "La transacción falló: {:?}", res.err());
}