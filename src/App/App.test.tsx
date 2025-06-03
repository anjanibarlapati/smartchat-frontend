import { render, waitFor } from '@testing-library/react-native';
import i18next from 'i18next';
import React from 'react';
import App from './App';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

jest.mock('../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [{languageCode: 'en'}]),
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('react-native-device-info', ()=>({
  getDeviceId:jest.fn(),
}));

jest.mock('react-native-sqlite-storage', () => {
  const mockExecuteSql = jest.fn(async () => []);
  const mockDbInstance = {
    executeSql: mockExecuteSql,
    close: jest.fn(),
    transaction: jest.fn(),
    readTransaction: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
  };
  return {
    enablePromise: jest.fn(),
    DEBUG: jest.fn(),
    openDatabase: jest.fn(() => Promise.resolve(mockDbInstance)),
    deleteDatabase: jest.fn(),
  };
});



describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app component', async() => {
    const app = render(<App />);
     await waitFor(()=>{
     expect(app).toBeTruthy();
    });
  });

it('calls changeLanguage with "en" if English is in locale', async() => {
    const {getLocales} = require('react-native-localize');
    getLocales.mockReturnValue([{languageCode: 'en'}]);
    render(<App />);
    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
    });
  });

  it('calls changeLanguage with "te" if Telugu is in locale', async() => {
    const {getLocales} = require('react-native-localize');
    getLocales.mockReturnValue([{languageCode: 'te'}]);
    render(<App />);
    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('te');
    });
  });

  it('defaults to "en" if no supported language is found', async() => {
    const {getLocales} = require('react-native-localize');
    getLocales.mockReturnValue([{languageCode: 'fr'}]);
    render(<App />);
    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
    });
  });
});
