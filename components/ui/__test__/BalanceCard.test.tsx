import { render, screen } from '@testing-library/react'
import { BalanceCard } from '../BalanceCard'

test('renders SOL Balance heading', () => {
  render(<BalanceCard />)
  expect(screen.getByText(/SOL Balance/i)).toBeInTheDocument()
})
