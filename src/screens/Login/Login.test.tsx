import React, { act } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import LoginScreen from './Login';
import * as LoginService from './Login.service';
import { store } from '../../redux/store';


const renderLoginScreen = ()=>{
    return render(
      <Provider store={store}>
         <LoginScreen />
      </Provider>
    );
};

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

describe('Login Screen check', ()=>{

    let mockRegister: jest.SpyInstance;
    const mockReplace = jest.fn();
    const mockReset = jest.fn();


    beforeAll(() => {
      mockRegister = jest.spyOn(LoginService, 'login');
    });
    beforeEach(() => {
      jest.resetAllMocks();
      (useNavigation as jest.Mock).mockReturnValue({
        replace: mockReplace,
        reset: mockReset,
      });
      jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });
    afterAll(() => {
      mockRegister.mockRestore();
    });
    test('Should render app logo correctly',()=>{
      const {getByLabelText} = renderLoginScreen();
      expect(getByLabelText('appLogo')).toBeTruthy();
    });
    test('Should render input fields', ()=>{
      const { getByLabelText, getByPlaceholderText, getByText} = renderLoginScreen();
      expect(getByLabelText('phone-input')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });
    test('Should show validation errors when fileds are empty', async()=>{
      const{getByText, queryByText} = renderLoginScreen();
        fireEvent.press(getByText('Login'));
            await waitFor(() => {
              expect(queryByText('Mobile number is required')).toBeTruthy();
              expect(queryByText('Password is required')).toBeTruthy();
            });
    });

    test('Should show error for invalid mobile number', async () => {
      const { getByLabelText, getByText, getByPlaceholderText, queryByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 34567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Login'));
      await waitFor(() => {
        expect(queryByText('Invalid mobile number')).toBeTruthy();
      });
    });
    test('Should not show errors for valid inputs', async () => {
      const { getByLabelText, getByText, getByPlaceholderText, queryByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Login'));
      await waitFor(() => {
        expect(queryByText('Mobile number is required')).toBeFalsy();
        expect(queryByText('Password is required')).toBeFalsy();
      });
    });

    it('Should give an alert on successful login with message', async () => {
      const response = {
        ok: true,
        json: async () => ({ message: 'Login Successful' }),
      };
      mockRegister.mockResolvedValue(response);
      const { getByLabelText, getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('You’ve successfully logged in to SmartChat!');
      });
    });
    it('Should give an alert with error message if the API gives an error', async () => {
      const response = {
        ok: false,
        json: async () => ({ message: 'User do not exist' }),
      };
      mockRegister.mockResolvedValue(response);
      const { getByLabelText, getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('User do not exist');
      });
    });
    it('Should give an alert with Something went wrong. Please try again message if API throws an error', async () => {
      mockRegister.mockRejectedValue(new Error('Internal server error'));
      const { getByLabelText, getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Something went wrong. Please try again');
      });
    });
    it('Should navigate to Registration Screen on pressing login text', () => {
      const { getByText } = renderLoginScreen();

      fireEvent.press(getByText(/register/i));
      expect(mockReplace).toHaveBeenCalledWith('RegistrationScreen');
    });

    it('Should navigate to Home Screen on successful login', async () => {
      const response = {
        ok: true,
        json: async () => ({
            user: {
            firstName: 'Varun',
            lastName: 'Kumar',
            email: 'varun@gmail.com',
            mobileNumber: '1234567890',
          },
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        }),
      };
      mockRegister.mockResolvedValue(response);
      const { getByLabelText, getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });

    });
});
