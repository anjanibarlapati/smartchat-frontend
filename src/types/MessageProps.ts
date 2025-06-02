export type MessageProps = {
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  isSender: boolean;
};
