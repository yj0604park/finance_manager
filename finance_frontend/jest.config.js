module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@tanstack)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/types/',
    '/src/utils/test-utils.tsx',
    '/src/__mocks__/'
  ]
};
