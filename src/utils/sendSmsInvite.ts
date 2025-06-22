import { Alert, Linking, Platform } from 'react-native';
import SendSMS from 'react-native-sms';
import { requestPermission } from '../permissions/permissions';

export const requestSmsPermission = async () => {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 34) {
    return false;
  }
  const isPermissionGranted = await requestPermission('send-sms');
  if (!isPermissionGranted) {
    return false;
  }
  return true;
};

export const sendSmsInvite = async (mobileNumber: string) => {
  const inviteMessage =
    "Let's chat on SmartChat! It's a fast, simple, and secure app we can use to message each other for free.";
  if (Platform.OS === 'ios') {
    const url = `sms:${mobileNumber}&body=${encodeURIComponent(inviteMessage)}`;
    Linking.openURL(url).catch(() => console.error('Failed to send SMS'));
    return;
  }
  if (Platform.OS === 'android') {
    if (Number(Platform.Version) >= 34) {
      const url = `sms:${mobileNumber}?body=${encodeURIComponent(
        inviteMessage,
      )}`;
      Linking.openURL(url).catch(() => console.error('Failed to send SMS'));
      return;
    } else {
      const granted = await requestSmsPermission();
      if (!granted) {
        Alert.alert(
          'Permission denied',
          'SMS permission is required to send invites.',
        );
        return;
      }

      SendSMS.send(
        {
          body: inviteMessage,
          recipients: [mobileNumber],
          successTypes: ['sent', 'queued'] as any,
          allowAndroidSendWithoutReadPermission: true,
        },
        (completed, cancelled) => {
          if (completed) {
            console.log('SMS Sent Successfully');
          } else if (cancelled) {
            console.log('SMS Sending Cancelled');
          } else  {
            console.log('Failed to send SMS');
          }
        },
      );
    }
  }
};
