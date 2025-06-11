import {
    AuthorizationStatus,
    getToken,
    isDeviceRegisteredForRemoteMessages,
    registerDeviceForRemoteMessages,
    requestPermission,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
    generateAndUploadFcmToken,
    uploadFcmToken,
} from '../utils/fcmService';

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

jest.mock('react-native', () => ({
    Platform: {
      OS: 'android',
    },
    PermissionsAndroid: {
      check: jest.fn(),
      request: jest.fn(),
      RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
      },
      PERMISSIONS: {
        POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
      },
    },
}));

jest.mock('@react-native-firebase/messaging', () => ({
  AuthorizationStatus: {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
    DENIED: 0,
  },
  getMessaging: jest.fn(() => ({})),
  requestPermission: jest.fn(),
  getToken: jest.fn(),
  isDeviceRegisteredForRemoteMessages: jest.fn(),
  registerDeviceForRemoteMessages: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('Tests related to the generateAndUploadFcmToken function', () => {
  const mockMobile = '9999999999';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should skips if iOS permission is denied', async () => {
    Platform.OS = 'ios';
    (requestPermission as jest.Mock).mockResolvedValue(0);
    await generateAndUploadFcmToken(mockMobile);
    expect(getToken).not.toHaveBeenCalled();
  });

  it('Should handles iOS with PROVISIONAL permission', async () => {
    Platform.OS = 'ios';
    (requestPermission as jest.Mock).mockResolvedValue(AuthorizationStatus.PROVISIONAL);
    (isDeviceRegisteredForRemoteMessages as jest.Mock).mockResolvedValue(false);
    (registerDeviceForRemoteMessages as jest.Mock).mockResolvedValue(undefined);
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ access_token: 'abc123' })
    );
    await generateAndUploadFcmToken(mockMobile);
    expect(getToken).not.toHaveBeenCalled();
  });

  it('Should generate the fcmtoken for the devices whose Android SDK version < 33', async () => {
    Platform.OS = 'android';
    Platform.Version = 32;
    (isDeviceRegisteredForRemoteMessages as jest.Mock).mockResolvedValue(true);
    (getToken as jest.Mock).mockResolvedValue('test_token');
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ access_token: 'RGUKT_BASAR' })
    );
    await generateAndUploadFcmToken(mockMobile);
    expect(fetch).toHaveBeenCalled();
  });

  it('Should generate the fcmtoken for the devices whose Android SDK version >= 33 when permission is granted', async () => {
    Platform.OS = 'android';
    Platform.Version = 34;
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);
    (isDeviceRegisteredForRemoteMessages as jest.Mock).mockResolvedValue(true);
    (getToken as jest.Mock).mockResolvedValue('test_token');
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ access_token: 'RGUKT_BASAR' })
    );
    await generateAndUploadFcmToken(mockMobile);
    expect(fetch).toHaveBeenCalled();
  });

  it('Should skips if no FCM token is returned', async () => {
    Platform.OS = 'android';
    Platform.Version = 34;
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);
    (isDeviceRegisteredForRemoteMessages as jest.Mock).mockResolvedValue(true);
    (getToken as jest.Mock).mockResolvedValue(null);
    await generateAndUploadFcmToken(mockMobile);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('Should skips if Android SDK >= 33 and permission is denied', async () => {
    Platform.OS = 'android';
    Platform.Version = 34;
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);
    await generateAndUploadFcmToken(mockMobile);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('Tests related to the uploadFcmToken function', () => {

  it('Should call fetch method and returns true', async () => {
    const res = await uploadFcmToken('9999999999', 'test_token', 'RGUKT_BASAR');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/fcmToken'),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          'smart-chat-token-header-key': 'Bearer RGUKT_BASAR',
        }),
        body: JSON.stringify({
          mobileNumber: '9999999999',
          fcmToken: 'test_token',
        }),
      })
    );
    expect(res.ok).toBe(true);
  });
});

