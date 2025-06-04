import Realm from 'realm';
import { Chat } from '../schemas/Chat';

export const unblockContactInRealm = (realm: Realm, contact: string) => {
  const chat = realm.objectForPrimaryKey<Chat>('Chat', contact);
  realm.write(() => {
    if(chat) {
        chat.isBlocked = false;
    }
  });
};
