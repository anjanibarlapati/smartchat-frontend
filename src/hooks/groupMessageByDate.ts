import { format } from 'date-fns';
import { useMemo } from 'react';
import { BSON } from 'realm';
import { useQuery } from '../contexts/RealmContext';
import { Chat } from '../realm-database/schemas/Chat';
import { Message, Message as MessageSchema } from '../realm-database/schemas/Message';
import { MessageStatus } from '../types/message';

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
  status: MessageStatus,
  chat: Chat;
}

export type FlattenedMessage = FlattenedTimestamp | FlattenedChatMessage;

export const useGroupedMessages = (
  mobileNumber: string,
): { sections: GroupedMessageSection[]; flattenedMessages: FlattenedMessage[] } => {
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
        return { title, dateKey, data: sortedMsgs };
      })
      .sort(
        (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime(),
      );

    const flattenedMessages: FlattenedMessage[] = [];

    for (const section of sections) {
      flattenedMessages.push({
        type: 'timestamp',
        id: `timestamp_${section.dateKey}`,
        dateKey: section.dateKey,
      });

      section.data.forEach(msg => {
        flattenedMessages.push({
          type: 'message',
          _id: msg._id,
          message: msg.message,
          sentAt: new Date(msg.sentAt),
          isSender: msg.isSender,
          status: msg.status,
          chat: msg.chat,
        });
      });
    }

    return { sections, flattenedMessages };
  }, [messages]);
};

