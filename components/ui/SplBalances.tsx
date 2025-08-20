'use client'

import { FC, useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import {
  getTokenBalance,
  getTrackedMints,
  TokenBalance,
} from '@/lib/solana/tokens'

export const SplBalances: FC = () => {
  const { publicKey } = useWallet()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBalances = useCallback(async () => {
    if (!publicKey) {
      setBalances([])
      return
    }

    setLoading(true)
    try {
      const mints = await getTrackedMints()
      console.log('getTrackedMints() mints:', mints)
      const balancePromises = mints.map((mint) =>
        getTokenBalance(mint, publicKey)
      )
      const results = await Promise.all(balancePromises)
      console.log('getTokenBalance() results:', results)
      const validBalances = results.filter(
        (balance) => balance !== null
      ) as TokenBalance[]
      setBalances(validBalances)
    } catch (error) {
      console.error('Error fetching SPL balances:', error)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SPL Token Balances
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your wallet to view token balances
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          SPL Token Balances
        </h3>
        <button
          onClick={fetchBalances}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded mb-1"></div>
              <div className="bg-gray-300 dark:bg-gray-600 h-6 w-24 rounded"></div>
            </div>
          ))}
        </div>
      ) : balances.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tracked tokens found
        </p>
      ) : (
        <div className="space-y-4">
          {balances.map((balance) => (
            <div
              key={balance.mint}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {balance.mint.slice(0, 4)}...{balance.mint.slice(-4)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Decimals: {balance.decimals}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {balance.uiAmount.toFixed(balance.decimals)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Raw: {balance.balance}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
