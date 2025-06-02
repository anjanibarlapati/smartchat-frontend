export interface Message {
  message: string;
  sentAt: string;
  isSender: boolean;
  status: 'sent' | 'delivered' | 'seen';
}
export type DBMessage = Message & {
  nonce: string,
}

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
  NOTSENT = 'not sent'
}
