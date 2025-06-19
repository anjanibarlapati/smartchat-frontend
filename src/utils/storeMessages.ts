import Realm from 'realm';
import { storeChats } from '../realm-database/operations/storeChats';
import { formatMessages } from '../screens/Login/Login.service';
import { Chat } from '../types/message';
import { getTokens } from './getTokens';
import { getUserMessages } from './getUserMessages';

export const storeMessages = async (mobileNumber: string, realm: Realm) => {
  try {
    const tokens = await getTokens(mobileNumber);
    const response = await getUserMessages(mobileNumber, tokens.access_token);
    if (response.ok) {
      const result = await response.json();
      if(result.chats && result.chats.length !== 0){
        const formattedMessages = await formatMessages(result.chats as Chat[], tokens.access_token);
        storeChats(realm, formattedMessages);
      }
    }
  } catch (error) {
    console.log('Error in fetching messages', error);
  }
};
