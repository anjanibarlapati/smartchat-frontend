import { getRealmInstance } from '../connection';
import { Message } from '../schemas/Message';

type UpdateMessageStatusParams = {
  chatId: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'seen';
  updateAllBeforeSentAt?: boolean;
};

export const updateMessageStatusInRealm = async ({
  chatId,
  sentAt,
  status,
  updateAllBeforeSentAt,
}: UpdateMessageStatusParams) => {
  const realm = getRealmInstance();


  try {
    realm.write(() => {
      const messages = realm.objects<Message>('Message').filtered('chat.chatId == $0 AND isSender == true', chatId).sorted('sentAt');

      if (updateAllBeforeSentAt) {
        for (let i = messages.length - 1; i >= 0; i--) {
          const message = messages[i];
          if (message.sentAt <= sentAt && message.status !== status) {
            message.status = status;
          } else {
            break;
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


