import type { Config } from '@jest/types';

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Sync object
const config: Config.InitialOptions = {
  // START PRISMA CONFIGS
  verbose: true,
  clearMocks: true,
  preset: 'ts-jest',
  //testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/utils/prisma/singleton.ts', '<rootDir>/jest.setup.ts', 'dotenv/config'],
  moduleNameMapper: {
    '^utils/prisma/init': '<rootDir>/utils/prisma/singleton',
    '^utils/(.*)': '<rootDir>/utils/$1',
    '^pages/(.*)': '<rootDir>/pages/$1',
    '^components/(.*)': '<rootDir>/components/$1',
    '^consts': '<rootDir>/consts',
    '^test/(.*)': '<rootDir>/test/$1',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  // END PRISMA CONFIGS
  // START NEXTJS CONFIGS
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  // END NEXTJS CONFIGS
};
export default createJestConfig(config);
