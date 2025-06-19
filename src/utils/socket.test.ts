import { io, Socket } from 'socket.io-client';
import { createSocket, socketDisconnect, getSocket } from './socket';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockDisconnect = jest.fn();
const mockRemoveAllListeners = jest.fn();

const mockSocket: Partial<Socket> = {
  emit: mockEmit,
  on: mockOn,
  off: mockOff,
  disconnect: mockDisconnect,
  removeAllListeners: mockRemoveAllListeners,
  connected: false,
  id: 'mock-socket-id',
};

describe('Socket Utility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    socketDisconnect();
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  describe('createSocket', () => {
    it('should create and return a new socket if none exists', () => {
      const socket = createSocket();
      expect(io).toHaveBeenCalledWith(expect.any(String), {
        transports: ['websocket'],
        autoConnect: true,
      });
      expect(socket).toBe(mockSocket);
    });

    it('should return existing socket if already created', () => {
      (io as jest.Mock).mockReturnValue(mockSocket);
      socketDisconnect();
      const first = createSocket();
      const second = createSocket();
      expect(first).toBe(second);
      expect(io).toHaveBeenCalledTimes(1);
    });
  });

  describe('socketDisconnect', () => {
    it('should disconnect and remove all listeners', () => {
      createSocket();
      socketDisconnect();

      expect(mockRemoveAllListeners).toHaveBeenCalled();
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should do nothing if socket is null', () => {
      socketDisconnect();
      expect(mockRemoveAllListeners).not.toHaveBeenCalled();
      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  // describe('socketConnection', () => {
  //   it('should register connect event and emit register if already connected', () => {
  //     mockSocket.connected = true;

  //     const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  //     createSocket();
  //     socketConnection('9876543210');

  //     const registerCallback = mockOn.mock.calls.find(call => call[0] === 'connect')?.[1];
  //     registerCallback?.();

  //     expect(mockOff).toHaveBeenCalledWith('connect', expect.any(Function));
  //     expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function));
  //     expect(mockEmit).toHaveBeenCalledWith('register', '9876543210');
  //     expect(logSpy).toHaveBeenCalledWith(
  //       'User 9876543210 registered with socket mock-socket-id'
  //     );

  //     logSpy.mockRestore();
  //   });

  //   it('should not emit register if not connected initially', () => {
  //     mockSocket.connected = false;

  //     const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  //     createSocket();
  //     socketConnection('1234567890');

  //     expect(mockEmit).not.toHaveBeenCalled();
  //     expect(logSpy).not.toHaveBeenCalledWith(
  //       'User 1234567890 registered with socket mock-socket-id'
  //     );

  //     logSpy.mockRestore();
  //   });
  //   it('should return early and not register events if socket is null after disconnect', () => {
  //       (io as jest.Mock).mockReturnValue(null);

  //       socketConnection('9876543210');

  //       expect(mockOn).not.toHaveBeenCalled();
  //       expect(mockEmit).not.toHaveBeenCalled();
  //   });
  // });

  describe('getSocket', () => {
    it('should return current socket instance', () => {
      const instance = createSocket();
      expect(getSocket()).toBe(instance);
    });

    it('should return null if socket is not initialized', () => {
      socketDisconnect();
      expect(getSocket()).toBe(null);
    });
  });
});
