import { STATUS_ORDER } from '../../utils/constants';
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
          const requiredMessage = (message.isSender === true && messageIds?.includes(message.sentAt)) || !message.isSender;
          if (!requiredMessage) {
            continue;
          }
          if (requiredMessage && message.sentAt <= sentAt) {
            const currentStatusRank = STATUS_ORDER[message.status];
            const newStatusRank = STATUS_ORDER[status];
            if (newStatusRank > currentStatusRank) {
              console.log(`${message.message} status updated ${status}`);
              message.status = status;
            } else {
              break;

            }
          }
        }
      } else {
        const message = messages.filtered('sentAt == $0', sentAt)[0];
        if (message) {
          const currentStatusRank = STATUS_ORDER[message.status];
          const newStatusRank = STATUS_ORDER[status];

          if (newStatusRank > currentStatusRank) {
            message.status = status;
          }
        }
      }
    });
  } catch (error) {
    console.error('Error while updating message status:', error);
  }
};


