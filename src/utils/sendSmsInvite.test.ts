import { Alert } from 'react-native';
import SendSMS from 'react-native-sms';
import * as Permissions from '../permissions/permissions';
import { requestSmsPermission, sendSmsInvite } from './sendSmsInvite';

jest.mock('react-native', () => ({
  Alert: {alert: jest.fn()},
  Platform: {OS: 'android'},
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
  });
});
