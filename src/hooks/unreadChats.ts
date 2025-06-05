import { useMemo } from 'react';
import { useQuery } from '../contexts/RealmContext';
import { Chat } from '../realm-database/schemas/Chat';
import { Message } from '../realm-database/schemas/Message';
import { HomeChats } from './homechats';
import { Contact } from '../realm-database/schemas/Contact';


export const useUnreadChats = (): HomeChats[] => {
  const chats = useQuery(Chat);
  const messages = useQuery(Message).filtered('isSender == false AND status != "seen"');
  const contacts = useQuery(Contact);


  return useMemo(() => {
    const unreadChatsWithMessages: HomeChats[] = [];

    for (const chat of chats) {
      const chatMessages = messages
        .filtered('chat.chatId == $0', chat.chatId)
        .sorted('sentAt', true);

      if (chatMessages.length === 0) {
        continue;
      }
      const contact = contacts.filtered('mobileNumber == $0', chat.chatId)[0];


      const latestMessage = chatMessages[0];
      unreadChatsWithMessages.push({
        lastMessage: {
          message: latestMessage.message,
          sentAt: latestMessage.sentAt,
          isSender: latestMessage.isSender,
          status: latestMessage.status,
        },
        unreadCount: chatMessages.length,
        contact:{
          name: contact ? contact.name : chat.chatId,
          originalNumber: contact ? contact.originalNumber : chat.chatId,
          mobileNumber: contact ? contact.mobileNumber : chat.chatId,
          profilePicture: contact ? contact.profilePicture : '',
        },
      });
    }

    unreadChatsWithMessages.sort((message1, message2) => {
      return message2.lastMessage.sentAt.localeCompare(message1.lastMessage.sentAt);
    });

    return unreadChatsWithMessages;
  }, [chats, contacts, messages]);
};
