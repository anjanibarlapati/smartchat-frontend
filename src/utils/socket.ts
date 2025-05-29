
import { DefaultEventsMap } from '@socket.io/component-emitter';
import EncryptedStorage from 'react-native-encrypted-storage';
import { io, Socket } from 'socket.io-client';
import { clearSuccessMessage } from '../redux/reducers/auth.reducer';
import { addMessage } from '../redux/reducers/messages.reducer';
import { store } from '../redux/store';
import { BASE_URL } from './constants';
import { decryptMessage } from './decryptMessage';


let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const socketConnection = async (mobileNumber: string) => {

  try {
    const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const token = await EncryptedStorage.getItem(mobileNumber);
    if (!token) { return; }
    const tokenData = JSON.parse(token);
    await socketDisconnect();

    if (tokenData.access_token) {
      socket = io(BASE_URL, { transports: ['websocket']});

      socket.on('connect', () => {
        socket?.emit('register', mobileNumber);
      });

      socket.on('newMessage', async (data) => {
        const actualMessage = await decryptMessage(
          data.senderMobileNumber,
          data.message,
          data.nonce,
          tokenData.access_token
        );
        const structuredMsg: any = {
          id: generateId(),
          sender: data.senderMobileNumber,
          receiver: data.receiverMobileNumber,
          message: actualMessage,
          sentAt: data.sentAt,
          isSender: false,
        };
        store.dispatch(addMessage({ chatId: data.senderMobileNumber, message: structuredMsg }));
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


export const socketDisconnect = async () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};
