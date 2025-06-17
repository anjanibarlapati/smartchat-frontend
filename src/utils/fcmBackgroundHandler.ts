import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { messaging } from './fcmService';
import { handleIncomingMessageNotification } from './handleIncomingNotification';

messaging.setBackgroundMessageHandler(async remoteMessage => {
  await HandleIncomingFCM(remoteMessage);
});

export const HandleIncomingFCM = async(remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  try {
      await handleIncomingMessageNotification({
        sender: remoteMessage.data?.sender as string,
        message: remoteMessage.data?.message as string,
        nonce: remoteMessage.data?.nonce as string,
        profilePic: remoteMessage.data?.profilePic as string,
        from: 'background',
      });
  } catch (error) {
      console.error('FCM background handler error:', error);
  }
};
