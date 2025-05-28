import EncryptedStorage from 'react-native-encrypted-storage';
import {io} from 'socket.io-client';
import {store} from '../redux/store';
import {decryptMessage} from './decryptMessage';
import {socketConnection, socketDisconnect} from './socket';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('./decryptMessage', () => ({
  decryptMessage: jest.fn().mockResolvedValue('Decrypted message'),
}));

const mockOn = jest.fn();
const mockDisconnect = jest.fn();
const mockEmit = jest.fn();
const mockRemoveAllListeners = jest.fn();

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

jest.spyOn(store, 'dispatch');
const mockSocket = {
  connected: false,
  on: mockOn,
  emit: mockEmit,
  disconnect: mockDisconnect,
  removeAllListeners: mockRemoveAllListeners,
};

(EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
  JSON.stringify({access_token: 'valid_token'}),
);

describe('Socket Utility', () => {
  const mobileNumber = '6303974994';

  beforeEach(() => {
    jest.clearAllMocks();
    mockOn.mockReset();
    mockDisconnect.mockReset();
    mockEmit.mockReset();
    mockRemoveAllListeners.mockReset();
  });

  it('Should not connect if token is missing', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    await socketConnection(mobileNumber);

    expect(io).not.toHaveBeenCalled();
  });

  it('Should not reconnect if already connected', async () => {
    const mockToken = JSON.stringify({access_token: 'valid_token'});

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(mockToken);

    (io as jest.Mock).mockReturnValueOnce({
      connected: true,
      on: mockOn,
      emit: mockEmit,
      disconnect: mockDisconnect,
      removeAllListeners: mockRemoveAllListeners,
    });

    await socketConnection(mobileNumber);

    expect(io).toHaveBeenCalledTimes(1);
  });

  it('Should disconnect socket when socketDisconnect is called', async () => {
    const mockToken = JSON.stringify({access_token: 'valid_token'});

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(mockToken);

    (io as jest.Mock).mockReturnValueOnce({
      connected: false,
      on: mockOn,
      emit: mockEmit,
      disconnect: mockDisconnect,
      removeAllListeners: mockRemoveAllListeners,
    });

    await socketConnection(mobileNumber);
    await socketDisconnect();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('Should establish socket connection and emit register', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'valid_token'}),
    );

    (io as jest.Mock).mockReturnValue(mockSocket);

    await socketConnection(mobileNumber);

    expect(EncryptedStorage.getItem).toHaveBeenCalledWith(mobileNumber);
    expect(io).toHaveBeenCalledWith(expect.any(String), {
      transports: ['websocket'],
    });

    const connectHandler = mockOn.mock.calls.find(
      call => call[0] === 'connect',
    )?.[1];
    expect(connectHandler).toBeDefined();

    connectHandler?.();
    expect(mockEmit).toHaveBeenCalledWith('register', mobileNumber);
  });

  it('Should handle newMessage and dispatch decrypted message', async () => {
    const mockMsgData = {
      senderMobileNumber: '6303977010',
      message: 'encrypted',
      nonce: 'nonce123',
      sentAt: '2024-01-01T12:00:00Z',
      receiverMobileNumber: mobileNumber,
    };

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'valid_token'}),
    );

    (io as jest.Mock).mockReturnValue(mockSocket);

    await socketConnection(mobileNumber);

    const newMessageHandler = mockOn.mock.calls.find(
      call => call[0] === 'newMessage',
    )?.[1];
    expect(newMessageHandler).toBeDefined();

    await newMessageHandler(mockMsgData);

    expect(decryptMessage).toHaveBeenCalledWith(
      mockMsgData.senderMobileNumber,
      mockMsgData.message,
      mockMsgData.nonce,
      'valid_token',
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('message'),
        payload: expect.objectContaining({
          chatId: mockMsgData.senderMobileNumber,
          message: expect.objectContaining({
            sender: mockMsgData.senderMobileNumber,
            receiver: mockMsgData.receiverMobileNumber,
            message: 'Decrypted message',
            sentAt: mockMsgData.sentAt,
            isSender: false,
          }),
        }),
      }),
    );
  });
  it('Should handle messageDelivered and dispatch updateMessageStatus', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'valid_token'}),
    );
    (io as jest.Mock).mockReturnValue(mockSocket);

    await socketConnection(mobileNumber);

    const handler = mockOn.mock.calls.find(
      call => call[0] === 'messageDelivered',
    )?.[1];
    expect(handler).toBeDefined();

    handler?.({
      messageId: 'hello',
      receiverMobileNumber: mobileNumber,
      status: 'delivered',
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('message'),
        payload: {
          chatId: mobileNumber,
          id: 'hello',
          status: 'delivered',
        },
      }),
    );
  });

  it('Should handle messageRead and dispatch updateMessageStatus', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'valid_token'}),
    );
    (io as jest.Mock).mockReturnValue(mockSocket);

    await socketConnection(mobileNumber);

    const handler = mockOn.mock.calls.find(
      call => call[0] === 'messageRead',
    )?.[1];
    expect(handler).toBeDefined();

    handler?.({
      messageId: 'hi',
      chatId: '123',
      status: 'read',
    });

    await new Promise(resolve => setTimeout(resolve, 450));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('message'),
        payload: {
          chatId: '123',
          id: 'hi',
          status: 'read',
        },
      }),
    );
  });

  it("Should register 'disconnect' event and log when disconnected", async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'valid_token'}),
    );

    (io as jest.Mock).mockReturnValue(mockSocket);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await socketConnection(mobileNumber);

    const disconnectHandler = mockOn.mock.calls.find(
      call => call[0] === 'disconnect',
    )?.[1];
    expect(disconnectHandler).toBeDefined();

    disconnectHandler?.();

    expect(consoleSpy).toHaveBeenCalledWith('Socket disconnected');

    consoleSpy.mockRestore();
  });

  it('Should throw an error if something fails during socket setup', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('Failed to get token'),
    );

    await expect(socketConnection(mobileNumber)).rejects.toThrow(
      'Unable to establish socket connection',
    );
  });
});
