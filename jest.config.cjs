module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFiles: ['whatwg-fetch'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', '!src/main.jsx'],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },
  extensionsToTreatAsEsm: ['.jsx'],
};