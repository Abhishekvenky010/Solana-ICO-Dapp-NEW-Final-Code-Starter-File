// pages/_app.js

import "../styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";
import {SolflareWalletAdapter} from "@solana/wallet-adapter-solflare";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
const network = WalletAdapterNetwork.Devnet;

function MyApp({ Component, pageProps }) {
   const endpoint = useMemo(()=> clusterApiUrl(network,[network]));
   const wallets  = useMemo(()=> [new PhantomWalletAdapter(),new SolflareWalletAdapter()],[network])
  return (
    <>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
            <Component {...pageProps}/>;
        </WalletModalProvider>
      </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default MyApp;
