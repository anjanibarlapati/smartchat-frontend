import { Message } from './message';

export type ChatCardProps = {
  message: Message;
  unreadCount?: number;
  contact: {
    name: string;
    originalNumber: string;
    mobileNumber: string;
    profilePicture: string | null;
  }
};
