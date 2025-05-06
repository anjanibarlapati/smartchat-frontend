import App from './App.tsx';
import React from 'react';
import {render} from '@testing-library/react-native';

const renderApp = () => {
  return render(<App />);
};

test('renders welcome message correctly', async () => {
  const {getByTestId} = renderApp();
  expect(getByTestId('animation')).toBeTruthy();
});
