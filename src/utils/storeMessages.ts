import { storeChats } from '../realm-database/operations/storeChats';
import { formatMessages } from '../screens/Login/Login.service';
import { Chat, UserChatData } from '../types/message';
import { getUserMessages } from './getUserMessages';
import { getTokens } from './getTokens';
import Realm from 'realm';

export const storeMessages = async (mobileNumber: string, realm: Realm) => {
  try {
    const tokens = await getTokens(mobileNumber);
    const response = await getUserMessages(mobileNumber, tokens.access_token);
    if (response.ok) {
      const result = await response.json();
      const chats = result.chats as UserChatData;
      const formattedUserMessages = Object.entries(chats).map(([chatId, messages]) => ({
        chatId,
        messages: messages.map(messageRecord => ({
          message: messageRecord.message,
          nonce: messageRecord.nonce,
          sentAt: messageRecord.sentAt,
          status: messageRecord.status,
          isSender: false,
        })),
      }));
      const formattedMessages = await formatMessages(formattedUserMessages as Chat[], tokens.access_token);
      storeChats(realm, formattedMessages);

    }
  } catch (error) {
    console.log('error in fetch unsend messages', error);
  }
};
