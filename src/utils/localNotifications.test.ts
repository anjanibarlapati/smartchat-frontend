import * as notifications from './localNotifications';
import notifee from '@notifee/react-native';

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

const mockConsoleError = jest.fn();
console.error = mockConsoleError;

describe('initNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize notifications successfully', async () => {
    await notifications.initNotifications();
    expect(notifee.requestPermission).toHaveBeenCalled();
    expect(notifee.createChannel).toHaveBeenCalledWith({
      id: 'messages',
      name: 'Messages Channel',
      importance: 'high',
      sound: 'default',
    });
  });

  it('should handle errors during initialization', async () => {
    (notifee.requestPermission as jest.Mock).mockRejectedValueOnce('error');
    await notifications.initNotifications();
    expect(mockConsoleError).toHaveBeenCalledWith('Notification init error:', 'error');
  });
});
