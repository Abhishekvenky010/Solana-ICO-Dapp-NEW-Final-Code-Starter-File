import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { IoWalletOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsFillInfoCircleFill, BsCurrencyDollar } from "react-icons/bs";
import { RiUsdCircleFill } from "react-icons/ri";
import { RxTokens } from "react-icons/rx";

import Admin from "./Admin";
import { One, Two, Three, Four, Five } from "./SVG/index";

import dynamic from "next/dynamic";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
() =>
import("@solana/wallet-adapter-react-ui").then(
(mod) => mod.WalletMultiButton),
{
ssr : false
});

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const NEXT_PER_TOKEN_USD_PRICE =
process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE;
const PER_TOKEN_SOL_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_SOL_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;
const MIN_SOL_BALANCE = process.env.NEXT_PUBLIC_MIN_SOL_BALANCE;

const HeroSection = ({
isDarkMode,
wallet,
isAdmin,
loading,
ipoData,
amount,
userSolBalance,
userTokenBalance,
setAmount,
createIpoAta,
depositIpo,
buyTokens
}) => {
  isDarkMode = true;
  const [selectedToken,setSelectedToken] = useState("SOL");
  const

const

[selectedToken, setSelectedToken] = useState("SOL");
const [isModalOpen, setIsModalOpen] = useState(false);
const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
const [isLoading, setIsLoading] = useState(false); // Set to false to hide loading overlay
const [isConnected, setIsConnected] = useState(true); // Set to true to show purchase button
const [contractInfo] = useState();
const [tokenBalances] = useState();
}
const calculateProgressPercentage = () => {
if (!icoData ?. tokensSold ?. toString() || !icoData ?. totalTokens ?. toString())
return 0;

const availbleSupply =
Number(icoData ?. tokensSold ?. toString()) +
Number(icoData ?. totalTokens ?. toString());
const soldAmount = parseFloat(icoData ?. tokensSold ?. toString()) || 0;
const totalSupply = parseFloat(availbleSupply) || 1; // Prevent division by zero

// Calculate percentage with a maximum of 100%
const percentage = Math.min((soldAmount / totalSupply) * 100, 100);


return parseFloat(percentage. toFixed(2));
};

const executepurchase = async() =>{
  setIsLoading(true);
  const callingBuy = buyTokens();
  setIsLoading(false);
};
const getButtonMessage = ()=>{
  if(parseFloat(amount) <= 0){
    return "Enter Amount";
  }
  return "Buy Now";
};
const getTokenIcon = ()=>{
  return <img className="mr-2 w-4 h-4" src="/solana.svg" alt = "SOL"/>;
};
   
const getTokenButtonStyle = (token)=>{
    const isSelected = selectedToken === token;

return `flex items-center justify-center px-3 py-2 rounded-lg ${
isSelected
? "bg-purple-700 text-white shadow-lg shadow-purple-700/30"
: isDarkMode
? "bg-gray-800 text-gray-300 hover:bg-gray-700"
: "bg-gray-100 text-gray-700 hover:bg-gray-200"
} transition-all duration-300 text-sm font-medium flex-1`;
};
const bgColor = "bg-gray-900";
const textColor = "text-white";
const secondaryTextColor = "text-gray-400";
const cardBg = "bg-gray-800";
const cardBorder = "border-gray-700";
const inputBg = "bg-gray-700 border-gray-600";

