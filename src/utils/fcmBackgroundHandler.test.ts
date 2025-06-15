import { HandleIncomingFCM } from './fcmBackgroundHandler';
import { sendLocalNotification } from './localNotifications';

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('./fcmService', () => ({
  messaging: {
    setBackgroundMessageHandler: jest.fn(),
  },
}));

jest.mock('./localNotifications', () => ({
  sendLocalNotification: jest.fn(),
}));

describe('Tests related to the background notifications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should call sendLocalNotification with message body from remoteMessage', async () => {
    const mockRemoteMessage = {
      notification: {
        title: 'Smart chat',
        body: 'You have new messages',
      },
    } as any;
    await HandleIncomingFCM(mockRemoteMessage);
    expect(sendLocalNotification).toHaveBeenCalledWith('Smart Chat', 'You have new messages');
  });

  it('Should use default message if body is undefined', async () => {
    const mockRemoteMessage = {
      notification: {
        title: 'Smart chat',
        body: undefined,
      },
    } as any;
    await HandleIncomingFCM(mockRemoteMessage);
    expect(sendLocalNotification).toHaveBeenCalledWith('Smart Chat', 'You have a new message');
  });

  it('Should log the error if sendLocalNotification throws any error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (sendLocalNotification as jest.Mock).mockRejectedValue(new Error('Notification Error'));

    const mockRemoteMessage = {
      notification: {
        title: 'Smart chat',
        body: 'You have new messages',
      },
    } as any;

    await HandleIncomingFCM(mockRemoteMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith('FCM background handler error:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
