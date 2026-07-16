# Solana ICO Presale DApp

A full-stack **Initial Coin Offering (ICO) presale** DApp on Solana. Users connect a wallet (Phantom), buy your SPL token with SOL at a fixed presale price, and watch live sale progress. Admins can initialize the sale, deposit tokens into the program vault, and monitor status.

Built with the **Anchor framework (Rust)** for the on-chain program and **Next.js** for the frontend.

---

## What's Inside

| Layer        | Tech                                                       |
| ------------ | ---------------------------------------------------------- |
| Smart contract | Rust + Anchor (`Contract/SolanaICO.rs`)                 |
| Frontend     | Next.js (Pages Router) + React                            |
| Wallet       | Solana Wallet Adapter (Phantom, etc.)                     |
| Styling      | TailwindCSS                                                |
| Token        | SPL Token (associated token accounts)                      |

### Features
- Connect wallet (Phantom / Solflare / Backpack) via Wallet Adapter
- Buy presale tokens with SOL at a fixed price (`0.001 SOL` per token)
- Live sale progress bar (tokens sold / total supply)
- Admin panel: initialize the IPO, deposit tokens into the vault, view status
- Responsive UI with animated hero section

---

## Project Structure

```
.
├── Contract/
│   └── SolanaICO.rs          # Anchor program: create_ipo_ata, deposit_ipo_ata, buy_tokens
├── components/
│   ├── HeroSection.jsx       # Main buy-card UI
│   ├── Admin.jsx             # Admin / IPO details modal
│   ├── NavBar.jsx            # Top navigation + wallet button
│   └── SVG/                 # Inline SVG icons
├── idl/idl.json              # Anchor IDL consumed by the frontend
├── pages/
│   ├── _app.js              # Wallet provider + global styles
│   └── index.js             # Home page: wires wallet, program calls, UI
├── public/                   # Static assets (logo.png, solana.svg)
├── .env.local                # Frontend configuration (see below)
└── README.md
```

---

## On-Chain Program

The Anchor program (`Contract/SolanaICO.rs`) exposes three instructions:

| Instruction        | Who  | What it does |
| ------------------ | ----- | ------------ |
| `create_ipo_ata`  | Admin | Creates the program-owned ATA vault, stores `Data` (admin, total tokens, total sold), transfers the supply into the vault. |
| `deposit_ipo_ata` | Admin | Adds more tokens to the vault and increases `total_tokens`. |
| `buy_tokens`      | User  | Transfers `token_amount × 0.001 SOL` from the buyer to the admin, then transfers the tokens from the vault to the buyer's ATA. Updates `total_sold`. |

### Pricing (keep UI and chain in sync)
The on-chain price is **1 token = `0.001 SOL`**, enforced by the constant:

```rust
// Contract/SolanaICO.rs
pub const LAMPORTS_PER_SOL: u64  = 1_000_000_000;
pub const TOKEN_DECIMALS: u64     = 1_000_000_000;
// 1 token = 0.001 SOL  =>  1_000_000 lamports per token.
// MUST match NEXT_PUBLIC_PER_TOKEN_SOL_PRICE in .env.local.
pub const LAMPORTS_PER_TOKEN: u64 = 1_000_000;

// in buy_tokens():
let sol_amount = token_amount
    .checked_mul(LAMPORTS_PER_TOKEN)
    .ok_or(ErrorCode::Overflow)?;
```

The frontend's `NEXT_PUBLIC_PER_TOKEN_SOL_PRICE` **must equal the same `0.001`**. If you change the price, update **both** the constant above and `.env.local`, then re-deploy the program.

---

## Prerequisites

- **Node.js** v18+ and npm
- **Rust** + `cargo` (for building the program)
- **Solana CLI** + `cargo build-sbf` (Anchor BPF toolchain)
- A **Phantom** (or compatible) wallet and some **devnet SOL** for testing
- The ICO **mint** address of your SPL token

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_PROGRAM_ID="<your deployed Anchor program id>"
NEXT_PUBLIC_ICO_MINT_TOKEN="<SPL mint address of your ICO token>"

NEXT_PUBLIC_TOKEN_NAME="UT"
NEXT_PUBLIC_TOKEN_SYMBOL="AW76"
NEXT_PUBLIC_TOKEN_SUPPLY="1000"

# UI pricing (must match the on-chain LAMPORTS_PER_TOKEN constant)
NEXT_PUBLIC_PER_TOKEN_USD_PRICE="0.010"
NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE="0.035"
NEXT_PUBLIC_PER_TOKEN_SOL_PRICE="0.001"

NEXT_PUBLIC_CURRENCY="SOL"
NEXT_PUBLIC_BLOCKCHAIN="Solana"
NEXT_PUBLIC_MIN_SOL_BALANCE=0.05
```

> ⚠️ `NEXT_PUBLIC_PER_TOKEN_SOL_PRICE` and the program's `LAMPORTS_PER_TOKEN`
> must describe the **same price**. They drift apart easily — change both together.

### 3. Build & deploy the Anchor program
```bash
cd Contract
cargo build-sbf
# deploy to your cluster of choice (devnet shown)
solana program deploy ./target/deploy/solana_ico.so --url devnet
```
Update `NEXT_PUBLIC_PROGRAM_ID` with the deployed address, and ensure `declare_id!`
in `SolanaICO.rs` matches it.

### 4. Create the ICO token mint
Create your SPL token (e.g. via `spl-token create-token`) and use its mint
address as `NEXT_PUBLIC_ICO_MINT_TOKEN`. The admin must hold an ATA for this mint
so they can deposit tokens into the vault.

### 5. Run the frontend
```bash
npm run dev
```
Open http://localhost:3000 and connect your wallet.

---

## Using the DApp

1. **Admin** connects, opens **IPO Details**, and clicks *Initialize IPO* to create
   the vault and store sale data. Then *Deposit* tokens into the vault.
2. **Buyers** connect, enter a quantity, and click **Buy Now**. The app checks the
   buyer has enough SOL, then calls `buy_tokens`.
3. The **progress bar** updates as `total_sold` increases on-chain.

---

## Common Issues

- **"Insufficient SOL balance" even with funds** — the price was hardcoded to
  `1 SOL/token` in an earlier build. The fix uses `LAMPORTS_PER_TOKEN`
  (`0.001 SOL/token`). Rebuild & redeploy the program after the change.
- **Hero section doesn't render** — `HeroSection` must receive **named props**
  (`wallet={wallet} ...`), not text children, and must be a **sibling** of
  `NavBar` (NavBar does not render `children`).
- **Price mismatch between display and charge** — keep
  `NEXT_PUBLIC_PER_TOKEN_SOL_PRICE` and `LAMPORTS_PER_TOKEN` identical.

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the Next.js dev server |
| `npm run build` | Production build         |
| `npm start`     | Serve the production build |
| `cargo build-sbf` (in `Contract/`) | Compile the Anchor program to BPF |

---


