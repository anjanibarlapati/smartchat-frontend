import {format, isToday, isYesterday} from 'date-fns';
import {Message} from '../schemas/Message';

export const groupMessagesByDate = (messages: Realm.Results<Message>) => {
  const grouped: {[key: string]: Message[]} = {};

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const date = msg.sentAt;
    let key = format(date, 'yyyy-MM-dd');

    if (isToday(date)) {
      key = 'Today';
    } else if (isYesterday(date)) {
      key = 'Yesterday';
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(msg);
  }

  return grouped;
};


