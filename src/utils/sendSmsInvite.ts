import { Alert, Linking, Platform } from 'react-native';
import { requestPermission } from '../permissions/permissions';
import SendSMS from 'react-native-sms'

export const requestSmsPermission = async () => {
    const isPermissionGranted = await requestPermission('send-sms');
    if (!isPermissionGranted) {
        return false;
    }
    return true;
};

export const sendSmsInvite = async (mobileNumber: string) => {
    const inviteMessage = 'Let\'s chat on SmartChat! It\'s a fast, simple, and secure app we can use to message each other for free.';
    const granted = await requestSmsPermission();
    if (!granted) {
        Alert.alert('Permission denied', 'SMS permission is required to send invites.');
        return;
    }
    if(Platform.OS === 'ios'){
         const url = `sms:${mobileNumber}&body=${encodeURIComponent(inviteMessage)}`;
         Linking.openURL(url).catch(err => console.error('SMS error:', err));
         return;
    }
    SendSMS.send({
        body: inviteMessage,
        recipients: [mobileNumber],
        successTypes: ['sent', 'queued'] as any,
        allowAndroidSendWithoutReadPermission: true,
    }, (completed, cancelled, error) => {
        if (completed) {
            console.log('SMS Sent Successfully');
        } else if (cancelled) {
            console.log('SMS Sending Cancelled');
        } else if (error) {
            console.log('Failed to send SMS');
        }
    });
    return;
};
