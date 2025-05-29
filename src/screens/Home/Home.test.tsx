import { useNavigation } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import * as useAlertModalHook from '../../hooks/useAlertModal';
import { authReducer } from '../../redux/reducers/auth.reducer';
import { themeReducer } from '../../redux/reducers/theme.reducer';
import { store } from '../../redux/store';
import { Home } from './Home';

function renderHomeScreen() {
  return render(
    <Provider store={store}>
      <Home />
    </Provider>,
  );
}
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Home Screen', () => {
  const mockNavigate = jest.fn();
  const showAlertMock = jest.fn();
  const hideAlertMock = jest.fn();
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      reset: jest.fn(),
    });

    jest.spyOn(useAlertModalHook, 'useAlertModal').mockReturnValue({
      alertMessage: 'Test success message',
      alertType: 'success',
      alertVisible: true,
      hideAlert: hideAlertMock,
      showAlert: showAlertMock,
    });
    jest.clearAllMocks();
  });
  test('should render start conversation text correctly', async () => {
    const {getByText} = renderHomeScreen();
    expect(
      getByText(/Start Conversations with your closed ones/i),
    ).toBeTruthy();
  });
  test('Should render add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('addContact')).toBeTruthy();
  });

  test('Should navigate to ContactScreen on pressing add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    fireEvent.press(getByLabelText('addContact'));
    expect(mockNavigate).toHaveBeenCalledWith('Contact');
  });

  it('should show alert if successMessage exists in the store', () => {
    const storeWithSuccessMessage = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
      },
      preloadedState: {
        auth: {
          successMessage: "You've successfully logged in to SmartChat!",
        },
      },
    });
    render(
      <Provider store={storeWithSuccessMessage}>
        <Home />
      </Provider>,
    );
    expect(showAlertMock).toHaveBeenCalledWith(
      "You've successfully logged in to SmartChat!",
      'success',
    );
  });
  test('Should render the home image properly', () => {
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('home-image')).toBeTruthy();
  });
  test('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderHomeScreen();
    const homeImage = getByLabelText('home-image').parent?.parent;
    expect(homeImage?.props.style.paddingTop).toBe('15%');
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderHomeScreen();
    const homeImg = screen.getByLabelText('home-image').parent?.parent?.parent;
    expect(homeImg?.props.style.paddingTop).toBe('40%');
  });
});
