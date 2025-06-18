import { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useQuery } from '../contexts/RealmContext';
import { Contact } from '../realm-database/schemas/Contact';
import { store } from '../redux/store';
import { decryptMessage } from '../utils/decryptMessage';
import { messaging } from '../utils/fcmService';
import { getTokens } from '../utils/getTokens';
import { sendLocalNotification } from '../utils/localNotifications';

export const useFCMListener = () => {
  const contacts = useQuery(Contact);
  useEffect(() => {
    const unsubscribe = messaging.onMessage(async remoteMessage => {
      const userDetails = await EncryptedStorage.getItem('User Data');
      const user = userDetails ? JSON.parse(userDetails) : null;
      if (!user){
        return;
      }
      const state = store.getState();
      if(state.activeChat.currentChatMobileNumber !== remoteMessage.data?.sender as string) {
        const tokens = await getTokens(user.mobileNumber);
        const originalMessage = await decryptMessage(
            remoteMessage.data?.sender as string,
            remoteMessage.data?.message as string,
            remoteMessage.data?.nonce as string,
            tokens.access_token
        );
        const contact = contacts.filtered('mobileNumber == $0', remoteMessage.data?.sender as string)[0];
        const sender = contact ? contact.name : remoteMessage.data?.sender as string;
        await sendLocalNotification(
            sender,
            originalMessage,
            remoteMessage.data?.profilePic as string,
        );
      }
    });

    return unsubscribe;
  }, [contacts]);
};
