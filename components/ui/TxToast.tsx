'use client'

import { FC, useEffect, useState, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getExplorerUrl } from '@/lib/solana/tx'
import { getCluster } from '@/lib/solana/connection'

export interface TransactionRecord {
  signature: string
  status: 'pending' | 'confirmed' | 'finalized' | 'error'
  timestamp: number
  error?: string
}

export const TxToast: FC = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])

  useEffect(() => {
    if (!publicKey) {
      setTransactions([])
      return
    }

    // Load recent transactions from localStorage
    const stored = localStorage.getItem(`transactions_${publicKey.toString()}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTransactions(parsed.slice(0, 5)) // Keep only last 5
      } catch (error) {
        console.error('Error parsing stored transactions:', error)
      }
    }
  }, [publicKey])

  const addTransaction = useCallback(
    (tx: TransactionRecord) => {
      if (!publicKey) return

      const newTransactions = [tx, ...transactions].slice(0, 5)
      setTransactions(newTransactions)

      // Store in localStorage
      localStorage.setItem(
        `transactions_${publicKey.toString()}`,
        JSON.stringify(newTransactions)
      )
    },
    [publicKey, transactions]
  )

  const updateTransactionStatus = useCallback(
    (
      signature: string,
      status: TransactionRecord['status'],
      error?: string
    ) => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.signature === signature ? { ...tx, status, error } : tx
        )
      )
    },
    []
  )

  // Expose functions for other components to use
  useEffect(() => {
    ;(window as any).addTransaction = addTransaction
    ;(window as any).updateTransactionStatus = updateTransactionStatus

    return () => {
      delete (window as any).addTransaction
      delete (window as any).updateTransactionStatus
    }
  }, [addTransaction, updateTransactionStatus])

  if (!publicKey) {
    return null
  }

  const cluster = getCluster()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No recent transactions
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.signature}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </p>
                {tx.error && (
                  <p className="text-xs text-red-500 mt-1">{tx.error}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    tx.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : tx.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : tx.status === 'finalized'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {tx.status}
                </span>

                <a
                  href={getExplorerUrl(tx.signature, cluster)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
