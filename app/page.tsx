'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceCard } from '@/components/ui/BalanceCard'
import { AirdropPanel } from '@/components/ui/AirdropPanel'
import { SplBalances } from '@/components/ui/SplBalances'
import { TransferForm } from '@/components/ui/TransferForm'
import { TxToast } from '@/components/ui/TxToast'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Solana Devnet dApp
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            A minimal Solana dApp for testing and development on devnet
          </p>
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !px-6 !py-2 !text-white" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <BalanceCard />
            <AirdropPanel />
            <SplBalances />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TransferForm />
            <TxToast />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Built by <a href="http://dolosplus.com">DOLOS+</a> with Solana
            Web3.js
          </p>
          <p className="text-xs mt-2">
            This dApp is configured for Solana devnet. Make sure your wallet is
            set to devnet.
          </p>
        </div>
      </div>
    </div>
  )
}
