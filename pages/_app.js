// pages/_app.js

import "../styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {PhantomWalletAdapter,SolflareWalletAdapter} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
