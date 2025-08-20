'use client'

import { FC, ReactNode, useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { createConnection, getCluster } from '@/lib/solana/connection'

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css')

interface Props {
  children: ReactNode
}

export const SolanaProvider: FC<Props> = ({ children }) => {
  const network = useMemo(() => {
    const cluster = getCluster()
    switch (cluster) {
      case 'mainnet-beta':
        return WalletAdapterNetwork.Mainnet
      case 'devnet':
        return WalletAdapterNetwork.Devnet
      case 'testnet':
        return WalletAdapterNetwork.Testnet
      default:
        return WalletAdapterNetwork.Devnet
    }
  }, [])

  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
