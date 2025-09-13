module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@solana|@noble|@walletconnect)/)',
  ],
  globals: {
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder,
  },
}