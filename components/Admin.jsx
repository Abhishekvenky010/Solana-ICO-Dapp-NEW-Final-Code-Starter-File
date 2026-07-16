import React from "react";

const TOKEN_PRICE_SOL = parseFloat(process.env.NEXT_PUBLIC_PER_TOKEN_SOL_PRICE) || 1;
const NETWORK_FEE_SOL = 0.000005;

const toDisplayNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value?.toString === "function") return Number(value.toString());
  return Number(value) || 0;
};

const Admin = ({
  isOpen,
  onClose,
  amount,
  loading,
  ipoData,
  userTokenBalance,
  isAdmin,
  wallet,
  setAmount,
  createIpoAta = () => {},
  depositIpo,
  buyTokens,
  userSolBalance,
  calculateProgressPercentage,
}) => {
  if (!isOpen) return null;

  const tokensSold = toDisplayNumber(ipoData?.tokensSold ?? ipoData?.totalSold);
  const totalTokens = toDisplayNumber(ipoData?.totalTokens);
  const availableTokens = Math.max(totalTokens - tokensSold, 0);
  const tokenAmount = parseInt(amount || "0", 10) || 0;
  const purchaseCost = tokenAmount * TOKEN_PRICE_SOL;
  const progressPercentage =
    typeof calculateProgressPercentage === "function"
      ? calculateProgressPercentage()
      : 0;

  return (
    <div className="solana-modal-overlay">
      <div className="solana-modal">
        <button
          className="solana-modal-close"
          onClick={onClose}
          aria-label="Close IPO details"
        >
          x
        </button>

        <div className="solana-content">
          <div className="solana-header">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500 text-xl font-bold">
              Solana IPO
            </h1>
          </div>

          {wallet.connected && (
            <div className="solana-wallet-info">
              <p>
                Wallet: {wallet.publicKey.toString().slice(0, 8)} ...
                {wallet.publicKey.toString().slice(-8)}
              </p>
              <p>Balance: {userSolBalance ?? 0} SOL</p>
              <p className="solana-balance">
                <span>Your Token Balance:</span>{" "}
                <span>
                  {userTokenBalance
                    ? (Number(userTokenBalance) / 1e9).toFixed(2)
                    : "0"}{" "}
                  tokens
                </span>
              </p>
            </div>
          )}

          {wallet.connected && (
            <div className="solana-ipo-section">
              {ipoData ? (
                <div className="solana-ipo-status">
                  <h2 className="font-bold mb-4">IPO Status</h2>

                  <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{progressPercentage}% Complete</span>
                    <span>
                      {tokensSold} / {totalTokens}
                    </span>
                  </div>

                  <div className="solana-ipo-grid">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Supply</p>
                      <p>{totalTokens} tokens</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Tokens Sold</p>
                      <p>{tokensSold} tokens</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Token Price</p>
                      <p>{TOKEN_PRICE_SOL} SOL</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Available</p>
                      <p>{availableTokens} tokens</p>
                    </div>
                  </div>
                </div>
              ) : (
                isAdmin && (
                  <div className="solana-warning">
                    IPO needs to be initialized
                  </div>
                )
              )}

              <div className="solana-input-section">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={
                    isAdmin
                      ? ipoData
                        ? "Amount of tokens to deposit"
                        : "Amount of tokens to initialize"
                      : "Amount of tokens to buy"
                  }
                  min="1"
                  step="1"
                  className="focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />

                {amount && !isAdmin && (
                  <div className="solana-cost-breakdown bg-gradient-to-r from-purple-600/10 to-emerald-600/10 border border-purple-500/20">
                    <div>
                      <span>Token Amount:</span>
                      <span>{amount} tokens</span>
                    </div>
                    <div>
                      <span>Cost:</span>
                      <span>{purchaseCost.toFixed(3)} SOL</span>
                    </div>
                    <div>
                      <span>Network Fee:</span>
                      <span>~{NETWORK_FEE_SOL} SOL</span>
                    </div>
                    <div className="solana-total">
                      <span>Total:</span>
                      <span>
                        {(purchaseCost + NETWORK_FEE_SOL).toFixed(6)} SOL
                      </span>
                    </div>
                  </div>
                )}

                {isAdmin ? (
                  <div className="solana-admin-buttons">
                    {!ipoData && (
                      <button
                        onClick={createIpoAta}
                        disabled={loading}
                        className="bg-gray-800 hover:bg-gray-700 border border-purple-500 text-white"
                      >
                        {loading ? "Initializing ..." : "Initialize IPO"}
                      </button>
                    )}

                    {ipoData && (
                      <>
                        <button
                          onClick={depositIpo}
                          disabled={loading}
                          className="bg-gray-800 hover:bg-gray-700 border border-purple-500 text-white"
                        >
                          {loading ? "Depositing ..." : "Deposit Tokens"}
                        </button>
                        <button
                          onClick={buyTokens}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white"
                        >
                          {loading ? "Processing ..." : "Buy Tokens"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    className="solana-buy-button bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white"
                    onClick={buyTokens}
                    disabled={loading || !ipoData}
                  >
                    {loading ? "Processing ..." : "Buy Tokens"}
                  </button>
                )}

                {loading && (
                  <div className="solana-loading">Processing transaction ...</div>
                )}
              </div>
            </div>
          )}

          {!wallet.connected && (
            <div className="solana-connect-prompt text-gray-400">
              Please connect your wallet to continue
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .solana-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .solana-modal {
          background: #0d0b21;
          padding: 2rem;
          border-radius: 1rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideIn 0.3s ease-out;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .solana-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          border: none;
          background: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #aaa;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .solana-modal-close:hover {
          color: #fff;
        }

        .solana-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .solana-wallet-info {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .solana-balance {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .solana-ipo-status {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .solana-ipo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .solana-warning {
          background-color: #fff3cd;
          color: #856404;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .solana-input-section input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s;
          background-color: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .solana-input-section input:focus {
          outline: none;
          border-color: #9945ff;
        }

        .solana-input-section input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .solana-cost-breakdown {
          padding: 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .solana-cost-breakdown > div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .solana-cost-breakdown > div:last-child {
          margin-bottom: 0;
        }

        .solana-total {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 0.75rem;
          font-weight: 600;
        }

        .solana-admin-buttons button,
        .solana-buy-button {
          width: 100%;
          padding: 0.875rem;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-bottom: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .solana-admin-buttons button:hover,
        .solana-buy-button:hover {
          transform: translateY(-2px);
        }

        .solana-admin-buttons button:disabled,
        .solana-buy-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .solana-loading {
          text-align: center;
          color: #aaa;
          animation: pulse 2s infinite;
        }

        .solana-connect-prompt {
          text-align: center;
          padding: 2rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .solana-modal {
            width: 95%;
            padding: 1.5rem;
          }

          .solana-ipo-grid {
            grid-template-columns: 1fr;
          }

          .solana-balance,
          .solana-cost-breakdown > div {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;
