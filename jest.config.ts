import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'react-native',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/assets/',
    '__tests__/',
    'src/App/App.tsx',
  ],
  transformIgnorePatterns: [
      'node_modules/(?!@react-native|react-native|@react-native/js-polyfills|react-native-image-crop-picker|@react-navigation|react-native-permissions|react-native-contacts|@react-native-community/netinfo)',
  ],
};

export default config;
