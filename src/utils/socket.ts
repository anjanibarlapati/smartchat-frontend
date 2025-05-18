import {io} from 'socket.io-client';
import {BASE_URL} from './constants';
import EncryptedStorage from 'react-native-encrypted-storage';

let socket : any;
export const socketConnection = async () => {
  try {
    const token = await EncryptedStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(token);

      if (tokenData.access_token) {
         socket = io(BASE_URL, {
          transports: ['websocket'],
        });
        socket.on('connect', () => {
          console.log('socket connection', socket.connected);
          console.log('socket id is', socket.id);
        });
        socket.on('disconnect', () => {
          console.log('socket disconnected');
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const socketDisconnect = async () =>{
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};




