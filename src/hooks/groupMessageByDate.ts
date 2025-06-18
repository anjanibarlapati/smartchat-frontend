import { format } from 'date-fns';
import { useMemo } from 'react';
import { BSON } from 'realm';
import { useQuery } from '../contexts/RealmContext';
import { Message as MessageSchema } from '../realm-database/schemas/Message';
import { MessageStatus } from '../types/message';

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
  status: MessageStatus;
}

export type FlattenedMessage = FlattenedTimestamp | FlattenedChatMessage;

export const useGroupedMessages = (
  mobileNumber: string,
): { groupedMessages: FlattenedMessage[] } => {

  const messages = useQuery(MessageSchema)
    .filtered('chat.chatId == $0', mobileNumber)
    .sorted('sentAt').snapshot();

  return useMemo(() => {
    const groupedMessages: FlattenedMessage[] = [];
    let lastDateKey: string | null = null;
    for (const message of messages) {
      const sentAtDate = new Date(message.sentAt);
      const dateKey = format(sentAtDate, 'yyyy-MM-dd');

      if (lastDateKey !== dateKey) {
        groupedMessages.push({
          type: 'timestamp',
          id: `timestamp_${dateKey}`,
          dateKey,
        });
        lastDateKey = dateKey;
      }

      groupedMessages.push({
        type: 'message',
        _id: message._id,
        message: message.message,
        sentAt: sentAtDate,
        isSender: message.isSender,
        status: message.status,
      });
    }
    return { groupedMessages };
  },[messages]);
};
