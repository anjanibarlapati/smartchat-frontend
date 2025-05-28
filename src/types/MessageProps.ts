export type MessageProps = {
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed' | 'seen';
  isSender: boolean;
};
