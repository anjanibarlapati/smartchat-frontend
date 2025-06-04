import Realm from 'realm';
import { Chat } from '../schemas/Chat';

export const blockContactInRealm = (realm: Realm, contact: string) => {
  const chat = realm.objectForPrimaryKey<Chat>('Chat', contact);
  realm.write(() => {
    if(!chat) {
      realm.create<Chat>('Chat', {
          chatId: contact,
          isBlocked: true,
          publicKey: null,
      });
    } else {
      chat.isBlocked = true;
    }
  });
};
