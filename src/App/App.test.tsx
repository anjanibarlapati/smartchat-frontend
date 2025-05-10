import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from 'react-native-splash-screen';
import App from './App.tsx';

const renderApp = () => {
  return render(<App />);
};

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));


test('Should call SplashScreen hide method on mounting',  () => {
  renderApp();
  expect(SplashScreen.hide).toHaveBeenCalled();
});
