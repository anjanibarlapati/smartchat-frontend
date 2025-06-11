import Realm from 'realm';
import {Message} from '../realm-database/schemas/Message';
import {encryptMessage} from './encryptMessage';
import {getTokens} from './getTokens';
import {unsendMessages} from './unsendMessages';
import { MessageStatus } from '../types/message';

export type MessageToSend = {
  receiverMobileNumber: string;
  message: string;
  nonce: string;
  sentAt: string;
};

export const storePendingMessages = async (
  senderMobileNumber: string,
  realm: Realm,
) => {
  const pendingMessages = realm
    .objects<Message>('Message')
    .filtered('status == $0 AND isSender == true', MessageStatus.PENDING,);

  if (pendingMessages.length === 0) {
    return;
  }
  const messagesToSend: MessageToSend[] = [];
  const tokens = await getTokens(senderMobileNumber);
  for (const message of pendingMessages) {
    if (message.chat) {
      const {ciphertext, nonce} = await encryptMessage(
        message.chat.chatId,
        message.message,
        tokens.access_token,
      );
      messagesToSend.push({
        receiverMobileNumber: message.chat.chatId,
        message: ciphertext,
        nonce,
        sentAt: message.sentAt,
      });
    }
  }
  const response = await unsendMessages(senderMobileNumber, messagesToSend);

  if (response.ok) {
    realm.write(() => {
      pendingMessages.forEach(msg => {
        if(senderMobileNumber === msg.chat.chatId){
          msg.status = MessageStatus.SEEN;
        } else{
          msg.status = MessageStatus.SENT;
        }
      });
    });
  }
};
