import {Message} from '../../types/message';
import {Message as MessageSchema} from '../schemas/Message';

export const groupMessagesByDate = (messages: Realm.Results<MessageSchema>) => {
  const groupedMessages: {[date: string]: Message[]} = {};
  const dates = new Set<string>();
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const date = msg.sentAt;
    dates.add(date);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  }
  return groupedMessages;
};
