import {PermissionsAndroid, Platform} from 'react-native';
import * as RNPermissions from 'react-native-permissions';
import {requestNotificationPermissions, requestPermission} from './permissions';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (obj: any) => obj.ios,
  },
  PermissionsAndroid: {
    check: jest.fn(),
    request: jest.fn(),
    PERMISSIONS: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
      SEND_SMS: 'android.permission.SEND_SMS',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      BLOCKED: 'blocked',
    },
  },
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  checkNotifications: jest.fn(),
  requestNotifications: jest.fn(),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
      CONTACTS: 'ios.permission.CONTACTS',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES',
      READ_CONTACTS: 'android.permission.READ_CONTACTS',
      SEND_SMS: 'android.permission.SEND_SMS',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
  },
}));

describe('Tests related to the requestPermission method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should grants the camera permission on iOS', async () => {
    (Platform as any).OS = 'ios';
    (Platform as any).select = (obj: any) => obj.ios;
    (RNPermissions.check as jest.Mock).mockResolvedValue('denied');
    (RNPermissions.request as jest.Mock).mockResolvedValue('granted');
    const result = await requestPermission('camera');
    expect(result).toBe(true);
  });

  it('Should denies the media permission on Android', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (Platform as any).Version = 33;
    (RNPermissions.check as jest.Mock).mockResolvedValue('denied');
    (RNPermissions.request as jest.Mock).mockResolvedValue('denied');
    const result = await requestPermission('media');
    expect(result).toBe(false);
  });

  it('Should returns true if permission already granted', async () => {
    (RNPermissions.check as jest.Mock).mockResolvedValue('granted');
    const result = await requestPermission('contacts');
    expect(result).toBe(true);
  });

  it('Should returns false if permission is not granted', async () => {
    (RNPermissions.check as jest.Mock).mockResolvedValue('blocked');
    const result = await requestPermission('contacts');
    expect(result).toBe(false);
  });
});

describe('Tests related to the requestNotificationPermissions method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should grants notification permission on iOS after requesting', async () => {
    (Platform as any).OS = 'ios';
    (Platform as any).select = (obj: any) => obj.ios;
    (RNPermissions.checkNotifications as jest.Mock).mockResolvedValue({
      status: 'denied',
    });
    (RNPermissions.requestNotifications as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    const result = await requestNotificationPermissions();
    expect(result).toBe(true);
  });

  it('Should returns true if notification already granted on iOS', async () => {
    (Platform as any).OS = 'ios';
    (Platform as any).select = (obj: any) => obj.ios;
    (RNPermissions.checkNotifications as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    const result = await requestNotificationPermissions();
    expect(result).toBe(true);
  });

  it('Should returns false if notification denied on iOS', async () => {
    (Platform as any).OS = 'ios';
    (Platform as any).select = (obj: any) => obj.ios;
    (RNPermissions.checkNotifications as jest.Mock).mockResolvedValue({
      status: 'denied',
    });
    (RNPermissions.requestNotifications as jest.Mock).mockResolvedValue({
      status: 'blocked',
    });
    const result = await requestNotificationPermissions();
    expect(result).toBe(false);
  });

  it('Should grants notification permission on Android', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(false);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');
    const result = await requestNotificationPermissions();
    expect(result).toBe(true);
  });

  it('Should returns true if already granted on Android', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);
    const result = await requestNotificationPermissions();
    expect(result).toBe(true);
  });

  it('returns false if Android notification permission denied', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(false);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue('denied');
    const result = await requestNotificationPermissions();
    expect(result).toBe(false);
  });
  it('should grant send-sms permission in android', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (RNPermissions.check as jest.Mock).mockResolvedValue('denied');
    (RNPermissions.request as jest.Mock).mockResolvedValue('granted');
    const result = await requestPermission('send-sms');
    expect(result).toBe(true);
  });
  it('should deny send-sms permission in android', async () => {
    (Platform as any).OS = 'android';
    (Platform as any).select = (obj: any) => obj.android;
    (RNPermissions.check as jest.Mock).mockResolvedValue('denied');
    (RNPermissions.request as jest.Mock).mockResolvedValue('denied');
    const result = await requestPermission('send-sms');
    expect(result).toBe(false);
  });
  it('should return true when permission undefined', async () => {
    (Platform as any).OS = 'ios';
    (Platform as any).select = (obj: any) => obj.ios;
    const result = await requestPermission('send-sms');
    expect(result).toBe(true);
  });
});
