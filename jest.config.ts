// eslint-disable-next-line no-undef
/*
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['utils/prisma/singleton.ts'],
};
*/
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/utils/prisma/singleton.ts'],
  moduleNameMapper: {
    '@utils': '<rootDir>/utils',
    'utils/(.*)': '<rootDir>/utils/$1',
  },
};
export default config;
