import Realm, { BSON } from 'realm';
import { Messages } from '../../types/message';
import { Chat } from '../schemas/Chat';


export const storeChats = (realm: Realm, messages: Messages) => {
  realm.write(() => {
    for (const chatId in messages) {
      const chatMessages = messages[chatId];
      let chat = realm.objectForPrimaryKey<Chat>('Chat', chatId);

      if (!chat) {
        chat = realm.create<Chat>('Chat', {
          chatId,
          isBlocked: false,
          publicKey: null,
        });
      }

      for (const message of chatMessages) {
        realm.create('Message', {
          _id: new BSON.ObjectId(),
          message: message.message,
          sentAt: message.sentAt,
          isSender: message.isSender,
          status: message.status,
          chat: chat,
        });
      }
    }
  });
};

