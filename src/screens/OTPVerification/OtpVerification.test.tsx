import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import { OtpVerification } from './OtpVerification';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import * as OtpService from './OtpVerification.service';
import EncryptedStorage from 'react-native-encrypted-storage';
import { generateKeyPair, storeKeys } from '../../utils/keyPairs';
import { encryptPrivateKey, decryptPrivateKey } from '../../utils/privateKey';

jest.mock('../../hooks/appTheme', () => ({
  useAppTheme: () => ({
    primaryBackground: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
  }),
}));

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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    useRoute: () => ({
      params: { mobileNumber: '1234567890', email: 'test@gmail.com' },
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
});
