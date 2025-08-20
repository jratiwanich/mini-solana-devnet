const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js')

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.devnet.solana.com', 'confirmed')

async function airdrop(pubkey) {
  const pk = new PublicKey(pubkey)
  const sig = await connection.requestAirdrop(pk, 1 * LAMPORTS_PER_SOL)
  const bh = await connection.getLatestBlockhash()
  await connection.confirmTransaction({ signature: sig, ...bh }, 'confirmed')
  return sig
}

// Example usage
if (require.main === module) {
  const pubkey = process.argv[2]
  if (!pubkey) {
    console.error('Usage: node airdrop.js <public-key>')
    process.exit(1)
  }

  airdrop(pubkey)
    .then(signature => {
      console.log('Airdrop successful!')
      console.log('Signature:', signature)
      console.log('Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    })
    .catch(error => {
      console.error('Airdrop failed:', error)
      process.exit(1)
    })
}

module.exports = { airdrop }
