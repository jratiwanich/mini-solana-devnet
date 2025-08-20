const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js')
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = require('@solana/spl-token')

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.devnet.solana.com', 'confirmed')

async function getTokenBalance(mint, owner) {
  try {
    const ata = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
    const accountInfo = await connection.getParsedAccountInfo(ata)
    
    if (!accountInfo.value) {
      return null
    }

    const parsedData = accountInfo.value.data
    const tokenAmount = parsedData.parsed.info.tokenAmount

    return {
      mint: mint.toString(),
      balance: Number(tokenAmount.amount),
      decimals: tokenAmount.decimals,
      uiAmount: Number(tokenAmount.uiAmount),
    }
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return null
  }
}

async function getTrackedMints() {
  const trackedMints = process.env.NEXT_PUBLIC_TRACKED_MINTS || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
  
  return trackedMints
    .split(',')
    .map(mint => mint.trim())
    .filter(mint => mint.length > 0)
    .map(mint => new PublicKey(mint))
}

async function getBalances(pubkey) {
  const pk = new PublicKey(pubkey)
  
  // Get SOL balance
  const solBalance = await connection.getBalance(pk)
  console.log(`SOL Balance: ${(solBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`)
  
  // Get SPL token balances
  const mints = await getTrackedMints()
  console.log('\nSPL Token Balances:')
  
  for (const mint of mints) {
    const balance = await getTokenBalance(mint, pk)
    if (balance) {
      console.log(`${mint.toString().slice(0, 4)}...${mint.toString().slice(-4)}: ${balance.uiAmount.toFixed(balance.decimals)}`)
    } else {
      console.log(`${mint.toString().slice(0, 4)}...${mint.toString().slice(-4)}: 0`)
    }
  }
}

// Example usage
if (require.main === module) {
  const pubkey = process.argv[2]
  if (!pubkey) {
    console.error('Usage: node balance.js <public-key>')
    process.exit(1)
  }

  getBalances(pubkey)
    .then(() => {
      console.log('\nBalance check complete!')
    })
    .catch(error => {
      console.error('Balance check failed:', error)
      process.exit(1)
    })
}

module.exports = { getBalances, getTokenBalance }