import { MessageStatus } from './message';

export type MessageProps = {
  message: string;
  timestamp: string;
  status: MessageStatus,
  isSender: boolean;
};
