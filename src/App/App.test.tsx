import React from 'react';
import {render} from '@testing-library/react-native';
import App from './App.tsx';

const renderApp = () => {
  return render(<App />);
};

test('renders welcome message correctly', async () => {
  const {getByTestId} = renderApp();
  expect(getByTestId('animation')).toBeTruthy();
});
