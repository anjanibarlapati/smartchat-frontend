import EncryptedStorage from 'react-native-encrypted-storage';
import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { decryptMessage } from './decryptMessage';
import { socketConnection, socketDisconnect } from './socket';
import { getRealmInstance } from '../realm-database/connection';
import { updateMessageStatusInRealm } from '../realm-database/operations/updateMessageStatus';
import { addNewMessageInRealm } from '../realm-database/operations/addNewMessage';
import { updateUserAccountStatusInRealm } from '../realm-database/operations/updateUserAccountStatus';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('./decryptMessage', () => ({
  decryptMessage: jest.fn().mockResolvedValue('Decrypted message'),
}));

jest.mock('../realm-database/operations/addNewMessage', () => ({
  addNewMessageInRealm: jest.fn(),
}));

jest.mock('../realm-database/operations/updateMessageStatus', () => ({
  updateMessageStatusInRealm: jest.fn(),
}));

jest.mock('../realm-database/operations/updateUserAccountStatus', () => ({
  updateUserAccountStatusInRealm: jest.fn(),
}));

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

jest.mock('../realm-database/connection', () => ({
  getRealmInstance: jest.fn(),
}));

const mockRealmInstance = {
  write: jest.fn((fn) => fn()),
  create: jest.fn(),
};

jest.spyOn(store, 'dispatch');

const mockOn = jest.fn();
const mockEmit = jest.fn();
const mockDisconnect = jest.fn();
const mockRemoveAllListeners = jest.fn();

const mockSocket = {
  connected: false,
  on: mockOn,
  emit: mockEmit,
  disconnect: mockDisconnect,
  removeAllListeners: mockRemoveAllListeners,
};

describe('Socket Utility (with Realm instance mocking)', () => {
  const mobileNumber = '6303974994';
  const mockToken = JSON.stringify({ access_token: 'valid_token' });

  beforeEach(() => {
    jest.clearAllMocks();
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(mockToken);
    (io as jest.Mock).mockReturnValue(mockSocket);
    (getRealmInstance as jest.Mock).mockReturnValue(mockRealmInstance);
  });

  it('should not connect if token is missing', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
    await socketConnection(mobileNumber);
    expect(io).not.toHaveBeenCalled();
  });

  it('should disconnect socket on socketDisconnect', async () => {
    await socketConnection(mobileNumber);
    socketDisconnect();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockRemoveAllListeners).toHaveBeenCalled();
  });

  it('should establish socket connection and emit register event', async () => {
    await socketConnection(mobileNumber);
    const connectHandler = mockOn.mock.calls.find(call => call[0] === 'connect')?.[1];
    expect(connectHandler).toBeDefined();
    connectHandler?.();
    expect(mockEmit).toHaveBeenCalledWith('register', mobileNumber);
  });

  it('should handle newMessage event and update Realm with decrypted message', async () => {
    const messageData = {
      chatId: '9876543210',
      message: 'encryptedMsg',
      nonce: 'nonce123',
      sentAt: '2024-01-01T12:00:00Z',
      status: 'delivered',
    };

    await socketConnection(mobileNumber);
    const handler = mockOn.mock.calls.find(call => call[0] === 'newMessage')?.[1];
    await handler?.(messageData);

    expect(decryptMessage).toHaveBeenCalledWith(
      messageData.chatId,
      messageData.message,
      messageData.nonce,
      'valid_token'
    );

    expect(addNewMessageInRealm).toHaveBeenCalledWith(
      mockRealmInstance,
      messageData.chatId,
      {
        message: 'Decrypted message',
        sentAt: messageData.sentAt,
        isSender: false,
        status: messageData.status,
      }
    );
  });

  it('should log error if decryptMessage throws in newMessage handler', async () => {
    const messageData = {
      chatId: '9876543210',
      message: 'Anjani',
      nonce: 'nonce',
      sentAt: '2025-06-01T12:00:00Z',
      status: 'delivered',
    };

    const mockError = new Error('Decryption failed');
    (decryptMessage as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await socketConnection(mobileNumber);
    const handler = mockOn.mock.calls.find(call => call[0] === 'newMessage')?.[1];

    await handler?.(messageData);

    expect(console.error).toHaveBeenCalledWith(
      'Error in newMessage handler:',
      mockError
    );

    consoleSpy.mockRestore();
  });


  it('should handle messageDelivered and call updateMessageStatusInRealm', async () => {
    const deliveryData = {
      sentAt: '2024-01-01T12:00:00Z',
      receiverMobileNumber: mobileNumber,
      status: 'delivered',
    };

    await socketConnection(mobileNumber);
    const handler = mockOn.mock.calls.find(call => call[0] === 'messageDelivered')?.[1];
    handler?.(deliveryData);

    expect(updateMessageStatusInRealm).toHaveBeenCalledWith({
      chatId: mobileNumber,
      sentAt: deliveryData.sentAt,
      status: 'delivered',
    });
  });

  it('should handle messageRead and update multiple messages as seen', async () => {
    const readData = {
      chatId: '123',
      sentAt: '2024-01-01T12:00:00Z',
      status: 'seen',
      updatedCount: 2,
    };

    await socketConnection(mobileNumber);
    const handler = mockOn.mock.calls.find(call => call[0] === 'messageRead')?.[1];
    handler?.(readData);

    expect(updateMessageStatusInRealm).toHaveBeenCalledWith({
      chatId: '123',
      sentAt: readData.sentAt,
      status: 'seen',
      updateAllBeforeSentAt: true,
    });
  });

    it('should handle isAccountDeleted and call updateUserAccountStatusInRealm', async () => {
      const deliveryData = {
        isAccountDeleted: true,
        chatId: mobileNumber,
      };

      await socketConnection(mobileNumber);
      const handler = mockOn.mock.calls.find(call => call[0] === 'isAccountDeleted')?.[1];
      handler?.(deliveryData);

      expect(updateUserAccountStatusInRealm).toHaveBeenCalledWith(
        mobileNumber,
        true,
      );
    });

  it('should handle disconnect and log it', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await socketConnection(mobileNumber);

    const handler = mockOn.mock.calls.find(call => call[0] === 'disconnect')?.[1];
    handler?.();

    expect(consoleSpy).toHaveBeenCalledWith('Socket disconnected');
    consoleSpy.mockRestore();
  });

  it('should dispatch logout on force-logout event', async () => {
    await socketConnection(mobileNumber);
    const handler = mockOn.mock.calls.find(call => call[0] === 'force-logout')?.[1];
    handler?.();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should throw error if token retrieval fails', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('Storage failure')
    );
    await expect(socketConnection(mobileNumber)).rejects.toThrow(
      'Unable to establish socket connection'
    );
  });
});
