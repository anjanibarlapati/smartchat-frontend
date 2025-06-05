import {Message as MessageSchema} from '../realm-database/schemas/Message';
import {Message} from '../realm-database/schemas/Message';
import {Chat} from '../realm-database/schemas/Chat';
import {useQuery} from '../contexts/RealmContext';
import {useMemo} from 'react';
import {format} from 'date-fns';
import {BSON} from 'realm';
export interface GroupedMessageSection {
  title: string;
  dateKey: string;
  data: Message[];
}
export interface FlattenedTimestamp {
  type: 'timestamp';
  id: string;
  dateKey: string;
}
export interface FlattenedChatMessage {
  type: 'message';
  _id: BSON.ObjectId;
  message: string;
  sentAt: Date;
  isSender: boolean;
  status: 'sent' | 'delivered' | 'seen';
  chat: Chat;
}
export type FlattenedMessage = FlattenedTimestamp | FlattenedChatMessage;
export const useGroupedMessages = (
  mobileNumber: string,
): {
  sections: GroupedMessageSection[];
  flattenedMessages: FlattenedMessage[];
} => {
  const messages = useQuery(MessageSchema)
    .filtered('chat.chatId == $0', mobileNumber)
    .sorted('sentAt');
  return useMemo(() => {
    const groupedMessages = new Map<string, Message[]>();
    for (const message of messages) {
      const dateKey = format(new Date(message.sentAt), 'yyyy-MM-dd');
      if (!groupedMessages.has(dateKey)) {
        groupedMessages.set(dateKey, []);
      }
      groupedMessages.get(dateKey)!.push(message);
    }
    const sections = Array.from(groupedMessages.entries())
      .map(([dateKey, msgs]) => {
        const sortedMsgs = msgs
          .slice()
          .sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
          );
        const title = format(new Date(dateKey), 'MMMM dd, yyyy');
        return {title, dateKey, data: sortedMsgs};
      })
      .sort(
        (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime(),
      );
  }, [messages]);
};
