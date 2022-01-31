//시드 값을 이용한 계정 생성 후 전송.
import * as web3 from '@solana/web3.js';

(async () => {
  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  // Generate a new wallet keypair and airdrop SOL
  var wallet = web3.Keypair.generate();
  var airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);
  console.log(`wallet address: ${ wallet.publicKey.toString()}`)
  const seed = "한글도 되냐?";
  let publicKeyBySeed = await web3.PublicKey.createWithSeed(wallet.publicKey, seed, web3.SystemProgram.programId);
  console.log(publicKeyBySeed.toString());
  const tx = new web3.Transaction().add(
    web3.SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey, // funder
      newAccountPubkey: publicKeyBySeed,
      basePubkey: wallet.publicKey,
      seed: seed,
      lamports: 0.1 * web3.LAMPORTS_PER_SOL,
      space: 0,
      programId: web3.SystemProgram.programId,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: publicKeyBySeed,
      basePubkey: wallet.publicKey,
      toPubkey: web3.Keypair.generate().publicKey, // create a random receiver
      lamports: 0.01 * web3.LAMPORTS_PER_SOL,
      seed: seed,
      programId: web3.SystemProgram.programId,
    })
  );
  
  console.log(`txhash: ${await web3.sendAndConfirmTransaction(connection, tx, [wallet, wallet])}`);
  let account = await connection.getAccountInfo(publicKeyBySeed);
  console.log(account);

})();

