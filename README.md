# Solana Devnet dApp

A tiny DeFi utility app in React, Solana dApp for testing and development on devnet. This dApp demonstrates core Solana functionality including wallet connection, balance checking, airdrops, SPL token operations, and transaction management. Opensource for any one to contribute. Let's make this better!

For Live site goto: https://solana-devnet-fv2nzr6hj-jak-ratiwanichs-projects.vercel.app/

## Features:

### 🔗 Wallet Connection
- Connect with Phantom, Solflare, and other Solana wallets
- Automatic wallet detection and connection
- Display wallet address and connection status

### 💰 Balance Management
- **SOL Balance**: Real-time SOL balance display with auto-refresh
- **SPL Token Balances**: Track multiple SPL tokens (defaults to USDC devnet)
- **Balance History**: View recent balance changes

### 🪂 Devnet Airdrop
- **1 SOL Airdrop**: Request free SOL for testing (devnet only)
- **Transaction Tracking**: Monitor airdrop status with Explorer links
- **Cluster Safety**: Automatically disabled on non-devnet networks

### 🔄 Token Transfers
- **SPL Token Transfers**: Send any SPL token to any address
- **Automatic ATA Creation**: Creates recipient token accounts if needed
- **Transaction Building**: Proper transaction construction with error handling
- **Real-time Status**: Track transaction confirmation status

### 📊 Transaction Center
- **Recent Transactions**: View last 5 transactions with status
- **Explorer Integration**: Direct links to Solana Explorer
- **Status Tracking**: Pending → Confirmed → Finalized status updates

## 🛠 Solana Stack
- **Solana**: `@solana/web3.js`, `@solana/spl-token`
- **Wallet Integration**: `@solana/wallet-adapter-react`

### Testing Airdrop and Balance Scripts

```bash
# Run airdrop script
node scripts/airdrop.js <public-key>

# Run balance script
node scripts/balance.js <public-key>
```


### Test Coverage
- **Happy Path**: Wallet connection → Airdrop → Balance verification
- **Component Rendering**: All UI components load correctly
- **Form Validation**: Transfer form validation and error handling
- **Responsive Design**: Mobile and desktop layout testing

## 🔒 Security Notes
⚠️ **Important Security Considerations**

- **No Private Keys**: This dApp never handles private keys directly
- **Client-Side Only**: All wallet operations happen in the browser
- **Devnet Only**: Airdrop functionality is restricted to devnet
- **Environment Variables**: Sensitive data is stored in environment variables
- **Input Validation**: All user inputs are validated before processing

## 🌐 Network Configuration

### Devnet Setup
- **RPC URL**: `https://api.devnet.solana.com`
- **USDC Mint**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Explorer**: `https://explorer.solana.com/?cluster=devnet`

### Wallet Configuration
Make sure your wallet is configured for **devnet**:
- **Phantom**: Settings → Developer Settings → Change Network → Devnet
- **Solflare**: Settings → Network → Devnet

### Environment Variables for Production
Set these in your deployment platform:
- `NEXT_PUBLIC_RPC_URL` - Your preferred RPC endpoint
- `NEXT_PUBLIC_TRACKED_MINTS` - Comma-separated token mints

## 📄 License

MIT License - see LICENSE file for details

### Common Issues

**Wallet Connection Fails**
- Ensure wallet is installed and unlocked
- Check that wallet is set to devnet
- Clear browser cache and try again

**Airdrop Not Working**
- Verify you're on devnet network
- Check RPC endpoint connectivity
- Wait a few minutes between airdrop requests

**Token Transfer Fails**
- Verify mint address is correct
- Check recipient address format
- Ensure sufficient SOL for transaction fees
