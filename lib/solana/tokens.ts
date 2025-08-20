import { 
  PublicKey, 
  AccountInfo, 
  ParsedAccountData,
  TokenAmount 
} from '@solana/web3.js'
import { 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID 
} from '@solana/spl-token'
import { createConnection } from './connection'

export interface TokenBalance {
  mint: string
  balance: number
  decimals: number
  uiAmount: number
}

export async function deriveAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  )
}

export async function getTokenAccountsByOwner(
  owner: PublicKey
): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[]> {
  const connection = createConnection()
  const response = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })
  return response.value
}

export async function getTokenBalance(
  mint: PublicKey,
  owner: PublicKey
): Promise<TokenBalance | null> {
  try {
    console.log('getTokenBalance() mint:', mint.toString())
    console.log('getTokenBalance() owner:', owner.toString())
    const connection = createConnection()
    const ata = await deriveAssociatedTokenAddress(mint, owner)
    
    const accountInfo = await connection.getParsedAccountInfo(ata)
    
    if (!accountInfo.value) {
      return null
    }

    const parsedData = accountInfo.value.data as ParsedAccountData
    const tokenAmount = parsedData.parsed.info.tokenAmount as TokenAmount
    console.log('getTokenBalance() tokenAmount:', tokenAmount);
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

export async function getTrackedMints(): Promise<PublicKey[]> {
  const trackedMints = process.env.NEXT_PUBLIC_TRACKED_MINTS || ''
  if (!trackedMints) return []
  
  return trackedMints
    .split(',')
    .map(mint => mint.trim())
    .filter(mint => mint.length > 0)
    .map(mint => new PublicKey(mint))
}

export function formatTokenAmount(amount: number, decimals: number): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals)
}
