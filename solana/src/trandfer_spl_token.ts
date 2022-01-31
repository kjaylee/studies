import * as web3 from '@solana/web3.js';
import * as spl from '@solana/spl-token';

(async () => {
  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  // Generate a new random public key
  var from = web3.Keypair.generate();
  var airdropSignature = await connection.requestAirdrop(
    from.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Generate a new random public key
  var to = web3.Keypair.generate();
  let fromAccount = await connection.getAccountInfo(from.publicKey);
  console.log(`from: ${fromAccount?.lamports}`);
   let toAccount = await connection.getAccountInfo(to.publicKey);
  console.log(`to: ${toAccount?.lamports}`);

  // Add token transfer instructions to transaction
const transaction = new web3.Transaction().add(
      spl.Token.createTransferInstruction(
      spl.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      from.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from],
  );
  console.log('SIGNATURE', signature);
  fromAccount = await connection.getAccountInfo(from.publicKey);
  console.log(`from: ${fromAccount?.lamports}`);
  toAccount = await connection.getAccountInfo(to.publicKey);
  console.log(`to: ${toAccount?.lamports}`);
})();