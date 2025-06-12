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
describe('sendLocalNotification', () => {
  it('should send a local notification', async () => {
    await notifications.sendLocalNotification('Title', 'Body');

    expect(notifee.displayNotification).toHaveBeenCalledWith({
      title: 'Title',
      body: 'Body',
      android: {
        channelId: 'messages',
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher_round',
        color: '#008080',
      },
    });
  });

  it('should handle errors while sending local notification', async () => {
    (notifee.displayNotification as jest.Mock).mockRejectedValueOnce('display-error');

    await notifications.sendLocalNotification('ErrTitle', 'ErrBody');

    expect(mockConsoleError).toHaveBeenCalledWith('Notification display error:', 'display-error');
  });
});
describe('scheduleNotification', () => {
  it('should schedule a notification', async () => {
    await notifications.scheduleNotification('Scheduled', 'Message', 10);
    expect(notifee.createTriggerNotification).toHaveBeenCalled();
    const trigger = (notifee.createTriggerNotification as jest.Mock).mock.calls[0][1];
    expect(trigger.type).toBe('timestamp');
    expect(typeof trigger.timestamp).toBe('number');
  });
  it('should handle errors while scheduling notification', async () => {
    (notifee.createTriggerNotification as jest.Mock).mockRejectedValueOnce('schedule-error');
    await notifications.scheduleNotification('ErrScheduled', 'ErrMsg', 5);
    expect(mockConsoleError).toHaveBeenCalledWith('Notification schedule error:', 'schedule-error');
  });
});

