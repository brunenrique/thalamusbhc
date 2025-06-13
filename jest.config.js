const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const webConfig = createJestConfig({
  displayName: 'web',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lucide-react)/)'
  ],
  testPathIgnorePatterns: [
    '/__tests__/.*rules\\.test\\.ts$'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
});

const firestoreConfig = {
  displayName: 'firestore',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/__tests__/**/*.rules.test.ts',
    '<rootDir>/__tests__/**/*firestore*.test.ts'
  ],
  testTimeout: 10000,
};

module.exports = async () => {
  return {
    projects: [await webConfig(), firestoreConfig],
  };
};
