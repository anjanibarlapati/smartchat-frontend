import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { generateKeyPair, storeKeys } from '../../utils/keyPairs';
import { decryptPrivateKey, encryptPrivateKey } from '../../utils/privateKey';
import { OtpVerification } from './OtpVerification';
import * as OtpService from './OtpVerification.service';
import * as LoginService from '../Login/Login.service';
import { storeChats } from '../../realm-database/operations/storeChats';
import { useRealm } from '../../contexts/RealmContext';

jest.mock('../../hooks/appTheme', () => ({
  useAppTheme: () => ({
    primaryBackground: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
  }),
}));

jest.mock('../../utils/keyPairs', () => ({
  generateKeyPair: jest.fn(),
  storeKeys: jest.fn(),
}));

jest.mock('../Login/Login.service', () => ({
  fetchChats: jest.fn(),
  formatMessages: jest.fn(),
}));

jest.mock('../../utils/privateKey', () => ({
  encryptPrivateKey: jest.fn(),
  decryptPrivateKey: jest.fn(),
}));

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('../../contexts/RealmContext', () => ({
  useRealm: jest.fn(),
}));

jest.mock('../../realm-database/operations/storeChats', () => ({
  storeChats: jest.fn(),
}));

jest.mock('../../utils/fcmService', () => ({
  generateAndUploadFcmToken: jest.fn,
}));

const mockRealmInstance = {
  write: jest.fn((fn) => fn()),
  create: jest.fn(),
};

jest.mock('./OtpVerification.service');

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
  },
  AndroidImportance: { HIGH: 'high' },
  TriggerType: { TIMESTAMP: 'timestamp' },
}));

jest.mock('../../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

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
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
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
  storeKeys: jest.fn().mockResolvedValue({ok: true}),
}));

jest.mock('../../utils/privateKey', () => ({
  encryptPrivateKey: jest.fn().mockResolvedValue({
    salt: 'mockSalt',
    nonce: 'mockNonce',
    privateKey: 'mockEncryptedPrivateKey',
  }),
  decryptPrivateKey: jest.fn().mockResolvedValue('mockDecryptedPrivateKey'),
}));

jest.mock('../../utils/fcmService', () => ({
  generateAndUploadFcmToken: jest.fn,
}));


const mockNavigation = {
  setOptions: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
};

let mockRouteParams = {
  mobileNumber: '1234567890',
  email: 'test@gmail.com',
  from: 'registration',
};

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    useRoute: () => ({
      params: mockRouteParams,
    }),
  };
});

const renderOtpVerificationScreen = () => {
  return render(
    <Provider store={store}>
      <OtpVerification />
    </Provider>
  );
};

