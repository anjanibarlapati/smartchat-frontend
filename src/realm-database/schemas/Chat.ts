import Realm from 'realm';
import { Message } from './Message';

export class Chat extends Realm.Object<Chat> {
  chatId!: string;
  isBlocked!: boolean;
  publicKey!: string | null;
  messages!: Realm.List<Message>;
  isAccountDeleted!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Chat',
    primaryKey: 'chatId',
    properties: {
      chatId: 'string',
      isBlocked: { type: 'bool', default: false },
      publicKey: 'string?',
      messages: {
        type: 'linkingObjects',
        objectType: 'Message',
        property: 'chat',
      },
      isAccountDeleted: { type: 'bool', default: false },
    },
  };
}
