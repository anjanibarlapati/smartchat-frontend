import {fireEvent, render, waitFor} from '@testing-library/react-native';
import LoginScreen from './Login';
import React from 'react';

const renderLoginScreen = ()=>{
    return render(
        <LoginScreen/>
    );
};

describe('Login Screen check', ()=>{
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
});
