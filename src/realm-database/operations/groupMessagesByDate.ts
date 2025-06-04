import {Message} from '../../types/message';
import {Message as MessageSchema} from '../schemas/Message';

export const groupMessagesByDate = (messages: Realm.Results<MessageSchema> | Message[]) => {
  const groupedMessages: {[date: string]: Message[]} = {};
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const date = message.sentAt;
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  }
  return groupedMessages;
};
