import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { messaging } from './fcmService';
import { sendLocalNotification } from './localNotifications';

messaging.setBackgroundMessageHandler(async remoteMessage => {
  await HandleIncomingFCM(remoteMessage);
});

export const HandleIncomingFCM = async(remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  try {
      await sendLocalNotification('Smart Chat', remoteMessage.notification?.body ?? 'You have a new message');
  } catch (error) {
      console.error('FCM background handler error:', error);
  }
};
