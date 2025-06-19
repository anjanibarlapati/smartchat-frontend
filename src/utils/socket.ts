import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './constants';

let socket: Socket | null = null;

export const createSocket = (): Socket => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
};

export const socketDisconnect = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};

export const socketConnection = (mobileNumber: string): void => {
  socket = createSocket();

  if (!socket) {return;}

  const register = () => {
    if (socket && socket.connected) {
      socket.emit('register', mobileNumber);
      console.log(`User ${mobileNumber} registered with socket ${socket.id}`);
    }
  };

  socket.off('connect', register);
  socket.on('connect', register);

  if (socket.connected) {
    register();
  }
};

export const getSocket = (): Socket | null => socket;