return(
  <div className={`relative w-full overflow-hidden ${bgColor}`}>
{/* Background elements */}
<div className="absolute inset-0 z-0">
{/* Animated background */}
<div className="absolute inset-0">
<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 rounded-full
blur-3xl"></div>
<div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-600/5 rounded-full
blur-3xl"></div>

{/* Orbital circles */}
<div className="orbital-ring ring1"></div>
<div className="orbital-ring ring2"></div>
<div className="orbital-ring ring3"></div>

{/* Floating elements */}
<div className="floating-element elem1"></div>
<div className="floating-element elem2"></div>
<div className="floating-element elem3"></div>
</div>
</div>
{/* Main content */}
<div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
<div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
{/* Left side - Text content */}
<div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center
lg: text-left">
{/* Status badge */}
<div className="inline-block p-2 px-5 rounded-full bg-purple-500/10 mb-6 border
border-purple-500/20">
<p className="text-sm font-medium text-purple-500">
Presale Live Now . Limited Time Offer
</p>
</div>

<h1
className={`text-4xl md:text-5xl lg: text-6xl font-bold mb-6 ${textColor}`}
>
SOLANA
<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500
  to-emerald-500">
    &nbsp; IPO 
    </span>
    </h1>

    <div className="relative mb-8">
<h2 className="text-2xl md: text-3xl font-bold">
<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500
to-emerald-500">
Token Presale
</span>
<span className={textColor}> . Stage 1</span>
</h2>
<div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r
from-purple-500 to-emerald-500 rounded-full"></div>
</div>
<p
className={${secondaryTextColor} text-base md:text-lg max-w-md mb-10
leading-relaxed'}

Join the future of blockchain innovation. Our revolutionary
platform combines cutting-edge technology with decentralized
finance to create a seamless ecosystem for digital assets.
</p>

{/* Features */}
<div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
<div
className={`px-4 py-3 rounded-xl ${
isDarkMode ? "bg-gray-800" : "bg-gray-100"
} flex items-center`}
>
<div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center
justify-center mr-3">
<One />
</div>
<div>
  <p className={`text-xs ${secondaryTextColor}'}>
. Early Access
</p>
<p className={`text-sm font-medium ${textColor}'}>
Limited Presale
</p>
</div>
</div>
<div
className={`px-4 py-3 rounded-xl ${
isDarkMode ? "bg-gray-800" : "bg-gray-100"
} flex items-center`}
>
<div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center
justify-center mr-3">
<Two />
</div>
<div>
<p className={`text-xs ${secondaryTextColor}`}>For You</p>
<p className={`text-sm font-medium ${textColor}`}>
  Exclusive Benifits
  </p>
  </div>
  </div>
   <div
className={`px-4 py-3 rounded-xl ${
isDarkMode ? "bg-gray-800" : "bg-gray-100"
} flex items-center`}
>
<div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center
justify-center mr-3">
< Three />
</div>
<div>
<p className={`text-xs ${secondaryTextColor}`}>
Low Starting
</p>
<p className={`text-sm font-medium ${textColor}`}>
Special Price
</p>
</div>
</div>
<div
className={`px-4 py-3 rounded-xl ${
isDarkMode ? "bg-gray-800" : "bg-gray-100"
} flex items-center`}

<div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center
justify-center mr-3">
<Four />
</div>
<div>
<p className={`text-xs ${secondaryTextColor}`}>Earn More</p>
<p className={`text-sm font-medium ${textColor}`}>
Referral Program
</p>
</div>
</div>
</div>
</div>
{/* Right side - Purchase card */}
<div className="w-full lg:w-1/2 max-w-md mx-auto relative">
{/* Loading overlay */}
{isLoading && (
<div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50
backdrop-blur-sm rounded-2xl">
<div className="flex flex-col items-center">
<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent
rounded-full animate-spin mb-4"></div>
<p className="text-white">Loading ...</p>
</div>
</div>
)}

{/* Card glow effect */}
<div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-600
rounded-2xl blur-lg opacity-20"></div>

{/* Card content */}
div
className={`${cardBg} rounded-2xl shadow-xl overflow-hidden relative z-10 border $
{cardBorder}`}
>
{/* Card header */}
<div className="bg-gradient-to-r from-purple-600 to-emerald-600 py-4 px-6">
<div className="flex items-center justify-between mb-2">
<h3 className="text-white font-bold text-lg">
Buy {TOKEN_SYMBOL} Tokens
</h3>
<span className="bg-white/20 text-white text-xs font-medium px-3 py-1
rounded-full">
Stage 1
</span>
</div>
<p className="text-white/80 text-sm">
Limited time offer . Secure your tokens now
</p>
</div>

<div className="p-6">
{userSolBalance < MIN_SOL_BALANCE && (
<div
className={`text-center text-xs ${secondaryTextColor} mb-4 bg-purple-500/5 py-2
px-4 rounded-lg flex items-center justify-center`}
>
<BsFillInfoCircleFill
className="mr-2 text-purple-500"
size={14}
/>
<span>
You don't have the minimum balance of {MIN_SOL_BALANCE}{" "}
SOL
</span>
</div>
)}
{/* Price info */}
<div className="flex justify-between bg-gradient-to-r from-purple-500/5
to-emerald-500/5 rounded-xl p-4 mb-5">
<div className="text-center">
<p className={`text-xs ${secondaryTextColor} mb-1'}>
Current Price
</p>
<p className={`${textColor} text-lg font-bold'}>
${PER_TOKEN_USD_PRICE}
</p>
</div>
<div className="h-auto w-px bg-gradient-to-b from-transparent via-gray-400/20
to-transparent"></div>
<div className="text-center">
<p className={`text-xs ${secondaryTextColor} mb-1'}>
Next Stage
</p>
<p className={'${textColor} text-lg font-bold}>
 ${NEXT_PER_TOKEN_USD_PRICE}
</p>
</div>