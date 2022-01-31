//시드 값을 이용한 계정 생성.
import * as web3 from '@solana/web3.js';

(async () => {
  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  // Generate a new wallet keypair and airdrop SOL
  //   var wallet = web3.Keypair.generate();
  var publicKey = new web3.PublicKey('Ee3LVnUz1v8FgejiNkzkzMtUHqEg1bsXo8zwkU7iabNm');
  console.log(`wallet address: ${ publicKey.toString()}`)
  const seed = "한글도 되냐?";
  let publicKeyBySeed = await web3.PublicKey.createWithSeed(publicKey, seed, web3.SystemProgram.programId);
  console.log(publicKeyBySeed.toString());

  var airdropSignature = await connection.requestAirdrop(
    publicKeyBySeed,
    web3.LAMPORTS_PER_SOL,
  );

  //wait for airdrop confirmation
  await connection.confirmTransaction(airdropSignature);

  // get account info
  // account data is bytecode that needs to be deserialized
  // serialization and deserialization is program specic
  let account = await connection.getAccountInfo(publicKeyBySeed);
  console.log(account);

})();

