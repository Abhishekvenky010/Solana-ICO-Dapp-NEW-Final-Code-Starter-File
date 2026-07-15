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

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const NEXT_PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE;
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
  buyTokens,
}) => {
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const calculateProgressPercentage = () => {
    if (!ipoData?.tokensSold?.toString() || !ipoData?.totalTokens?.toString())
      return 0;

    const availbleSupply =
      Number(ipoData?.tokensSold?.toString()) +
      Number(ipoData?.totalTokens?.toString());
    const soldAmount = parseFloat(ipoData?.tokensSold?.toString()) || 0;
    const totalSupply = parseFloat(availbleSupply) || 1;

    const percentage = Math.min((soldAmount / totalSupply) * 100, 100);
    return parseFloat(percentage.toFixed(2));
  };

  const executePurchase = async () => {
    setIsLoading(true);
    const callingBuy = buyTokens();
    setIsLoading(false);
  };

  const getButtonMessage = () => {
    if (parseFloat(amount) <= 0) {
      return "Enter Amount";
    }
    return "Buy Now";
  };

  const getTokenIcon = () => {
    return <img className="mr-2 w-4 h-4" src="/solana.svg" alt="SOL" />;
  };

  const getTokenButtonStyle = (token) => {
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

  return (
    <div className={`relative w-full overflow-hidden ${bgColor}`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-600/5 rounded-full blur-3xl"></div>

          <div className="orbital-ring ring1"></div>
          <div className="orbital-ring ring2"></div>
          <div className="orbital-ring ring3"></div>

          <div className="floating-element elem1"></div>
          <div className="floating-element elem2"></div>
          <div className="floating-element elem3"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-block p-2 px-5 rounded-full bg-purple-500/10 mb-6 border border-purple-500/20">
              <p className="text-sm font-medium text-purple-500">
                Presale Live Now . Limited Time Offer
              </p>
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${textColor}`}
            >
              SOLANA
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                &nbsp; IPO
              </span>
            </h1>

            <div className="relative mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                  Token Presale
                </span>
                <span className={textColor}> . Stage 1</span>
              </h2>
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"></div>
            </div>
            <p
              className={`${secondaryTextColor} text-base md:text-lg max-w-md mb-10 leading-relaxed`}
            >
              Join the future of blockchain innovation. Our revolutionary
              platform combines cutting-edge technology with decentralized
              finance to create a seamless ecosystem for digital assets.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
              <div
                className={`px-4 py-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} flex items-center`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                  <One />
                </div>
                <div>
                  <p className={`text-xs ${secondaryTextColor}`}>Early Access</p>
                  <p className={`text-sm font-medium ${textColor}`}>Limited Presale</p>
                </div>
              </div>
              <div
                className={`px-4 py-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} flex items-center`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <Two />
                </div>
                <div>
                  <p className={`text-xs ${secondaryTextColor}`}>For You</p>
                  <p className={`text-sm font-medium ${textColor}`}>Exclusive Benifits</p>
                </div>
              </div>
              <div
                className={`px-4 py-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} flex items-center`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                  <Three />
                </div>
                <div>
                  <p className={`text-xs ${secondaryTextColor}`}>Low Starting</p>
                  <p className={`text-sm font-medium ${textColor}`}>Special Price</p>
                </div>
              </div>
              <div
                className={`px-4 py-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} flex items-center`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <Four />
                </div>
                <div>
                  <p className={`text-xs ${secondaryTextColor}`}>Earn More</p>
                  <p className={`text-sm font-medium ${textColor}`}>Referral Program</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 max-w-md mx-auto relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Loading ...</p>
                </div>
              </div>
            )}

            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-2xl blur-lg opacity-20"></div>

            <div
              className={`${cardBg} rounded-2xl shadow-xl overflow-hidden relative z-10 border ${cardBorder}`}
            >
              <div className="bg-gradient-to-r from-purple-600 to-emerald-600 py-4 px-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">
                    Buy {TOKEN_SYMBOL} Tokens
                  </h3>
                  <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
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
                    className={`text-center text-xs ${secondaryTextColor} mb-4 bg-purple-500/5 py-2 px-4 rounded-lg flex items-center justify-center`}
                  >
                    <BsFillInfoCircleFill className="mr-2 text-purple-500" size={14} />
                    <span>
                      You don't have the minimum balance of {MIN_SOL_BALANCE} SOL
                    </span>
                  </div>
                )}

                <div className="flex justify-between bg-gradient-to-r from-purple-500/5 to-emerald-500/5 rounded-xl p-4 mb-5">
                  <div className="text-center">
                    <p className={`text-xs ${secondaryTextColor} mb-1`}>Current Price</p>
                    <p className={`${textColor} text-lg font-bold`}>${PER_TOKEN_USD_PRICE}</p>
                  </div>
                  <div className="h-auto w-px bg-gradient-to-b from-transparent via-gray-400/20 to-transparent"></div>
                  <div className="text-center">
                    <p className={`text-xs ${secondaryTextColor} mb-1`}>Next Stage</p>
                    <p className={`${textColor} text-lg font-bold`}>${NEXT_PER_TOKEN_USD_PRICE}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className={`text-sm ${secondaryTextColor}`}>Sale Progress</p>
                    <p className="text-sm font-medium text-purple-500">
                      {calculateProgressPercentage()}% Complete
                    </p>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 relative progress-animation"
                      style={{ width: `${calculateProgressPercentage()}%` }}
                    >
                      <div className="absolute inset-0 shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className={`text-xs ${secondaryTextColor}`}>
                      Total Raised:{" "}
                      <span className="font-medium">
                        $
                        {parseFloat(ipoData?.tokensSold?.toString() || 0) *
                          parseFloat(PER_TOKEN_USD_PRICE || 0) >
                        0
                          ? (
                              parseFloat(ipoData?.tokensSold?.toString() || 0) *
                              parseFloat(PER_TOKEN_USD_PRICE || 0)
                            ).toFixed(2)
                          : "0"}
                      </span>
                    </p>
                    <p className={`text-xs ${secondaryTextColor}`}>
                      Tokens Left:{" "}
                      <span className="font-medium text-emerald-500">
                        {ipoData?.totalTokens - ipoData?.tokensSold} {TOKEN_SYMBOL}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-xl p-4 flex items-center justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <img src="/logo.png" alt={TOKEN_SYMBOL} className="w-6 h-6" />
                  </div>
                  <span className={`${textColor} text-lg font-medium`}>
                    1 {TOKEN_SYMBOL} ={" "}
                  </span>
                  <div className="px-3 py-1.5 rounded-lg bg-purple-500/20">
                    <span className="text-lg font-bold text-purple-500">
                      {PER_TOKEN_SOL_PRICE} {CURRENCY}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedToken("SOL")}
                      className={getTokenButtonStyle("SOL")}
                    >
                      <img className="mr-2 w-4 h-4" src="/solana.svg" alt="SOL" />
                      {CURRENCY}
                    </button>
                  </div>
                </div>

                <div
                  className={`flex items-center ${isDarkMode ? "bg-gray-700/50" : "bg-gray-100"} rounded-lg px-4 py-3 mb-5`}
                >
                  <div className="w-8 h-8 pl-2 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                    {getTokenIcon(selectedToken)}
                  </div>
                  <div>
                    <p className={`text-xs ${secondaryTextColor}`}>Available Balance</p>
                    <p className={`${textColor} font-medium`}>
                      {userSolBalance}{" "}
                      <span className="text-sm">{selectedToken}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block ${secondaryTextColor} text-sm mb-2 font-medium`}>
                      Quantity
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full ${inputBg} rounded-lg border px-4 py-4 ${textColor} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-800 dark:bg-gray-600 px-3 py-1 rounded-lg">
                        <span className={`text-sm ${textColor} mr-2`}>{TOKEN_SYMBOL}</span>
                        <div className="w-6 h-6 pl-2 rounded-full flex items-center justify-center bg-gray-700 dark:bg-gray-500">
                          <img src="/logo.png" alt={TOKEN_SYMBOL} className="mr-3 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block ${secondaryTextColor} text-sm mb-2 font-medium`}>
                      You Pay
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={(parseInt(amount || "0") * parseFloat(PER_TOKEN_SOL_PRICE || 0)).toFixed(3)}
                        readOnly
                        className={`w-full ${inputBg} rounded-lg border px-4 py-4 ${textColor}`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-800 dark:bg-gray-600 px-3 py-1 rounded-lg">
                        <span className={`text-sm ${textColor} mr-2`}>SOL</span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700 dark:bg-gray-500">
                          <img className="w-4 h-4" src="/solana.svg" alt="SOL" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {wallet.connected ? (
                  <>
                    {ipoData ? (
                      <>
                        {userSolBalance < MIN_SOL_BALANCE ? (
                          <button
                            className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg py-4 mb-4 flex items-center justify-center transition-all duration-300 font-medium shadow-lg"
                          >
                            Insufficient Balance, Min Req {MIN_SOL_BALANCE} SOL
                          </button>
                        ) : (
                          <button
                            onClick={executePurchase}
                            disabled={!hasSufficientBalance}
                            className={`w-full ${
                              hasSufficientBalance
                                ? "bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700"
                                : isDarkMode
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-gray-300 cursor-not-allowed"
                            } text-white rounded-lg py-4 mb-4 flex items-center justify-center transition-all duration-300 font-medium shadow-lg ${
                              hasSufficientBalance ? "hover:shadow-purple-500/20" : ""
                            }`}
                          >
                            {getButtonMessage()}
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg py-4 mb-4 flex items-center justify-center transition-all duration-300 font-medium shadow-lg"
                      >
                        IPO needs to be initialized
                      </button>
                    )}
                  </>
                ) : (
                  <WalletMultiButton
                    childStyle="w-full mb-4 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white flex items-center justify-center gap-2 font-medium shadow-lg transition-all duration-300"
                  />
                )}

                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="w-full py-4 px-6 rounded-lg bg-gray-800 hover:bg-gray-700 text-white mb-4 font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <RxTokens />
                  <span>IPO Details</span>
                </button>

                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"}`}>
                  <div className="flex items-center mb-3">
                    <AiOutlineQuestionCircle className="text-purple-500 mr-2" size={18} />
                    <h4 className={`font-medium ${textColor}`}>Need Help ?</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`#chart`}
                      className={`${secondaryTextColor} hover:text-purple-500 flex items-center text-xs transition-colors duration-200 py-1`}
                    >
                      <span className="mr-1 text-purple-500">.</span>
                      How to Buy Guide
                    </a>
                    <a
                      href={`#about`}
                      className={`${secondaryTextColor} hover:text-purple-500 flex items-center text-xs transition-colors duration-200 py-1`}
                    >
                      <span className="mr-1 text-purple-500">.</span>
                      About {TOKEN_SYMBOL}
                    </a>
                    <a
                      href={`#chart`}
                      className={`${secondaryTextColor} hover:text-purple-500 flex items-center text-xs transition-colors duration-200 py-1`}
                    >
                      <span className="mr-1 text-purple-500">.</span>
                      Token Information
                    </a>
                    <a
                      href={`#chart`}
                      className={`${secondaryTextColor} hover:text-purple-500 flex items-center text-xs transition-colors duration-200 py-1`}
                    >
                      <span className="mr-1 text-purple-500">.</span>
                      Frequently Asked Questions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <Five />
        </button>
      </div>

      <Admin
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={wallet}
        isAdmin={isAdmin}
        loading={loading}
        ipoData={ipoData}
        amount={amount}
        userSolBalance={userSolBalance}
        userTokenBalance={userTokenBalance}
        setAmount={setAmount}
        createIpoAta={createIpoAta}
        depositIpo={depositIpo}
        buyTokens={buyTokens}
        calculateProgressPercentage={calculateProgressPercentage}
      />

      <style jsx>{`
        .orbital-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(139, 92, 246, 0.1);
          animation: rotate 60s linear infinite;
        }

        .ring1 {
          width: 600px;
          height: 600px;
          top: -100px;
          right: -100px;
        }
        .ring2 {
          width: 800px;
          height: 800px;
          bottom: -200px;
          left: -200px;
          border-color: rgba(16, 185, 129, 0.1);
          animation-duration: 90s;
          animation-direction: reverse;
        }
        .ring3 {
          width: 400px;
          height: 400px;
          top: 50%;
          left: 60%;
          border-color: rgba(139, 92, 246, 0.15);
          animation-duration: 45s;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .floating-element {
          position: absolute;
          background-color: rgba(139, 92, 246, 0.1);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float 10s ease-in-out infinite alternate;
        }
        .elem1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }
        .elem2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 15%;
          background-color: rgba(16, 185, 129, 0.1);
          animation-delay: 2s;
          animation-duration: 12s;
        }
        .elem3 {
          width: 150px;
          height: 150px;
          top: 40%;
          left: 25%;
          background-color: rgba(139, 92, 246, 0.15);
          animation-delay: 4s;
          animation-duration: 8s;
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          }
        }

        .progress-animation {
          animation: progress 2s ease-out;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: ${calculateProgressPercentage()}%;
          }
        }

        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
