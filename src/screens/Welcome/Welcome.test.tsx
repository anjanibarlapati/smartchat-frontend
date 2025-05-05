import React from 'react';
import {render} from '@testing-library/react-native';
import WelcomeScreen from './Welcome.tsx';

const renderWelcomeScreen = () => {
  return render(
    <WelcomeScreen/>
  );
};

describe('WelcomeScreen', () => {
  test('renders welcome screen messages correctly', () => {
    const {getByText} = renderWelcomeScreen();
    expect(getByText(/SmartChat/i)).toBeTruthy();
    expect(getByText(/Where conversations evolve/i)).toBeTruthy();
  });

  test('renders app logo correctly', () => {
    const {getByTestId} = renderWelcomeScreen();
    expect(getByTestId('app-logo')).toBeTruthy();
  });
  test('renders the lets get started button',()=>{
    const {getByText}=renderWelcomeScreen();
    const buttonElement=getByText("Let's Get Started");
    expect(buttonElement).toBeTruthy()
})
});
