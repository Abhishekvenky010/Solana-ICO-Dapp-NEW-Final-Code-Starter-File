import React from "react";

const Admin = ({
isOpen,
onClose,
amount,
loading,
icoData,
userTokenBalance,
isAdmin,
wallet,
setAmount,
createIcoAta,
depositIco,
buyTokens,
userSolBalance,
calculateProgressPercentage,
})
if (!isOpen) return null;

return(
<div className="solana-modal-overlay">
<div className="solana-modal">
<button className="solana-modal-close" onClick={onClose}>
x
</button>
<div className="solana-content">
<div className="solana-header">
<h1 className="text-transparent bg-clip-text bg-gradient-to-r
from-purple-500 to-emerald-500 text-xl font-bold">
Solana IPO
</h1>
</div>
  {wallet. connected &&(
<div className="solana-wallet-info">
<p>
Wallet: {wallet.publicKey.toString().slice(0, 8)} ...
{wallet.publicKey.toString().slice(-8)}
</p>
<p>Balance: {userSolBalance} SOL </p>
<p className="solana-balance">
<span>Your Token Balance :</span>{" "}
<span>
{userTokenBalance
? (Number(userTokenBalance) / 1e9).toFixed(2)
: "0"}{" "}
tokens
</span>
</p>
</div>
  )}
  {wallet. connected &&  (
<div className="solana-ico-section">
{icoData ? (
<div className="solana-ico-status">
<h2 className="font-bold mb-4">ICO Status</h2>

{/* Added progress bar with branded gradient */}
<div className="w-full h-2 bg-gray-700 rounded-full mb-4
overflow-hidden">
<div
className="h-full bg-gradient-to-r from-purple-500
to-emerald-500 rounded-full"
style={{width: `${calculateProgressPercentage()}%` }}
></div>
</div>
<div className="flex justify-between text-sm text-gray-400
mb-4">
<span>{calculateProgressPercentage()}% Complete</span>
<span>
{icoData. tokensSold ?. toString()} /{" "}
{icoData.totalTokens ?. toString()}
</span>
</div>

<div className="solana-ico-grid">
<div className="bg-gray-800 p-3 rounded-lg">
<p className="text-gray-400 text-sm">Total Supply</p>
<p>{icoData.totalTokens ?. toString()} tokens</p>
</div>
<div className="bg-gray-800 p-3 rounded-lg">
<p className="text-gray-400 text-sm">Tokens Sold</p>
.< p>{ipoData. tokensSold ?. toString()} tokens</p>
</div>
<div className="bg-gray-800 p-3 rounded-lg">
.< p className="text-gray-400 text-sm">Token Price</p>
<p>0.001 SOL</p>
</div>
<div className="bg-gray-800 p-3 rounded-lg">
<p className="text-gray-400 text-sm">Available</p>
<p>{icoData. totalTokens - icoData. tokensSold} tokens</p>
</div>
</div>
</div>
): (
  isAdmin && (
<div className="solana-warning">
ICO needs to be initialized
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
? icoData
? "Amount of tokens to deposit"
: "Amount of tokens to initialize"
: "Amount of tokens to buy"
}
min="1"
step="1"
className="focus: border-purple-500 focus:ring-2
focus: ring-purple-500/20"
/>

{amount && ! isAdmin &&{
<div className="solana-cost-breakdown bg-gradient-to-r
from-purple-600/10 to-emerald-600/10 border border-purple-500/
20">
 </div>
<span>Token Amount :< /span>
<span>{amount} tokens</span>
</div>
<div>
<span>Cost :< /span>
<span>{(parseInt(amount) * 0.001).toFixed(3)} SOL</span>
</div>
<div>
<span>Network Fee :< /span>
<span>~0.000005 SOL</span>
</div>
<div className="solana-total">
<span>Total :< /span>
<span>
   {(parseInt(amount) * 0.001+ 0.000005).toFixed(6)} SOL
</span>
</div>
</div>
)}
{isAdmin ?
<div className="solana-admin-buttons">
{!ipoData && (
<button
onClick={createIpoAta}
disabled={loading}
className="bg-gray-800 hover:bg-gray-700 border
border-purple-500 text-white"

{loading ? "Initializing ... " : "Initialize ICO"}
</button>
)}
(icoData &&

A