// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/atoms/(.*)$': '<rootDir>/src/components/atoms/$1',
    '^@/layouts/(.*)$': '<rootDir>/src/components/layouts/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
  },
};

export default createJestConfig(config);