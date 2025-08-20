You are an expert Solana + React engineer. Generate a minimal, production-quality **Solana devnet** dApp repo with:

### Goal
A tiny app that lets me:
1) Connect a wallet (Phantom, Solflare) on **devnet**
2) Show SOL balance + public key
3) **Airdrop 1 SOL** (devnet only) with pending/confirmed UI
4) Display balances for a few SPL tokens, including **USDC (devnet mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)**
5) Transfer any SPL token to a user-provided address (creates ATA if missing)
6) Show recent transactions + explorer links
7) Include **TypeScript, JavaScript, and Python** comparison snippets in the README + small utility scripts for each language

### Tech & Quality Bar
- **Next.js 14+ (App Router)**, **React 18**, **TypeScript**
- Styling: **TailwindCSS** + **shadcn/ui** (Button, Card, Input, Toast)
- Solana libs: `@solana/web3.js`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@solana/wallet-adapter-react-ui`, `@solana/spl-token`
- Build/lint: `pnpm`, ESLint, Prettier
- Tests: one **Playwright** happy-path e2e (connect → airdrop → see balance change)

### Pages/Components (App Router)
- `/` (Home):
  - **ConnectWallet** section with a `<WalletMultiButton />`
  - **BalanceCard**: shows SOL balance (auto-refresh on slot change or on tx confirm)
  - **AirdropPanel**: Button “Airdrop 1 SOL” (only if cluster === devnet)
  - **SplBalances**: reads SPL balances for a tracked list of mints from `.env` (default includes USDC devnet)
  - **TransferForm**: fields { Mint Address, Recipient Address, Amount } → builds and sends a token transfer tx
  - **TxCenter**: toast + list of last 5 tx signatures with status (processing/confirmed/finalized) and Explorer links
- **components/**:
  - `providers/solana.tsx` – Connection + WalletAdapter providers
  - `ui/BalanceCard.tsx`, `ui/AirdropPanel.tsx`, `ui/SplBalances.tsx`, `ui/TransferForm.tsx`, `ui/TxToast.tsx`
- **lib/**:
  - `solana/connection.ts` – creates a `Connection` from `NEXT_PUBLIC_RPC_URL` defaulting to `https://api.devnet.solana.com`
  - `solana/tokens.ts` – helpers: derive ATA, fetch token accounts by owner, parse balances
  - `solana/tx.ts` – helpers: `sendAndConfirm`, `withErrorBoundary`, commitment config = "confirmed"
- **scripts/** (language comparisons):
  - `ts/airdrop.ts` – airdrop 1 SOL to a given pubkey (TypeScript)
  - `js/airdrop.js` – same in JavaScript
  - `py/airdrop.py` – same in Python using `solana` + `solders`
  - `ts/balance.ts`, `js/balance.js`, `py/balance.py` – print SOL + USDC balances for a given pubkey
  - Provide a small `README` section explaining how to install Python deps and run scripts

### Implementation Notes
- **Cluster-safety**: Detect the cluster; **disable airdrop** if not devnet. Gate features that assume devnet.
- **Wallet UX**: Use `@solana/wallet-adapter-react-ui`’s prebuilt connect button; show the short address & copy-to-clipboard.
- **Airdrop**: `connection.requestAirdrop(pubkey, 1 * LAMPORTS_PER_SOL)`, then `confirmTransaction` with latest blockhash.
- **SPL Balances**:
  - Load token accounts via `getParsedTokenAccountsByOwner`
  - Pretty-print amounts using mint decimals
  - Track mints from `.env`: `NEXT_PUBLIC_TRACKED_MINTS="4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"` (comma-separated)
- **TransferForm**:
  - Inputs: mint, recipient, amount (float)
  - Steps: derive sender ATA + recipient ATA (create if needed), build `createTransferInstruction` with correct decimals, sign & send via wallet
  - Show toasts for building, sending, confirmed; display the signature link to Explorer (devnet)
- **State & Perf**:
  - Use React Query or a small custom cache for balances keyed by (pubkey, mint)
  - Optimistic updates after tx send; reconcile on confirmation
  - Lightweight websocket subscription to slot or signature status
- **Error UX**:
  - Surface wallet errors (user reject, insufficient funds) in toasts
  - Retry button when RPC returns rate-limit/temporary network errors

### File Tree (generate all files)
.
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ page.tsx
├─ components/
│  ├─ providers/solana.tsx
│  └─ ui/{BalanceCard.tsx,AirdropPanel.tsx,SplBalances.tsx,TransferForm.tsx,TxToast.tsx}
├─ lib/solana/{connection.ts,tx.ts,tokens.ts}
├─ scripts/
│  ├─ ts/{airdrop.ts,balance.ts}
│  ├─ js/{airdrop.js,balance.js}
│  └─ py/{airdrop.py,balance.py}
├─ e2e/{example.spec.ts, playwright.config.ts}
├─ public/favicon.svg
├─ .env.example
├─ README.md
├─ package.json
├─ pnpm-lock.yaml
└─ tsconfig.json

### README (must include these)
- **Quickstart**
  - `pnpm i`
  - copy `.env.example` → `.env.local`
  - set `NEXT_PUBLIC_RPC_URL` (optional), `NEXT_PUBLIC_TRACKED_MINTS` (pre-fill USDC devnet)
  - `pnpm dev`
- **Feature tour** with screenshots/GIFs
- **TS vs JS vs Python comparison** (show minimal snippets for):
  1) Connect + fetch SOL balance (TS/JS in browser, Python via CLI)
  2) Devnet **airdrop**
  3) Read SPL token balances for a given mint (USDC devnet)
  4) Build & send SPL transfer
- **Security notes** (no private keys in frontend, never store secrets client-side)
- **Testing**: how to run Playwright

### Code Snippets (include verbatim in README)

**TypeScript (browser) – Airdrop 1 SOL**
```ts
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.devnet.solana.com', 'confirmed');
export async function airdrop(pubkey: string) {
  const pk = new PublicKey(pubkey);
  const sig = await connection.requestAirdrop(pk, 1 * LAMPORTS_PER_SOL);
  const bh = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature: sig, ...bh }, 'confirmed');
  return sig;
}
