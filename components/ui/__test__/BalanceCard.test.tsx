import { render, screen } from '@testing-library/react'
import { BalanceCard } from '../BalanceCard'

// Mock the Solana wallet adapter hooks
jest.mock('@solana/wallet-adapter-react', () => ({
  useConnection: () => ({
    connection: {
      getBalance: jest.fn(),
      onAccountChange: jest.fn(),
      removeAccountChangeListener: jest.fn(),
    },
  }),
  useWallet: () => ({
    publicKey: null,
  }),
}))

// Mock Solana Web3.js
jest.mock('@solana/web3.js', () => ({
  LAMPORTS_PER_SOL: 1000000000,
}))

test('renders SOL Balance heading', () => {
  render(<BalanceCard />)
  expect(screen.getByText(/SOL Balance/i)).toBeInTheDocument()
})
