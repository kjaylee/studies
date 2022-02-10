import * as web3 from '@solana/web3.js';
import * as spl from '@solana/spl-token';

(async () => {
    var connection = new web3.Connection(
        web3.clusterApiUrl('devnet'),
        'confirmed',
    );
    var feePayer = web3
        .Keypair
        .generate();
    var airdropSignature = await connection.requestAirdrop(
        feePayer.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
    var mint = web3
        .Keypair
        .generate();
    var alice = web3
        .Keypair
        .generate();
    var bob = web3
        .Keypair
        .generate();
    // generate a new keypair for token account
    const tokenAccount = web3
        .Keypair
        .generate();
    console.log(`feePayer account: ${feePayer.publicKey.toBase58()}`);
    console.log(`mint account: ${mint.publicKey.toBase58()}`);
    console.log(`alice account: ${alice.publicKey.toBase58()}`);
    console.log(`bob account: ${bob.publicKey.toBase58()}`);
    console.log(`token account: ${tokenAccount.publicKey.toBase58()}`);
    // calculate ATA
    let ata = await spl.Token.getAssociatedTokenAddress(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mint.publicKey, // mint
        bob.publicKey // owner
    );
    console.log(`ATA: ${ata.toBase58()}`);
    let tx = new web3
        .Transaction()
        .add(
            // create mint account
            web3.SystemProgram.createAccount({
                fromPubkey: feePayer.publicKey,
                newAccountPubkey: mint.publicKey,
                space: spl.MintLayout.span,
                lamports: await spl
                    .Token
                    .getMinBalanceRentForExemptMint(connection),
                programId: spl.TOKEN_PROGRAM_ID
            }),
            // init mint account
            spl.Token.createInitMintInstruction(
                spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mint.publicKey, // mint pubkey
                8, // decimals
                alice.publicKey,// mint authority
                alice.publicKey // freeze authority (if you don't need it, you can set `null`)
            ),
            // create token account
            web3.SystemProgram.createAccount({
                fromPubkey: feePayer.publicKey,
                newAccountPubkey: tokenAccount.publicKey,
                space: spl.AccountLayout.span,
                lamports: await spl.Token.getMinBalanceRentForExemptAccount(connection),
                programId: spl.TOKEN_PROGRAM_ID,
            }),
            // init mint account
            spl.Token.createInitAccountInstruction(
                spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mint.publicKey, // mint
                tokenAccount.publicKey, // token account
                alice.publicKey // owner of token account
            ),
            spl.Token.createAssociatedTokenAccountInstruction(
                spl.ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
                spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mint.publicKey, // mint
                ata, // ata
                bob.publicKey, // owner of token account
                feePayer.publicKey // fee payer
            ),
            spl.Token.createMintToInstruction(
                spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mint.publicKey, // mint
                tokenAccount.publicKey, // receiver (sholud be a token account)
                alice.publicKey, // mint authority
                [], // only multisig account will use. leave it empty now.
                1e8 // amount. if your decimals is 8, you mint 10^8 for 1 token.
            ),
            spl.Token.createTransferCheckedInstruction(
                spl.TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                tokenAccount.publicKey, // from (should be a token account)
                mint.publicKey, // mint
                ata, // to (should be a token account)
                alice.publicKey, // owner of from
                [], // for multisig account, leave empty.
                1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
                8 // decimals
            )
        );
    console.log(
        `txhash: ${await connection.sendTransaction(tx, [feePayer, mint, feePayer, tokenAccount, feePayer, feePayer, alice, feePayer, alice])}`
    );
    // 1. use getParsedAccountInfo
    {
    let accountInfo = await connection.getParsedAccountInfo(mint.publicKey);
    console.log(
        `getParsedAccountInfo: ${JSON.stringify(accountInfo)}`
    );
    }

    // 2. use getAccountInfo then deserialize data
    {
    let accountInfo = await connection.getAccountInfo(mint.publicKey);
    console.log(
        `getAccountInfo: ${accountInfo}`
    );
    }
})();
