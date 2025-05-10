import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import WelcomeScreen from './Welcome.tsx';


jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const renderWelcomeScreen = () => {
  return render(
    <WelcomeScreen/>
  );
};

describe('WelcomeScreen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
    jest.clearAllMocks();
  });

  test('renders welcome screen messages correctly', () => {
    const {getByText} = renderWelcomeScreen();
    expect(getByText(/SmartChat/i)).toBeTruthy();
    expect(getByText(/Where conversations evolve/i)).toBeTruthy();
  });

  test('renders app logo correctly', () => {
    const {getByLabelText} = renderWelcomeScreen();
    expect(getByLabelText('appLogo')).toBeTruthy();
  });
  test('renders the lets get started button with chevron icon',()=>{
    const {getByText, getByLabelText} = renderWelcomeScreen();
    const buttonElement = getByText("Let's Get Started");
    expect(buttonElement).toBeTruthy();
    expect(getByLabelText('chevronIcon')).toBeTruthy();

  });
  test('navigates to RegistrationScreen on button press', () => {
    const { getByText } = render(<WelcomeScreen />);

    fireEvent.press(getByText("Let's Get Started"));
    expect(mockReplace).toHaveBeenCalledWith('RegistrationScreen');
  });
});
