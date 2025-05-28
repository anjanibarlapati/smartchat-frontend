import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {Home} from './Home';
import {store} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import * as useAlertModalHook from '../../hooks/useAlertModal';
import { authReducer } from '../../redux/reducers/auth.reducer';
import { configureStore } from '@reduxjs/toolkit';
import { themeReducer } from '../../redux/reducers/theme.reducer';

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
describe('Home Screen', () => {
  const mockNavigate = jest.fn();
  const showAlertMock = jest.fn();
  const hideAlertMock = jest.fn();
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
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
          successMessage: 'Profile updated successfully',
        },
      },
    });
    render(
      <Provider store={storeWithSuccessMessage}>
        <Home />
      </Provider>
    );
    expect(showAlertMock).toHaveBeenCalledWith('Profile updated successfully', 'success');
  });
});
