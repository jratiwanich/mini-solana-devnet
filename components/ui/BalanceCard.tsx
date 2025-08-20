'use client'

import { FC, useEffect, useState, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const BalanceCard: FC = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null)
      return
    }

    setLoading(true)
    try {
      const bal = await connection.getBalance(publicKey)
      setBalance(bal / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }, [publicKey, connection])

  useEffect(() => {
    fetchBalance()

    // Subscribe to account changes
    if (publicKey) {
      const subscriptionId = connection.onAccountChange(publicKey, () => {
        fetchBalance()
      })

      return () => {
        connection.removeAccountChangeListener(subscriptionId)
      }
    }
  }, [publicKey, connection, fetchBalance])

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SOL Balance
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your wallet to view balance
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        SOL Balance
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">◎</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? (
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded"></div>
            ) : balance !== null ? (
              balance.toFixed(4)
            ) : (
              '0.0000'
            )}
          </span>
        </div>
        <button
          onClick={fetchBalance}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </p>
    </div>
  )
}
