import React , {useSate,useEffect} from "react";
import dynamic from "next/dynamic";
import { useWallet,useConnection } from "@solana/wallet-adapter-react";
import { PublicKey,SystemProgram,SYSVAR_RENT_PUBKEY,Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,getAssociatedTokenAddress,createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import IDL from "../idl/idl.json";
import {Program,AnchorProvider,web3, BN } from "@project-serum/anchor";

const WalletMutliButton = dynamic(()=>
import ("@solana/wallet-adapter-react-ui").then((mod)=>mod.WalletMultiButton),{
  ssr:false,
});
const ENV_PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;
const ENV_IPO_MINT  = process.env.NEXT_PUBLIC_IPO_MINT_TOKEN;

const PROGRAM_ID = new PublicKey(ENV_PROGRAM_ID);
const IPO_MINT = new PublicKey(ENV_IPO_MINT);
const TOKEN_DECIMALS = new BN(1_000_000_000);

export default function Home() {
  const {connection} = useConnection();
  const wallet = useWallet();
  const [loading,setLoading] = useSate(false);
  const [isAdmin,setIsAdmin] = useSate(false);
  const [ipoData,setIpoData] = useSate(null);
  const [amount,setAmount] = useSate("");
  const [userTokenBalance,setUserTokenBalance] = useSate(null);

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
  }
}