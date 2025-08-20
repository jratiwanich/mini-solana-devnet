'use client'

import { FC, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { requestAirdrop, getExplorerUrl } from '@/lib/solana/tx'
import { isDevnet } from '@/lib/solana/connection'
import toast from 'react-hot-toast'

export const AirdropPanel: FC = () => {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)

  const handleAirdrop = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isDevnet()) {
      toast.error('Airdrop is only available on devnet')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Requesting airdrop...')

    try {
      const signature = await requestAirdrop(publicKey, 1)

      toast.success(
        (t) => (
          <div>
            <p>Airdrop successful!</p>
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
    } catch (error) {
      console.error('Airdrop failed:', error)
      toast.error(
        `Airdrop failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: toastId }
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isDevnet()) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SOL Airdrop
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Airdrop is only available on devnet
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        SOL Airdrop
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Get 1 SOL for testing on devnet
      </p>
      <button
        onClick={handleAirdrop}
        disabled={!publicKey || loading}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Requesting...' : 'Airdrop 1 SOL'}
      </button>
      {!publicKey && (
        <p className="text-sm text-gray-400 mt-2">
          Connect your wallet to request airdrop
        </p>
      )}
    </div>
  )
}
