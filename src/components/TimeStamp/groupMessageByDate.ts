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

};
