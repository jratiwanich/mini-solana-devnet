import { test, expect } from '@playwright/test'

test.describe('Solana Devnet dApp', () => {
  test('should load the application and show wallet connection', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads with the correct title
    await expect(page).toHaveTitle(/Solana Devnet dApp/)
    
    // Check that the main heading is visible
    await expect(page.getByRole('heading', { name: 'Solana Devnet dApp' })).toBeVisible()
    
    // Check that the wallet connect button is present
    await expect(page.getByRole('button', { name: /connect/i })).toBeVisible()
    
    // Check that all main components are rendered
    await expect(page.getByText('SOL Balance')).toBeVisible()
    await expect(page.getByText('SOL Airdrop')).toBeVisible()
    await expect(page.getByText('SPL Token Balances')).toBeVisible()
    await expect(page.getByText('Transfer SPL Token')).toBeVisible()
    await expect(page.getByText('Recent Transactions')).toBeVisible()
  })

  test('should show devnet warning when not connected', async ({ page }) => {
    await page.goto('/')
    
    // Check that the airdrop panel shows devnet-only message
    await expect(page.getByText('Airdrop is only available on devnet')).toBeVisible()
    
    // Check that balance card shows connect message
    await expect(page.getByText('Connect your wallet to view balance')).toBeVisible()
    
    // Check that SPL balances shows connect message
    await expect(page.getByText('Connect your wallet to view token balances')).toBeVisible()
    
    // Check that transfer form shows connect message
    await expect(page.getByText('Connect your wallet to transfer tokens')).toBeVisible()
  })

  test('should have proper form validation in transfer form', async ({ page }) => {
    await page.goto('/')
    
    // Find the transfer form
    const transferForm = page.getByText('Transfer SPL Token').locator('..')
    
    // Check that all form fields are present
    await expect(transferForm.getByLabel('Mint Address')).toBeVisible()
    await expect(transferForm.getByLabel('Recipient Address')).toBeVisible()
    await expect(transferForm.getByLabel('Amount')).toBeVisible()
    
    // Check that the transfer button is disabled when not connected
    await expect(transferForm.getByRole('button', { name: 'Transfer Token' })).toBeDisabled()
  })

  test('should display proper footer information', async ({ page }) => {
    await page.goto('/')
    
    // Check footer content
    await expect(page.getByText('Built with Next.js, React, TypeScript, and Solana Web3.js')).toBeVisible()
    await expect(page.getByText('This dApp is configured for Solana devnet')).toBeVisible()
  })
})
