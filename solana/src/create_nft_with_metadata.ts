import * as web3 from "@solana/web3.js";
import * as spl from '@solana/spl-token';
import * as metaplex from '@metaplex/js';
import rawdata from '../resources/0.json';
import fs from 'fs';
import { MasterEdition, Metadata } from '@metaplex-foundation/mpl-token-metadata';

(async () => {
    // // 1. Upload image to nft.storage
    // const nftStorageKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI1NDVGYzdiOTUwNEMxQUE1MDRGYzMzRDRFMTQwRjkwNjNkM0FENEEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDg4Mzk5NTkyMiwibmFtZSI6IlNvbEZvcmVzdCJ9.HygyBWFG64Du_Hw-G6Ck3bu8vzQqiMM9HwnXT5aHYnM';
    // const imagePath = '../resources/0.png';
    // const stats = fs.statSync(imagePath);
    // let fileSizeInBytes = stats.size;
    // const readStream = fs.readFileSync(imagePath);
    // const metaData = await fetch('https://api.nft.storage/upload', {
    //     method: 'POST',
    //     headers: {
    //         'Content-length': fileSizeInBytes.toString(),
    //         Authorization: `Bearer ${nftStorageKey}`
    //     },
    //     body: readStream, // Here, stringContent or bufferContent would also work
    // })
    // .then((response: { json: () => any; }) => {
    //     return response.json();
    // })
    // .then((imageUploadResponse: { value: { cid: string; }; }) => {
    //   const mediaURL = `https://${imageUploadResponse.value.cid}.ipfs.dweb.link`;
    //   console.log('Upload metadata');
    //   const manifestJson = rawdata;
    //   manifestJson.image = mediaURL;
    //   const metaData = Buffer.from(JSON.stringify(manifestJson));
    //   fileSizeInBytes = metaData.byteLength;
    //   return  metaData;
    // })
    // .catch((error: any) => {
    //   console.log(error);
    //   throw new Error(`Media Upload Error: ${error}`);
    // });
    // const link = await fetch('https://api.nft.storage/upload', {
    //     method: 'POST',
    //     headers: {
    //         'Content-length': fileSizeInBytes.toString(),
    //         Authorization: `Bearer ${nftStorageKey}`
    //     },
    //     body: metaData, // Here, stringContent or bufferContent would also work
    // })
    // .then((response : {
    //     json: () => any;
    // }) => {
    //     return response.json();
    // })
    // .then((data : {
    //     value: {
    //         cid: string;
    //     };
    // }) => {
    //     const link = `https://${data.value.cid}.ipfs.dweb.link`;
    //     console.log('Upload End');
    //     console.log(link);
    //     return link;
    // })
    // .catch((error : any) => {
    //     console.log(error);
    //     throw new Error(`Metadata Upload Error: ${error}`);
    // });
    // 데브넷 연결점
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
    const wallet = new metaplex.NodeWallet(userKeypair);
    const uri = 'https://34c7ef24f4v2aejh75xhxy5z6ars4xv47gpsdrei6fiowptk2nqq.arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E';
    //에어드랍 1솔
    await connection.confirmTransaction(airdropSignature);
    console.log(`User address: ${userKeypair.publicKey.toBase58()}`)
    //Mint NFT
    const arg: metaplex.actions.MintNFTParams = {
      connection,
      wallet,
      uri
    };
    arg.maxSupply = 1;

    const mintResponse = await metaplex.actions.mintNFT(arg);
    const { mint } = mintResponse;

    const metadata = await Metadata.getPDA(mint);
    const edition = await MasterEdition.getPDA(mint);
    console.log(`mintNFTResponse: ${JSON.stringify(mintResponse)}`)

    // Create the Mint Account for the NFT
    // const mintAccount = await spl.Token.createMint(
    //     connection,
    //     userKeypair,
    //     userKeypair.publicKey,
    //     null,
    //     0,
    //     spl.TOKEN_PROGRAM_ID
    // );
    // // Get/Create the Associated Account for the user to hold the NFT
    // const userAssosciatedAccount =
    //     await mintAccount.getOrCreateAssociatedAccountInfo(
    //         userKeypair.publicKey
    //     );
    // console.log(`AssociatedAccountInfo: ${JSON.stringify(userAssosciatedAccount)}`)
    // // Mint 1 token to the user's associated account
    // await mintAccount.mintTo(
    //     userAssosciatedAccount.address,
    //     userKeypair.publicKey,
    //     [],
    //     1
    // );
    // // Reset mint_authority to null from the user to prevent further minting
    // await mintAccount.setAuthority(
    //     mintAccount.publicKey,
    //     null,
    //     "MintTokens",
    //     userKeypair.publicKey,
    //     []
    // );
})();