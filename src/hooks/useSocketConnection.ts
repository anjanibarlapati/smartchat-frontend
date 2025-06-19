import { useEffect, useState } from 'react';
import { createSocket } from '../utils/socket';

export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = createSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return { isConnected };
};
