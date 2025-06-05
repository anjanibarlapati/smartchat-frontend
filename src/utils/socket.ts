import { DefaultEventsMap } from '@socket.io/component-emitter';
import EncryptedStorage from 'react-native-encrypted-storage';
import { io, Socket } from 'socket.io-client';
import { clearSuccessMessage } from '../redux/reducers/auth.reducer';
import { store } from '../redux/store';
import { Message } from '../types/message';
import { BASE_URL } from './constants';
import { decryptMessage } from './decryptMessage';
import { addNewMessageInRealm } from '../realm-database/operations/addNewMessage';
import { updateMessageStatusInRealm } from '../realm-database/operations/updateMessageStatus';
import { getRealmInstance } from '../realm-database/connection';

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const socketConnection = async (mobileNumber: string) => {
  try {
    const token = await EncryptedStorage.getItem(mobileNumber);
    if (!token) {
      return;
    }
    const tokenData = JSON.parse(token);
    await socketDisconnect();

    if (tokenData.access_token) {
      socket = io(BASE_URL, { transports: ['websocket'] });

      socket.on('connect', () => {
        socket?.emit('register', mobileNumber);
      });

      socket.on('newMessage', async data => {
        try{

          const actualMessage = await decryptMessage(
            data.chatId,
            data.message,
            data.nonce,
            tokenData.access_token
          );
          const structuredMessage: Message = {
            message: actualMessage,
            sentAt: data.sentAt,
            isSender: false,
            status: data.status,
          };
          const realm = getRealmInstance();
          addNewMessageInRealm(realm, data.chatId, structuredMessage);
        } catch (error) {
          console.error('Error in newMessage handler:', error);
        }
      });

      socket.on('messageDelivered', async data => {
        const { sentAt, receiverMobileNumber, status, messageIds, messagesCountToupdate } = data;
        updateMessageStatusInRealm( {chatId: receiverMobileNumber, sentAt: sentAt, status: status, updateAllBeforeSentAt: messagesCountToupdate, messageIds: messageIds});
      });

      socket.on('messageRead', data => {
        const { sentAt, chatId, status, updatedCount, messageIds } = data;
        updateMessageStatusInRealm( {chatId: chatId, sentAt: sentAt, messageIds: messageIds, status: status, updateAllBeforeSentAt: updatedCount > 1});
      });
      socket.on('force-logout', () => {
        store.dispatch(clearSuccessMessage());
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  } catch (error) {
    throw new Error('Unable to establish socket connection');
  }
};

export const socketDisconnect = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};

export const getSocket = () => socket;
