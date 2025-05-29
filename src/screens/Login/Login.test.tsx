import React, {act} from 'react';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useNavigation} from '@react-navigation/native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {generateKeyPair, storePublicKey} from '../../utils/keyPairs';
import LoginScreen from './Login';
import * as LoginService from './Login.service';

const renderLoginScreen = () => {
  return render(
    <Provider store={store}>
      <LoginScreen />
    </Provider>,
  );
};

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_keypair: jest.fn(),
  to_base64: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../utils/keyPairs', () => ({
  __esModule: true,
  generateKeyPair: jest.fn().mockResolvedValue({
    publicKey: 'mockPublicKey',
    privateKey: 'mockPrivateKey',
  }),
  storePublicKey: jest.fn().mockResolvedValue({ok: true}),
}));

describe('Login Screen check', () => {
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
  test('Should render app logo correctly', () => {
    const {getByLabelText} = renderLoginScreen();
    expect(getByLabelText('appLogo')).toBeTruthy();
  });
  test('Should render input fields', () => {
    const {getByLabelText, getByPlaceholderText, getByText} =
      renderLoginScreen();
    expect(getByLabelText('phone-input')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });
  test('Should show validation errors when fileds are empty', async () => {
    const {getByText, queryByText} = renderLoginScreen();
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(queryByText('Mobile number is required')).toBeTruthy();
      expect(queryByText('Password is required')).toBeTruthy();
    });
  });

  test('Should show error for invalid mobile number', async () => {
    const {getByLabelText, getByText, getByPlaceholderText, queryByText} =
      renderLoginScreen();
    fireEvent.changeText(getByLabelText('phone-input'), '+91 34567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(queryByText('Invalid mobile number')).toBeTruthy();
    });
  });
  test('Should not show errors for valid inputs', async () => {
    const {getByLabelText, getByText, getByPlaceholderText, queryByText} =
      renderLoginScreen();
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(queryByText('Mobile number is required')).toBeFalsy();
      expect(queryByText('Password is required')).toBeFalsy();
    });
  });
  it('Should successfully login upon valid credentials', async () => {
    const response = {
      ok: true,
      json: async () => ({user: {}, access_token: '', refresh_token: ''}),
    };
    mockRegister.mockResolvedValue(response);
    (EncryptedStorage.setItem as jest.Mock).mockResolvedValue({});
    const {getByLabelText, getByPlaceholderText, getByText} =
      renderLoginScreen();
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });
  });
  it('Should give an alert with error message if the API gives an error', async () => {
    const response = {
      ok: false,
      json: async () => ({message: 'User does not exist'}),
    };
    mockRegister.mockResolvedValue(response);
    const {getByLabelText, getByPlaceholderText, getByText} =
      renderLoginScreen();
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });
    await waitFor(() => {
      expect(getByText('User does not exist')).toBeTruthy();
    });
  });
  it('Should give an alert with Something went wrong. Please try again message if API throws an error', async () => {
    mockRegister.mockRejectedValue(new Error('Internal server error'));
    const {getByLabelText, getByPlaceholderText, getByText} =
      renderLoginScreen();
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });
    await waitFor(() => {
      expect(getByText('Something went wrong. Please try again')).toBeTruthy();
    });
  });
  it('Should navigate to Registration Screen on pressing login text', () => {
    const {getByText} = renderLoginScreen();
    fireEvent.press(getByText(/register/i));
    expect(mockReplace).toHaveBeenCalledWith('RegistrationScreen');
  });

  it('Should generate keys, store keys, and navigate to Home Screen on successful login', async () => {
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

    (generateKeyPair as jest.Mock).mockResolvedValue({
      publicKey: 'mockPublicKey',
      privateKey: 'mockPrivateKey',
    });

    (storePublicKey as jest.Mock).mockResolvedValue({ok: true});

    (EncryptedStorage.setItem as jest.Mock).mockResolvedValue(null);

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderLoginScreen();

    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), '1234');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(generateKeyPair).toHaveBeenCalled();
      expect(storePublicKey).toHaveBeenCalledWith(
        '1234567890',
        'mockPublicKey',
      );
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'privateKey',
        JSON.stringify({privateKey: 'mockPrivateKey'}),
      );
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{name: 'Tabs'}],
      });
    });
  });
  it('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderLoginScreen();
    const logo = getByLabelText('appLogo').parent;
    expect(logo?.props.style.width).toBe(300);
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderLoginScreen();
    const logoStyle = screen.getByLabelText('appLogo').parent;
    expect(logoStyle?.props.style.width).toBe(250);
  });
});
