import App from './App.tsx';
import React from 'react';
import {render} from '@testing-library/react-native';
import SplashScreen from 'react-native-splash-screen';
const renderApp = () => {
  return render(<App />);
};

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));

test('renders welcome screen correctly', async () => {
  const {getByText} = renderApp();
  const smartchatText = getByText('SmartChat');
  expect(smartchatText).toBeTruthy();
});

test('calls SplashScreen.hide on mount',  () => {
  render(<App />);
    expect(SplashScreen.hide).toHaveBeenCalled();
});
