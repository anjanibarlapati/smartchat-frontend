import { getRealmInstance } from '../connection';
import { Message } from '../schemas/Message';

type UpdateMessageStatusParams = {
  chatId: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'seen';
  updateAllBeforeSentAt?: boolean;
  messageIds?: string[];
};

export const updateMessageStatusInRealm = async ({
  chatId,
  sentAt,
  status,
  updateAllBeforeSentAt,
  messageIds,
}: UpdateMessageStatusParams) => {
  const realm = getRealmInstance();


  try {
    realm.write(() => {
      const messages = realm.objects<Message>('Message').filtered('chat.chatId == $0', chatId).sorted('sentAt');

      if (updateAllBeforeSentAt) {
        for (let index = messages.length - 1; index >= 0; index--) {
          const message = messages[index];
          if((message.isSender === true && messageIds && messageIds.includes(message.sentAt)) || !message.isSender){
            if (message.sentAt <= sentAt && message.status !== status) {
              message.status = status;

            } else {
              break;
            }
          }
         }
      } else {
        const message = messages.filtered('sentAt == $0', sentAt)[0];
        if (message) {
          message.status = status;
        }
      }
    });
  } catch (error) {
    console.error('Error while updating message status:', error);
  }
};


