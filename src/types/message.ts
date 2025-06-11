export interface Message {
  message: string;
  sentAt: string;
  isSender: boolean;
  status: MessageStatus;
}
export type DBMessage = Message & {
    nonce: string,
}
export type UserMessage = {
  chatId: string;
  message: string;
  nonce: string;
  sentAt: string;
  status: MessageStatus,
};

export type UserChatData = Record<string, UserMessage[]>;

export interface Messages {
  [chatId: string]: Message[];
}

export type Chat = {
  chatId: string,
  messages: DBMessage[]
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  SEEN = 'seen',
  PENDING = 'pending'
}
