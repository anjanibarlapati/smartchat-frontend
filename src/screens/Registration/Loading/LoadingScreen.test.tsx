import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingScreen from './LoadingScreen.tsx'; 

describe('LoadingScreen', () => {
    test('renders loading animation correctly', async () => {
        const { getByTestId } = render(<LoadingScreen/>);
        expect(getByTestId("animation")).toBeTruthy();
      });
});
