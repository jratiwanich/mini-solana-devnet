import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SolanaProvider } from '@/components/providers/solana'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solana Devnet dApp',
  description: 'A minimal Solana devnet dApp for testing and development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaProvider>
          {children}
          <Toaster position="top-right" />
        </SolanaProvider>
      </body>
    </html>
  )
}
