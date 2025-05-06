import App from './App.tsx';
import React from 'react';
import {render} from '@testing-library/react-native';

const renderApp = () => {
  return render(<App />);
};

test('renders welcome screen correctly', async () => {
  const { getByText } = renderApp();
  const smartchatText = getByText('SmartChat');
  expect(smartchatText).toBeTruthy();
});
