export type MessageProps = {
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isSender: boolean;
};
