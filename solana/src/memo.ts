//비용 계산.
import {
    SystemProgram,
    Keypair,
    Connection,
    clusterApiUrl,
    TransactionInstruction,
    Transaction,
    PublicKey,
    sendAndConfirmTransaction
} from '@solana/web3.js';
(async () => {
    // Connect to cluster

    var fromKeypair = Keypair.generate();
    var toKeypair = Keypair.generate();
    var connection = new Connection(clusterApiUrl('devnet'), 'confirmed',);
    var airdropSignature = await connection.requestAirdrop(
        fromKeypair.publicKey,
        1000000,
    );
    await connection.confirmTransaction(airdropSignature);
    const transferTransaction = new Transaction()
        .add(
            SystemProgram.transfer({fromPubkey: fromKeypair.publicKey, toPubkey: toKeypair.publicKey, lamports: 5000})
        )
        .add(new TransactionInstruction({
            keys: [
                {
                    pubkey: fromKeypair.publicKey,
                    isSigner: true,
                    isWritable: true
                }
            ],
            data: Buffer.from('한글도 되냐?', 'utf-8'),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
        }))
    var signature = await sendAndConfirmTransaction(
        connection,
        transferTransaction,
        [fromKeypair]
    );
    console.log('SIGNATURE', signature);
})();