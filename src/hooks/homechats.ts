import { useMemo } from 'react';
import { compareDesc, parseISO } from 'date-fns';
import { useQuery } from '../contexts/RealmContext';
import { Chat } from '../realm-database/schemas/Chat';
import { Contact } from '../realm-database/schemas/Contact';
import { Message as RealmMessage } from '../realm-database/schemas/Message';
import { Message, MessageStatus } from '../types/message';


export type HomeChats = {
  lastMessage: Message;
  unreadCount: number;
  contact: {
    name: string;
    originalNumber: string;
    mobileNumber: string;
    profilePicture: string | null;
  }
};

export const useHomeChats = (): HomeChats[] => {
  const chats = useQuery(Chat);
  const messages = useQuery(RealmMessage);
  const contacts = useQuery(Contact);
  return useMemo(() => {
    const chatWithMessages: HomeChats[] = [];

    for (const chat of chats) {
      const chatMessages = messages.filtered('chat.chatId == $0', chat.chatId).sorted('sentAt', true);
      if (chatMessages.length === 0) {
        continue;
      }
      const contact = contacts.filtered('mobileNumber == $0', chat.chatId)[0];

      const unreadCount = chatMessages
        .filtered('isSender == false AND status != $0', MessageStatus.SEEN,)
        .length;

      const latestMessage = chatMessages[0];
      chatWithMessages.push({
        lastMessage: {
          message: latestMessage.message,
          sentAt: latestMessage.sentAt,
          isSender: latestMessage.isSender,
          status: latestMessage.status,
        },
        unreadCount,
        contact:{
          name: contact ? contact.name : chat.chatId,
          originalNumber: contact ? contact.originalNumber : chat.chatId,
          mobileNumber: contact ? contact.mobileNumber : chat.chatId,
          profilePicture: contact ? contact.profilePicture : null,
        },
      });
    }
    chatWithMessages.sort((a, b) =>
      compareDesc(parseISO(a.lastMessage.sentAt), parseISO(b.lastMessage.sentAt))
    );

    return chatWithMessages;
  }, [chats, contacts, messages]);
};
