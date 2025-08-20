'use client'

import { FC, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { sendAndConfirmTransaction, getExplorerUrl } from '@/lib/solana/tx'
import toast from 'react-hot-toast'

export const TransferForm: FC = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [mintAddress, setMintAddress] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!mintAddress || !recipientAddress || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Building transaction...')

    try {
      // Validate addresses
      const mint = new PublicKey(mintAddress)
      const recipient = new PublicKey(recipientAddress)
      const amountNum = parseFloat(amount)

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount')
      }

      toast.loading('Creating token accounts...', { id: toastId })

      // Get token info for decimals
      const mintInfo = await connection.getParsedAccountInfo(mint)
      if (!mintInfo.value) {
        throw new Error('Invalid mint address')
      }

      const decimals = (mintInfo.value.data as any).parsed.info.decimals
      const transferAmount = Math.floor(amountNum * Math.pow(10, decimals))

      // Derive ATAs
      const senderAta = await getAssociatedTokenAddress(mint, publicKey)
      const recipientAta = await getAssociatedTokenAddress(mint, recipient)

      // Check if recipient ATA exists
      const recipientAtaInfo = await connection.getAccountInfo(recipientAta)
      const needsCreateAta = !recipientAtaInfo

      // Build transaction
      const transaction = new Transaction()

      // Create recipient ATA if needed
      if (needsCreateAta) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientAta,
            recipient,
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        )
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderAta,
          recipientAta,
          publicKey,
          transferAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      )

      // Set recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash('finalized')
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      toast.loading('Signing transaction...', { id: toastId })

      // Sign and send
      const signedTx = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      )

      toast.loading('Confirming transaction...', { id: toastId })

      // Confirm transaction
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction(
        {
          signature,
          ...latestBlockhash,
        },
        'confirmed'
      )

      toast.success(
        (t) => (
          <div>
            <p>Transfer successful!</p>
            <a
              href={getExplorerUrl(signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on Explorer
            </a>
          </div>
        ),
        { id: toastId }
      )

      // Reset form
      setMintAddress('')
      setRecipientAddress('')
      setAmount('')
    } catch (error) {
      console.error('Transfer failed:', error)
      toast.error(
        `Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: toastId }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transfer SPL Token
      </h3>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mint Address
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient address..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={!publicKey || loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Transfer Token'}
        </button>

        {!publicKey && (
          <p className="text-sm text-gray-400 text-center">
            Connect your wallet to transfer tokens
          </p>
        )}
      </form>
    </div>
  )
}
