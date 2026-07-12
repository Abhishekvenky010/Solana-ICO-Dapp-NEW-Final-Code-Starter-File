import React , {useState,useEffect} from "react";
import dynamic from "next/dynamic";
import { useWallet,useConnection } from "@solana/wallet-adapter-react";
import { PublicKey,SystemProgram,SYSVAR_RENT_PUBKEY,Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,getAssociatedTokenAddress,getAccount,createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import IDL from "../idl/idl.json";
import {Program,AnchorProvider,web3, BN } from "@project-serum/anchor";
import toast from "react-hot-toast";
import {NavBar, HeroSection} from "../components";

const WalletMutliButton = dynamic(()=>
import ("@solana/wallet-adapter-react-ui").then((mod)=>mod.WalletMultiButton),{
  ssr:false,
});
const ENV_PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;
const ENV_IPO_MINT  = process.env.NEXT_PUBLIC_ICO_MINT_TOKEN;

const PROGRAM_ID = new PublicKey(ENV_PROGRAM_ID);
const IPO_MINT = new PublicKey(ENV_IPO_MINT);
const TOKEN_DECIMALS = new BN(1_000_000_000);

export default function Home() {
  const {connection} = useConnection();
  const wallet = useWallet();
  const [loading,setLoading] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);
  const [ipoData,setIpoData] = useState(null);
  const [amount,setAmount] = useState("");
  const [userTokenBalance,setUserTokenBalance] = useState(null);
  const [userSolBalance,setUserSolBalance] = useState(null);

  useEffect(()=>{
    if(wallet.connected){
      checkIfAdmin();
      fetchIpoData();
      fetchUserTokenBalance();
    }

},[wallet.connected]);

const getProgram = ()=>{
  if(!wallet.connected)return null;
  const provider = new AnchorProvider(connection,wallet,{
    commitment:"confirmed",
  });
  return new Program(IDL,PROGRAM_ID,provider);
}
const checkIfAdmin = async()=>{
  try{
   const program = getProgram();
   if(!program)return;
    const [datapda] = await PublicKey.findProgramAddress(
      [ArrayBuffer.from("data"),wallet.publicKey.toBuffer()],
      program.programId
    );
    try{
      const data = await program.account.data.fetch(datapda);
      setIsAdmin(data.admin.equals(wallet.publicKey));
    }catch(err){
      const accounts = await program.account.data.all();
      if(accounts.length === 0){
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
        setIpoData(accounts[0].account);  
      }
    }
  }catch(err){
    console.error(err);
  }
};
const fetchIpoData = async()=>{
  try{
    const program = getProgram();
    if(!program)return;
    const accounts = await program.account.data.all();
    if(accounts.length > 0){
      setIpoData(accounts[0].account);
    }
  }catch(err){
    console.error(err);
  }
};
const createIcoAta = async()=>{
  try{
    if(!amount || parseInt(amount) <= 0){
      alert("Please enter a valid amount");
    }
    setLoading(true);
    const program = getProgram();
    if(!program)return;
    const [ipoAtaPda] = await PublicKey.findProgramAddress(
    [IPO_MINT.toBuffer()],
    program.programId
    );
    const [dataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("data"),wallet.publicKey.toBuffer()],
      program.programId);
      const adminIpoAta = await getAssociatedTokenAddress(IPO_MINT,wallet.publicKey);
      await program.methods.createIcoAta(new BN(amount)).accounts({
        ipoAtaForIcoProgram:ipoAtaPda,
        data : dataPda,
        ipoMint:IPO_MINT,
        ipoAtaForAdmin:adminIpoAta,
        admin:wallet.publicKey,
        tokenProgram:TOKEN_PROGRAM_ID,
        systemProgram:SystemProgram.programId,
        rent:SYSVAR_RENT_PUBKEY,
  })
  .rpc();
   alert("ICO ATA created successfully");
   await fetchIpoData();
  } catch(err){
    console.error("Error creating ICO ATA:",err);
    alert(`Error creating ICO ATA: ${err.message}`);
  }
  finally{
    setLoading(false);
};
} 
const depositIco = async()=>{
  try{
    if(!amount || parseInt(amount) <= 0){
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    const program = getProgram();
    if(!program)return;
    const [ipoAtaPda] = await PublicKey.findProgramAddress(
    [IPO_MINT.toBuffer()],
    program.programId
    );
    const [dataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("data"),wallet.publicKey.toBuffer()],
      program.programId);
      const adminIpoAta = await getAssociatedTokenAddress(IPO_MINT,wallet.publicKey);
      await program.methods.depositIcoInAta(new BN(amount)).accounts({
        ipoAtaForIcoProgram:ipoAtaPda,
        data : dataPda,
        ipoMint:IPO_MINT,
        ipoAtaForAdmin:adminIpoAta,
        admin:wallet.publicKey,
        rent:SYSVAR_RENT_PUBKEY,
  })
  .rpc();
   alert("Tokens deposited successfully");
   await fetchIpoData();
  } catch(err){
    console.error("Error depositing tokens:",err);
    alert(`Error depositing tokens: ${err.message}`);
  }
  finally{
    setLoading(false);
};
} 
const  buyTokens= async()=>{
  try{
    if(!amount || parseInt(amount) <= 0){
      alert("Please enter a valid amount");
    }
    setLoading(true);
    const program = getProgram();
    if(!program)return;
    const solCost  = parseInt(amount) * 0.001;
    const balance = await connection.getBalance(wallet.publicKey);
    if(balance < solCost * 1e9 + 5000){
      alert(`Insufficient SOL balance. You need at least ${solCost.toFixed(3)} SOL to buy ${amount} tokens.`);
      return;
    }
    const [ipoAtaPda,bump] = await PublicKey.findProgramAddress(
    [IPO_MINT.toBuffer()],
    program.programId
    );
    const [dataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("data"),ipoData.admin.toBuffer()],
      program.programId);
      const userIpoAta = await getAssociatedTokenAddress(IPO_MINT,wallet.publicKey);
      try{
        await getAccount(connection,userIpoAta);
      }catch(err){
        const createUserIpoAtaIx = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          userIpoAta,
          wallet.publicKey,
          IPO_MINT
        );
        const tx = new Transaction().add(createUserIpoAtaIx);
        await wallet.sendTransaction(tx,connection);
        await new Promise((resolve)=>setTimeout(resolve,2000));
      }

      await program.methods.buyTokens(bump,new BN(amount)).accounts({
        ipoAtaForIcoProgram:ipoAtaPda,
        data : dataPda,
        ipoMint:IPO_MINT,
        ipoAtaForUser:userIpoAta,
        user:wallet.publicKey,
        admin : ipoData.admin,
        tokenProgram:TOKEN_PROGRAM_ID,
        systemProgram:SystemProgram.programId,
  })
  .rpc();
   alert(`Successfully bought ${amount} tokens`);
   await fetchIpoData();
   await fetchUserTokenBalance();
  } catch(err){
    console.error("Error buying tokens:",err);
    alert(`Error buying tokens: ${err.message}`);
  }
  finally{
    setLoading(false);
};
} 
const fetchUserTokenBalance = async()=>{
  try{
    const userAta = await getAssociatedTokenAddress(IPO_MINT,wallet.publicKey);
    try{
      const tokenAccount = await getAccount(connection,userAta);
      setUserTokenBalance(tokenAccount.amount.toString());
      }
      catch(err){
        console.log(err);
      setUserTokenBalance("0"); 
    }
  }catch(err){
    console.error("Error fetching user token balance:",err);
    setUserTokenBalance("0");
  }
};
return (
  <div>
    <NavBar>
      <main>
        <HeroSection>
          wallet = {wallet},
          isAdmin = {isAdmin},
          loading = {loading},
          ipoData = {ipoData},
          amount = {amount},
          userSolBalance = {userSolBalance},
          userTokenBalance = {userTokenBalance},
          setAmount = {setAmount},
          createIcoAta = {createIcoAta},
          depositIco = {depositIco},
          buyTokens = {buyTokens}
        </HeroSection>
      </main>
    </NavBar>
  </div>
);
}