
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import LoginScreen from './Login';
import * as LoginHandler from './Login.handler';
import React, { act } from 'react';
import { Alert } from 'react-native';

const renderLoginScreen = ()=>{
    return render(
        <LoginScreen/>
    );
};

describe('Login Screen check', ()=>{

    let mockRegister: jest.SpyInstance;
    beforeAll(() => {
      mockRegister = jest.spyOn(LoginHandler, 'login');
    });
    beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });
    afterAll(() => {
      mockRegister.mockRestore();
    });
    test('renders app logo correctly',()=>{
      const {getByLabelText} = renderLoginScreen();
      expect(getByLabelText('appLogo')).toBeTruthy();
    });
    test('checking the input fields', ()=>{
      const {getByPlaceholderText, getByText} = renderLoginScreen();
      expect(getByPlaceholderText('Mobile Number')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });
    test('show validattion errors when fileds are empty', async()=>{
      const{getByText, queryByText} = renderLoginScreen();
        fireEvent.press(getByText('Login'));
            await waitFor(() => {
              expect(queryByText('Mobile number is required')).toBeTruthy();
              expect(queryByText('Password is required')).toBeTruthy();
            });
    });
    test('no errors with valid inputs', async () => {
      const { getByText, getByPlaceholderText, queryByText } = renderLoginScreen();
      fireEvent.changeText(getByPlaceholderText('Mobile Number'), '1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Login'));
      await waitFor(() => {
        expect(queryByText('Mobile number is required')).toBeFalsy();
        expect(queryByText('Password is required')).toBeFalsy();
      });
    });

    it('should give an alert on successful login with message', async () => {
      const response = {
        ok: true,
        json: async () => ({ message: 'Login Successfully' }),
      };
      mockRegister.mockResolvedValue(response);
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByPlaceholderText('Mobile Number'), '1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('User Login Successfully!');
      });
  });
  it('should give an alert with error message if the API gives an error', async () => {
      const response = {
        ok: false,
        json: async () => ({ message: 'User do not exist' }),
      };
      mockRegister.mockResolvedValue(response);
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByPlaceholderText('Mobile Number'), '1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('User do not exist');
      });
    });
  it('should give an alert with Invalid error shows if API throws an error', async () => {
      mockRegister.mockRejectedValue(new Error('Internal server error'));
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      fireEvent.changeText(getByPlaceholderText('Mobile Number'), '5432123456');
      fireEvent.changeText(getByPlaceholderText('Password'), '1234');
      await act(async ()=> {
        fireEvent.press(getByText('Login'));
      });
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Invalid error!');
      });
  });
});
