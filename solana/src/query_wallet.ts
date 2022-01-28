import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, clusterApiUrl, ParsedAccountData } from "@solana/web3.js";

(async () => {
  const MY_WALLET_ADDRESS =  "6TRbQrpBxsPtKj93eHsx8dCdVTFN2mLe99RKRbckjBqe";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 165, // number of bytes 
        },
        {
          memcmp: {
            offset: 32, // number of bytes
            bytes: MY_WALLET_ADDRESS, // base58 encoded string
          },
        },
      ],
    }
  );

  console.log(
    `Found ${accounts.length} token account(s) for wallet ${MY_WALLET_ADDRESS}: `
  );
  accounts.forEach((account, i) => {
    console.log(
      `-- Token Account Address ${i + 1}: ${account.pubkey.toString()} --`
    );
    let parsedAccountData = account.account.data as ParsedAccountData;
    console.log(`Mint: ${parsedAccountData["parsed"]["info"]["mint"]}`);
    console.log(
      `Amount: ${parsedAccountData["parsed"]["info"]["tokenAmount"]["uiAmount"]}`
    );
  });
  /*
    // Output

    Found 1 token account(s) for wallet FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T: 
    -- Token Account Address 1: Et3bNDxe2wP1yE5ao6mMvUByQUHg8nZTndpJNvfKLdCb --
    Mint: BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf
    Amount: 3
  */
})();