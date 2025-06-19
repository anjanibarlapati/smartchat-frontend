import {Alert} from 'react-native';
import SendSMS from 'react-native-sms';
import * as Permissions from '../permissions/permissions';
import {requestSmsPermission, sendSmsInvite} from './sendSmsInvite';
import {Platform, Linking} from 'react-native';

jest.mock('react-native', () => ({
  Alert: {alert: jest.fn()},
  Platform: {OS: 'android', Version: '33'},
  Linking: {openURL: jest.fn(() => Promise.resolve())},
}));

jest.mock('../permissions/permissions', () => ({
  requestPermission: jest.fn(),
}));

jest.mock('react-native-sms', () => ({
  send: jest.fn(),
}));

const mobileNumber = '9832145610';

describe('send SMS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
    Platform.Version = '33';
  });

  describe('requestSmsPermission', () => {
    it('should return true if permission is granted', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      const result = await requestSmsPermission();
      expect(result).toBe(true);
    });

    it('should return false if permission is denied', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(false);
      const result = await requestSmsPermission();
      expect(result).toBe(false);
    });
    it('Should return false for Android API 34+', async () => {
      Platform.OS = 'android';
      Platform.Version = '34';

      const result = await requestSmsPermission();
      expect(result).toBe(false);
      expect(Permissions.requestPermission).not.toHaveBeenCalled();
    });
    it('Should return false for Android API 35', async () => {
      Platform.OS = 'android';
      Platform.Version = '35';

      const result = await requestSmsPermission();
      expect(result).toBe(false);
      expect(Permissions.requestPermission).not.toHaveBeenCalled();
    });
  });

  describe('sendSmsInvite functionality', () => {
    it('should show alert if permission is denied', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(false);
      await sendSmsInvite(mobileNumber);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission denied',
        'SMS permission is required to send invites.',
      );
      expect(SendSMS.send).not.toHaveBeenCalled();
    });

    it('sends SMS if permission is granted', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      await sendSmsInvite(mobileNumber);
      expect(SendSMS.send).toHaveBeenCalled();
    });

    it('should log "SMS Sent Successfully" when SMS is sent', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      (SendSMS.send as jest.Mock).mockImplementation((_config, callback) => {
        callback(true, false, null);
      });
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      await sendSmsInvite(mobileNumber);
      expect(logSpy).toHaveBeenCalledWith('SMS Sent Successfully');

      logSpy.mockRestore();
    });

    it('should log "SMS Sending Cancelled" when SMS sending is cancelled', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      (SendSMS.send as jest.Mock).mockImplementation((_config, callback) => {
        callback(false, true, null);
      });
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      await sendSmsInvite(mobileNumber);
      expect(logSpy).toHaveBeenCalledWith('SMS Sending Cancelled');

      logSpy.mockRestore();
    });

    it('should log "Failed to send SMS" when there is an error', async () => {
      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      (SendSMS.send as jest.Mock).mockImplementation((_config, callback) => {
        callback(false, false, true);
      });
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      await sendSmsInvite(mobileNumber);
      expect(logSpy).toHaveBeenCalledWith('Failed to send SMS');
      logSpy.mockRestore();
    });
    it('uses Linking.openURL on iOS', async () => {
      const {Platform, Linking} = require('react-native');
      Platform.OS = 'ios';

      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);

      await sendSmsInvite(mobileNumber);

      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('sms:'),
      );
    });
    it('Should use SendSMS.send on android API<34', async () => {
      Platform.OS = 'android';
      Platform.Version = '33';

      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);
      (SendSMS.send as jest.Mock).mockImplementation((_config, callback) => {
        callback(true, false, null);
      });

      await sendSmsInvite(mobileNumber);

      expect(SendSMS.send).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining("Let's chat on SmartChat!"),
          recipients: [mobileNumber],
        }),
        expect.any(Function),
      );
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
    it('Should uses Linking.openURL for Android API 34+', async () => {
      Platform.OS = 'android';
      Platform.Version = '34';

      await sendSmsInvite(mobileNumber);

      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('sms:9832145610?body='),
      );
      expect(Permissions.requestPermission).not.toHaveBeenCalled();
      expect(SendSMS.send).not.toHaveBeenCalled();
    });
    it('Should handle Linking.openURL error for Android API 34+', async () => {
      Platform.OS = 'android';
      Platform.Version = '34';

      const mockError = new Error('SMS error');
      (Linking.openURL as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await sendSmsInvite(mobileNumber);

      expect(consoleSpy).toHaveBeenCalledWith('SMS error:', mockError);
      consoleSpy.mockRestore();
    });
     it('Should handle SendSMS error', async () => {
      Platform.OS = 'android';
      Platform.Version = '33';

      (Permissions.requestPermission as jest.Mock).mockResolvedValue(true);

      const errorObj = new Error('SMS failed');
      (SendSMS.send as jest.Mock).mockImplementation((config, callback) => {
        callback(false, false, errorObj);
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await sendSmsInvite(mobileNumber);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to send SMS');

      consoleSpy.mockRestore();
    });
    it('Should do nothing when platform is not iOS or Android', async () => {
      Platform.OS = 'web';
      await sendSmsInvite(mobileNumber);

      expect(Permissions.requestPermission).not.toHaveBeenCalled();
      expect(SendSMS.send).not.toHaveBeenCalled();
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
    it('Should use correct URL format for iOS', async () => {
      Platform.OS = 'ios';

      await sendSmsInvite(mobileNumber);

      const expectedMessage =
        "Let's chat on SmartChat! It's a fast, simple, and secure app we can use to message each other for free.";
      const expectedUrl = `sms:${mobileNumber}&body=${encodeURIComponent(
        expectedMessage,
      )}`;

      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
