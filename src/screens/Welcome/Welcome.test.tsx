import { useNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store.ts';
import WelcomeScreen from './Welcome.tsx';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const renderWelcomeScreen = () => {
  return render(
    <Provider store={store}>
      <WelcomeScreen />
    </Provider>,
  );
};

describe('Welcome Screen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
    jest.clearAllMocks();
  });

  test('Should render welcome screen messages correctly', () => {
    const {getByText} = renderWelcomeScreen();
    expect(getByText(/SmartChat/i)).toBeTruthy();
    expect(getByText(/Where conversations evolve/i)).toBeTruthy();
  });

  test('Should render app logo correctly', () => {
    const {getByLabelText} = renderWelcomeScreen();
    expect(getByLabelText('appLogo')).toBeTruthy();
  });
  test('Should render the lets get started button with chevron icon', () => {
    const {getByText, getByLabelText} = renderWelcomeScreen();
    const buttonElement = getByText("Let's Get Started");
    expect(buttonElement).toBeTruthy();
    expect(getByLabelText('chevronIcon')).toBeTruthy();
  });
  test('Should navigate to RegistrationScreen on button press', () => {
    const {getByText} = renderWelcomeScreen();

    fireEvent.press(getByText("Let's Get Started"));
    expect(mockReplace).toHaveBeenCalledWith('RegistrationScreen');
  });
  it('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderWelcomeScreen();
    const container = getByLabelText('appLogo').parent?.parent;
    expect(container?.props.style.paddingHorizontal).toBe(20);
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderWelcomeScreen();
    const conatinerr = screen.getByLabelText('appLogo').parent?.parent;
    expect(conatinerr?.props.style.paddingHorizontal).toBe(10);
  });
});
