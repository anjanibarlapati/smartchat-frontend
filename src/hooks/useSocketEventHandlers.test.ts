import { renderHook, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getRealmInstance } from '../realm-database/connection';
import { addNewMessageInRealm } from '../realm-database/operations/addNewMessage';
import { updateMessageStatusInRealm } from '../realm-database/operations/updateMessageStatus';
import { updateUserAccountStatusInRealm } from '../realm-database/operations/updateUserAccountStatus';
import { clearSuccessMessage } from '../redux/reducers/auth.reducer';
import { store } from '../redux/store';
import { MessageStatus } from '../types/message';
import { decryptMessage } from '../utils/decryptMessage';
import { getSocket } from '../utils/socket';
import { useSocketEventHandlers } from './useSocketEventHandlers';
import { getTokens } from '../utils/getTokens';


jest.mock('../utils/getTokens');
jest.mock('../utils/socket');
jest.mock('../utils/decryptMessage');
jest.mock('../realm-database/operations/addNewMessage');
jest.mock('../realm-database/operations/updateMessageStatus');
jest.mock('../realm-database/operations/updateUserAccountStatus');
jest.mock('../realm-database/connection');
jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => mockUseSelector(selector),
}));

jest.mock('../redux/store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  connected: true,
};

describe('useSocketEventHandlers', () => {
  let eventHandlers: Record<string, Function> = {};

  const mockMessageData = {
    chatId: '9876543210',
    message: 'encrypted-message',
    nonce: 'mock-nonce',
    sentAt: new Date().toISOString(),
    status: 'sent',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSocket as jest.Mock).mockReturnValue(mockSocket);
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ access_token: 'mock-token' })
    );
    (getRealmInstance as jest.Mock).mockReturnValue({});
    (decryptMessage as jest.Mock).mockResolvedValue('Decrypted message');

    mockUseSelector.mockReturnValue({ mobileNumber: '1234567890' });
    mockSocket.on.mockImplementation((event, handler) => {
      eventHandlers[event] = handler;
    });
  });

  test('should handle newMessage and call addNewMessageInRealm with decrypted content', async () => {
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
    });

    await eventHandlers.newMessage(mockMessageData);

    expect(decryptMessage).toHaveBeenCalledWith(
      mockMessageData.chatId,
      mockMessageData.message,
      mockMessageData.nonce,
      'mock-token'
    );

    expect(addNewMessageInRealm).toHaveBeenCalledWith({}, mockMessageData.chatId, {
      message: 'Decrypted message',
      sentAt: mockMessageData.sentAt,
      isSender: false,
      status: mockMessageData.status,
    });
  });

  test('should handle messageDelivered', async () => {
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalled();
    });

    await eventHandlers.messageDelivered({
      receiverMobileNumber: '1234567890',
      messageIds: ['m1', 'm2'],
    });

    expect(updateMessageStatusInRealm).toHaveBeenCalledWith({
      chatId: '1234567890',
      messageIds: ['m1', 'm2'],
      status: MessageStatus.DELIVERED,
    });
  });

  test('should handle messageRead', async () => {
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalled();
    });

    await eventHandlers.messageRead({
      receiverMobileNumber: '1234567890',
      messageIds: ['msg1'],
    });

    expect(updateMessageStatusInRealm).toHaveBeenCalledWith({
      chatId: '1234567890',
      messageIds: ['msg1'],
      status: MessageStatus.SEEN,
    });
  });

  test('should handle isAccountDeleted', async () => {
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalled();
    });

    await eventHandlers.isAccountDeleted({
      isAccountDeleted: true,
      chatId: '9876543210',
    });

    expect(updateUserAccountStatusInRealm).toHaveBeenCalledWith('9876543210', true);
  });

  test('should handle force-logout', async () => {
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalled();
    });

    await eventHandlers['force-logout']();

    expect(store.dispatch).toHaveBeenCalledWith(clearSuccessMessage());
  });

  test('should handle disconnect event', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    renderHook(() => useSocketEventHandlers());

    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalled();
    });

    await eventHandlers.disconnect();

    expect(logSpy).toHaveBeenCalledWith('Socket disconnected:', expect.any(String));
    logSpy.mockRestore();
  });
});
