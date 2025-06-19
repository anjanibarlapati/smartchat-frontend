import * as notifications from './localNotifications';
import notifee from '@notifee/react-native';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
  },
  AndroidImportance: { HIGH: 'high' },
  TriggerType: { TIMESTAMP: 'timestamp' },
}));

const mockConsoleError = jest.fn();
describe('Tests related to the localNotification', () => {
  beforeAll(() => {
    console.error = mockConsoleError;
  });
  afterEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
  });

  describe('Tests related to the initNotifications', () => {
    it('Should initialize notifications successfully', async () => {
      await notifications.initNotifications();
      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'messages',
        name: 'Messages Channel',
        importance: 'high',
        sound: 'default',
      });
    });

    it('Should handle errors during initialization', async () => {
      (notifee.createChannel as jest.Mock).mockRejectedValueOnce('init-error');
      await notifications.initNotifications();
      expect(mockConsoleError).toHaveBeenCalledWith('Notification init error:', 'init-error');
    });
  });

  describe('Tests related to the sendLocalNotification', () => {
    it('Should send a local notification with default profile image', async () => {
      await notifications.sendLocalNotification('Varun', 'How are you?');

      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Varun',
          body: 'How are you?',
          android: expect.objectContaining({
            channelId: 'messages',
            pressAction: { id: 'default' },
            smallIcon: 'ic_launcher_round',
            color: '#008080',
            largeIcon: expect.anything(),
            circularLargeIcon: true,
          }),
          ios: {
            attachments: [expect.objectContaining({ url: expect.anything() })],
          },
        })
      );
    });

    it('Should send a local notification with provided profilePic', async () => {
      const profilePic = 'profile-pic-url';
      await notifications.sendLocalNotification('Varun', 'Hello', profilePic);
      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Varun',
          body: 'Hello',
          android: expect.objectContaining({
            largeIcon: profilePic,
          }),
          ios: {
            attachments: [{ url: profilePic }],
          },
        })
      );
    });

    it('Should handle errors while sending local notification', async () => {
      (notifee.displayNotification as jest.Mock).mockRejectedValueOnce('notifee display error');
      await notifications.sendLocalNotification('varun', 'hello');
      expect(mockConsoleError).toHaveBeenCalledWith('Notification display error:', 'notifee display error');
    });
  });

  describe('Tests related to the scheduleNotification', () => {
    it('Should schedule a notification', async () => {
      await notifications.scheduleNotification('Varun', 'will go', 10);
      expect(notifee.createTriggerNotification).toHaveBeenCalled();
      const trigger = (notifee.createTriggerNotification as jest.Mock).mock.calls[0][1];
      expect(trigger.type).toBe('timestamp');
      expect(typeof trigger.timestamp).toBe('number');
    });

    it('Should handle errors while scheduling notification', async () => {
      (notifee.createTriggerNotification as jest.Mock).mockRejectedValueOnce('error');
      await notifications.scheduleNotification('Charan', 'hey', 5);
      expect(mockConsoleError).toHaveBeenCalledWith('Notification schedule error:', 'error');
    });
  });
});
