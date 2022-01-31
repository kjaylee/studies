//pda 생성.
import { PublicKey, Keypair} from "@solana/web3.js";

(async () => {
  const programId = new PublicKey('G1DCNUQTSGHehwdLCAmRyAG8hf51eCHrLNUqkgGKYASj');
  const seed = "test";
  console.log(`programId publicKey = ${programId.toString()}`);
  let originalPda = await PublicKey.createProgramAddress([Buffer.from(seed)], programId);
  console.log(`originalPda publicKey = ${originalPda.toString()}`);

  let [pda, bump] = await PublicKey.findProgramAddress([Buffer.from(seed)], programId);
  console.log(`bump: ${bump}, pubkey: ${pda.toString()}`);
  // *failed because the result is on curve
  //     let pda = await PublicKey.createProgramAddress([Buffer.from("config")], programId);
  //     console.log(pda.toBase58());
})();