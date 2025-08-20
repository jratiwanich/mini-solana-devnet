import { Connection, Commitment } from '@solana/web3.js'

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
const COMMITMENT: Commitment = 'confirmed'

export function createConnection(): Connection {
  return new Connection(RPC_URL, COMMITMENT)
}

export function getCluster(): 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet' {
  if (RPC_URL.includes('mainnet')) return 'mainnet-beta'
  if (RPC_URL.includes('devnet')) return 'devnet'
  if (RPC_URL.includes('testnet')) return 'testnet'
  return 'localnet'
}

export function isDevnet(): boolean {
  return getCluster() === 'devnet'
}
