// Jest configuration for ApexTime
// Docs: https://jestjs.io/docs/configuration

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/dist/'],
  // Ajoutez ici des mocks globaux si besoin
};
