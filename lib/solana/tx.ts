import { 
  Connection, 
  Transaction, 
  PublicKey, 
  TransactionSignature,
  LAMPORTS_PER_SOL,
  SendOptions
} from '@solana/web3.js'
import { createConnection } from './connection'

export interface TransactionStatus {
  signature: string
  status: 'pending' | 'confirmed' | 'finalized' | 'error'
  error?: string
}

export async function requestAirdrop(
  publicKey: PublicKey,
  amount: number = 1
): Promise<TransactionSignature> {
  const connection = createConnection()
  const signature = await connection.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  )
  
  const latestBlockhash = await connection.getLatestBlockhash()
  await connection.confirmTransaction({
    signature,
    ...latestBlockhash
  }, 'confirmed')
  
  return signature
}

export async function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  signers: any[],
  options?: SendOptions
): Promise<TransactionSignature> {
  try {
    const latestBlockhash = await connection.getLatestBlockhash()
    transaction.recentBlockhash = latestBlockhash.blockhash
    transaction.feePayer = signers[0].publicKey

    const signature = await connection.sendTransaction(transaction, signers, options)
    
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash
    }, 'confirmed')
    
    return signature
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

export async function withErrorBoundary<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error(errorMessage, error)
    throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getExplorerUrl(signature: string, cluster: string = 'devnet'): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
}
