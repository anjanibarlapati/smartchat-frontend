export type MessageProps = {
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen' | 'pending';
  isSender: boolean;
};