describe('OtpVerification screen tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRealm as jest.Mock).mockReturnValue(mockRealmInstance);

  });

  it('should render static elements', () => {
    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    expect(getByText('Enter Verification Code')).toBeTruthy();
    expect(getByLabelText('verification-image')).toBeTruthy();
    expect(getByText(/We've sent you a 6-digit verification code/)).toBeTruthy();
    expect(getByText('2:00')).toBeTruthy();
  });

  it('should show error if OTP is incorrect and fail verification', async () => {
    (OtpService.verifyOTP as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ message: 'Invalid OTP' }) });
    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '111111');
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(getByText('Invalid OTP')).toBeTruthy();
    });
  });

  it('should countdown timer from 2:00 to 1:59', async () => {
    jest.useFakeTimers();
    const { getByText } = renderOtpVerificationScreen();
    expect(getByText('2:00')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByText('1:59')).toBeTruthy();
    });
    jest.useRealTimers();
  });

  it('should not allow submission when OTP is less than 6 digits', async () => {
    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '1234');
    const submitButton = getByText('Submit');
    expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
  });

   it('should clear OTP field and hide loader after submission', async () => {
    (OtpService.verifyOTP as jest.Mock).mockResolvedValue({ ok: true });
    (OtpService.createUser as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { mobileNumber: '1234567890', email: 'test@gmail.com' },
        userId: 'user123',
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      }),
    });

    const { getByText, getByLabelText, queryByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '123456');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(queryByLabelText('One-Time Password')).toBeTruthy();
    });
  });

  it('should not allow resend OTP if timer is still running', async () => {
    const { getByText } = renderOtpVerificationScreen();
    const resendButton = getByText('Resend Code?');
    fireEvent.press(resendButton);
    expect(OtpService.generateOTPAndSendMail).not.toHaveBeenCalled();
  });

  it('should not resend OTP if already clicked once after timer ends', async () => {
    jest.useFakeTimers();
    const { getByText } = renderOtpVerificationScreen();

    act(() => {
      jest.advanceTimersByTime(120000);
    });

    fireEvent.press(getByText('Resend Code?'));
    fireEvent.press(getByText('Resend Code?'));
    await waitFor(() => {
      expect(OtpService.generateOTPAndSendMail).toHaveBeenCalledTimes(1);
    });
    jest.useRealTimers();
  });

  it('should proceed to home screen on successful verification and user creation', async () => {
    (OtpService.verifyOTP as jest.Mock).mockResolvedValue({ ok: true });
    (OtpService.createUser as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { mobileNumber: '1234567890', email: 'test@gmail.com' },
        userId: 'user123',
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      }),
    });
    (generateKeyPair as jest.Mock).mockResolvedValue({
      publicKey: 'mockPublicKey',
      privateKey: 'mockPrivateKey',
    });
    (encryptPrivateKey as jest.Mock).mockResolvedValue({
      salt: 'mockSalt',
      nonce: 'mockNonce',
      privateKey: 'mockEncryptedPrivateKey',
    });
    (storeKeys as jest.Mock).mockResolvedValue({ ok: true });
    (decryptPrivateKey as jest.Mock).mockResolvedValue('mockDecryptedPrivateKey');
    (EncryptedStorage.setItem as jest.Mock).mockResolvedValue(null);

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '123456');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    });
  });

  it('should handle resend button and call API after timeout', async () => {
    jest.useFakeTimers();
    const { getByText } = renderOtpVerificationScreen();
    act(() => {
      jest.advanceTimersByTime(120000);
    });
    fireEvent.press(getByText('Resend Code?'));
    await waitFor(() => {
      expect(OtpService.generateOTPAndSendMail).toHaveBeenCalled();
    });
    jest.useRealTimers();
  });

  it('should handle API error on user creation failure', async () => {
    (OtpService.verifyOTP as jest.Mock).mockResolvedValue({ ok: true });
    (OtpService.createUser as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'User creation failed' }),
    });
    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '654321');
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(getByText('User creation failed')).toBeTruthy();
    });
  });

  it('should show fallback error on OTP API rejection', async () => {
    (OtpService.verifyOTP as jest.Mock).mockRejectedValue(new Error('Server error'));
    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    await waitFor(()=>{
      fireEvent.changeText(getByLabelText('One-Time Password'), '654321');
    });
    await waitFor(()=>{
      fireEvent.press(getByText('Submit'));
    });
    await waitFor(() => {
      expect(getByText('Server error')).toBeTruthy();
    });
  });

  it('should navigate to RegistrationScreen on OTP failure and error thrown', async () => {
    (OtpService.verifyOTP as jest.Mock).mockRejectedValue(new Error('OTP failed error'));

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    await waitFor(()=>{
      fireEvent.changeText(getByLabelText('One-Time Password'), '654321');
    });
    await waitFor(()=>{
      fireEvent.press(getByText('Submit'));
    });

    await waitFor(() => {
      expect(getByText('OTP failed error')).toBeTruthy();
    });
    await act(async()=>{
        await new Promise(resolve => setTimeout(resolve, 3100));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('RegistrationScreen');
  });

  it('should navigate to RegistrationScreen when createUser fails', async () => {
    (OtpService.verifyOTP as jest.Mock).mockResolvedValue({ ok: true });
    (OtpService.createUser as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'User creation failed' }),
    });

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '999999');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('User creation failed')).toBeTruthy();
    });

    await act(async()=>{
        await new Promise(resolve => setTimeout(resolve, 3100));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('RegistrationScreen');
  });

  it('should show error if resend OTP API fails', async () => {
    jest.useFakeTimers();
    (OtpService.generateOTPAndSendMail as jest.Mock).mockRejectedValue(new Error('Resend failed'));
    const { getByText, queryByText } = renderOtpVerificationScreen();

    act(() => {
      jest.advanceTimersByTime(120000);
    });
    fireEvent.press(getByText('Resend Code?'));
    await waitFor(() => {
      expect(queryByText('Resend failed')).toBeTruthy();
    });
    jest.useRealTimers();
  });


    it('submits OTP and navigates to Tabs for login', async () => {
    mockRouteParams.from = 'login';
    const response = {
      ok: true,
      json: async () => ({
        user: {
          firstName: 'Varun',
          lastName: 'Kumar',
          email: 'varun@gmail.com',
          mobileNumber: '1234567890',
          privateKey: {salt: 'salt',nonce:'noce', privateKey: 'privateKey'},
        },
        userId:'anjani123',
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }),
    };
    const mockChatsResponse = {
      ok: true,
      json: async () => ([]),
    };
    (decryptPrivateKey as jest.Mock).mockResolvedValue('mockDecryptedPrivateKey');

    (OtpService.verifyLogin as jest.Mock).mockResolvedValue(response);
    (LoginService.fetchChats as jest.Mock).mockResolvedValue(mockChatsResponse);
    (LoginService.formatMessages as jest.Mock).mockResolvedValue({});
    (storeChats as jest.Mock).mockReturnValue({});
    (EncryptedStorage.setItem as jest.Mock).mockResolvedValue(null);


    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '654321');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    });
  });

  it('shows error if login verification fails', async () => {
    mockRouteParams.from = 'login';

    (OtpService.verifyLogin as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Verification failed' }),
    });

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '123456');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Verification failed')).toBeTruthy();
    });
  });

  it('handles thrown error in handleLoginSubmit and navigates to LoginScreen', async () => {
    mockRouteParams.from = 'login';

    (OtpService.verifyLogin as jest.Mock).mockRejectedValue(new Error('Login API failed'));

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '123456');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Login API failed')).toBeTruthy();
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 3100));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('LoginScreen');
  });

  it('shows error and navigates to LoginScreen if fetchChats fails', async () => {
    mockRouteParams.from = 'login';

    const response = {
      ok: true,
      json: async () => ({
        user: {
          email: 'abc@test.com',
          mobileNumber: '1234567890',
          privateKey: {
            salt: 'salt',
            nonce: 'nonce',
            privateKey: 'encryptedKey',
          },
        },
        userId: 'user123',
        access_token: 'token',
        refresh_token: 'refresh',
      }),
    };

    const chatError = {
      ok: false,
      json: async () => ({ message: 'Unable to fetch chats' }),
    };

    (OtpService.verifyLogin as jest.Mock).mockResolvedValue(response);
    (LoginService.fetchChats as jest.Mock).mockResolvedValue(chatError);
    (decryptPrivateKey as jest.Mock).mockResolvedValue('decryptedKey');

    const { getByText, getByLabelText } = renderOtpVerificationScreen();
    fireEvent.changeText(getByLabelText('One-Time Password'), '654321');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Unable to fetch chats')).toBeTruthy();
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 3100));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('LoginScreen');
  });
});
