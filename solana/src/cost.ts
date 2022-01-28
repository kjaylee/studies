//비용 계산.
import * as web3 from '@solana/web3.js';
(async () => {
    // Connect to cluster

    var wallet = web3.Keypair.generate();
    var connection = new web3.Connection(
        web3.clusterApiUrl('devnet'),
        'confirmed',
    );
    const recentBlockhash = await connection.getRecentBlockhash();

    const transaction = new web3.Transaction(
        {recentBlockhash: recentBlockhash.blockhash}
    ).add(
        web3.SystemProgram.transfer({fromPubkey: wallet.publicKey, toPubkey: wallet.publicKey, lamports: 10})
    );
    transaction.sign(wallet);
    console.log(
        `SOL transfer would cost: ${transaction.signatures.length * recentBlockhash.feeCalculator.lamportsPerSignature} lamports`
    );
    // SOL transfer would cost: 5000 lamports
})();