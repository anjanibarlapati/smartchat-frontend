import Realm from 'realm';
import { Chat } from './Chat';

export class Message extends Realm.Object<Message> {
  _id!: Realm.BSON.ObjectId;
  message!: string;
  sentAt!: string;
  isSender!: boolean;
  status!: 'sent' | 'delivered' | 'seen';
  chat!: Chat;

  static schema: Realm.ObjectSchema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      message: 'string',
      sentAt: { type: 'string', indexed: true },
      isSender: { type: 'bool', indexed: true },
      status: 'string',
      chat: 'Chat',
    },
  };
}

