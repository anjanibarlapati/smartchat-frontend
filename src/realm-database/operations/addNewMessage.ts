import Realm, { BSON } from 'realm';
import { Message } from '../../types/message';
import { Chat } from '../schemas/Chat';

export const addNewMessageInRealm = (realm: Realm, receiverMobileNumber: string, message: Message) => {
  realm.write(() => {
    let chat = realm.objectForPrimaryKey<Chat>('Chat', receiverMobileNumber);

    if (!chat) {
      chat = realm.create<Chat>('Chat', {
        chatId: receiverMobileNumber,
        isBlocked: false,
        publicKey: null,
      });
    }
    realm.create('Message', {
      _id: new BSON.ObjectId(),
      message: message.message,
      sentAt: message.sentAt,
      isSender: message.isSender,
      status: message.status,
      chat: chat,
    });
  });
};



