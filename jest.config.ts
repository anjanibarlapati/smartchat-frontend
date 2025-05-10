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
    '/public/assets/',
    '__tests__/',
  ],
  transformIgnorePatterns: [
      'node_modules/(?!@react-native|react-native|@react-native/js-polyfills|react-native-image-crop-picker|@react-navigation)',
  ],
};

export default config;
