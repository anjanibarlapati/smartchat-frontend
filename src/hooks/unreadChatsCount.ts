import { useMemo } from 'react';
import { useQuery } from '../contexts/RealmContext';
import { Message } from '../realm-database/schemas/Message';
import { MessageStatus } from '../types/message';

export const useUnreadChatsCount = (): number => {
  const unreadMessages = useQuery(Message).filtered('isSender == false AND status != $0', MessageStatus.SEEN,);

  return useMemo(() => {
    if (unreadMessages.length === 0) {
      return 0;
    }

    const uniqueChatIds = new Set<string>();
    for (const message of unreadMessages) {
      uniqueChatIds.add(message.chat.chatId);
    }
    return uniqueChatIds.size;
  }, [unreadMessages]);
};
