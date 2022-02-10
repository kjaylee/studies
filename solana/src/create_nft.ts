import * as web3 from "@solana/web3.js";
import * as spl from '@solana/spl-token';

(async () => {
    //데브넷 연결점
    var connection = new web3.Connection(
      web3.clusterApiUrl('devnet'),
      'confirmed',
    );
    // Generate a new random public key
    var userKeypair = web3.Keypair.generate();
    var airdropSignature = await connection.requestAirdrop(
      userKeypair.publicKey,
      web3.LAMPORTS_PER_SOL,
    );
    //에어드랍 1솔
    await connection.confirmTransaction(airdropSignature);
    console.log(`User address: ${userKeypair.publicKey.toBase58()}`)
    // Create the Mint Account for the NFT
    const mintAccount = await spl.Token.createMint(
        connection,
        userKeypair,
        userKeypair.publicKey,
        null,
        0,
        spl.TOKEN_PROGRAM_ID
    );
    // Get/Create the Associated Account for the user to hold the NFT
    const userAssosciatedAccount =
        await mintAccount.getOrCreateAssociatedAccountInfo(
            userKeypair.publicKey
        );
    console.log(`AssociatedAccountInfo: ${JSON.stringify(userAssosciatedAccount)}`)
    // Mint 1 token to the user's associated account
    await mintAccount.mintTo(
        userAssosciatedAccount.address,
        userKeypair.publicKey,
        [],
        1
    );
    // Reset mint_authority to null from the user to prevent further minting
    await mintAccount.setAuthority(
        mintAccount.publicKey,
        null,
        "MintTokens",
        userKeypair.publicKey,
        []
    );
})();