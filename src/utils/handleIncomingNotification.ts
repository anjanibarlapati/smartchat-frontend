import EncryptedStorage from 'react-native-encrypted-storage';
import { getRealmInstance } from '../realm-database/connection';
import { Contact } from '../realm-database/schemas/Contact';
import { store } from '../redux/store';
import { decryptMessage } from './decryptMessage';
import { getTokens } from './getTokens';
import { sendLocalNotification } from './localNotifications';

export const handleIncomingMessageNotification = async ({
  sender,
  message,
  nonce,
  profilePic,
  from,
}: {
  sender: string;
  message: string;
  nonce: string;
  from: string,
  profilePic?: string;
}) => {
  try {
    const userDetails = await EncryptedStorage.getItem('User Data');
    const user = userDetails ? JSON.parse(userDetails) : null;
    if (!user) {
        return;
    }

    const state = store.getState();
    if (from === 'socket' && state.activeChat.currentChatMobileNumber === sender) {
      return;
    }
    const realm = getRealmInstance();
    const tokens = await getTokens(user.mobileNumber);
    const decryptedMessage = await decryptMessage(sender, message, nonce, tokens.access_token, realm);

    const contact = realm
      .objects<Contact>('Contact')
      .filtered('mobileNumber == $0', sender)[0];

    const senderName = contact?.name || sender;
    const profilePicUrl = profilePic ? profilePic : require('../../assets/images/profileImage.png');
    await sendLocalNotification(senderName, decryptedMessage, profilePicUrl as string);
  } catch (error) {
    console.error('Error in handleIncomingMessageNotification:', error);
  }
};
