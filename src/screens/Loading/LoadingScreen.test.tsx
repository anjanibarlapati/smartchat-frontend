import LoadingScreen from './LoadingScreen.tsx';
import React from 'react';
import {render} from '@testing-library/react-native';

describe('LoadingScreen', () => {
  test('renders loading animation correctly', async () => {
    const {getByTestId} = render(<LoadingScreen />);
    expect(getByTestId('animation')).toBeTruthy();
  });
});
