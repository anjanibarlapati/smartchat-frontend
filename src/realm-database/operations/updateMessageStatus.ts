import { MessageStatus } from '../../types/message';
import { STATUS_ORDER } from '../../utils/constants';
import { getRealmInstance } from '../connection';
import { Message } from '../schemas/Message';

type UpdateMessageStatusParams = {
  chatId: string;
  status: MessageStatus
  messageIds?: string[];
};

export const updateMessageStatusInRealm = async ({
  chatId,
  status,
  messageIds,
}: UpdateMessageStatusParams) => {
  const realm = await getRealmInstance();
  try {
    realm.write(() => {

      const messages = realm.objects<Message>('Message').filtered('chat.chatId == $0', chatId).sorted('sentAt', true);
      for (const message of messages) {
        let requiredMessage = false;
        if(messageIds) {
          requiredMessage = messageIds.includes(message.sentAt) && message.isSender === true;
        } else{
          requiredMessage = message.isSender === false;
        }
        if(!requiredMessage){continue;}

        const currentStatusRank = STATUS_ORDER[message.status];
        const newStatusRank = STATUS_ORDER[status];

        if (newStatusRank > currentStatusRank) {

          message.status = status;
        } else {
          break;
        }
      }
    });
  } catch (error) {
    console.error('Error while updating message status:', error);
  }
};


