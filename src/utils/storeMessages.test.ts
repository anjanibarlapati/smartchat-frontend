import Realm from 'realm';
import { storeMessages } from './storeMessages';
import { storeChats } from '../realm-database/operations/storeChats';
import { formatMessages } from '../screens/Login/Login.service';
import { getTokens } from './getTokens';
import { getUserMessages } from './getUserMessages';
import { MessageStatus, Messages, Chat } from '../types/message';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_open_easy: jest.fn(),
  crypto_box_seal_open: jest.fn(),
}));

jest.mock('../screens/Login/Login.service', () => ({
  formatMessages: jest.fn(),
}));
jest.mock('../realm-database/operations/storeChats', () => ({
  storeChats: jest.fn(),
}));
jest.mock('./getTokens');
jest.mock('./getUserMessages');

const mockedGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;
const mockedGetUserMessages = getUserMessages as jest.MockedFunction<typeof getUserMessages>;
const mockedFormatMessages = formatMessages as jest.MockedFunction<typeof formatMessages>;
const mockedStoreChats = storeChats as jest.MockedFunction<typeof storeChats>;

describe('storeMessages', () => {
  const mockMobileNumber = '+91 99999 00001';
  const mockRealm = {} as Realm;

  const formattedChats: Chat[] = [
    {
      chatId: '+91 99999 00002',
      messages: [
        {
          message: 'Hello!',
          nonce: 'abc123',
          sentAt: '2023-01-01T00:00:00.000Z',
          status: MessageStatus.DELIVERED,
          isSender: false,
        },
      ],
    },
  ];

  const formattedMessages: Messages = {
    '+91 99999 00002': [
      {
        message: 'Decrypted Hello!',
        sentAt: '2023-01-01T00:00:00.000Z',
        isSender: false,
        status: MessageStatus.DELIVERED,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch, format, and store messages correctly', async () => {
    mockedGetTokens.mockResolvedValue({
      access_token: 'mocked-token',
      refresh_token: 'mocked-refresh',
    });

    mockedGetUserMessages.mockResolvedValue({
      ok: true,
      json: async () => ({ chats: formattedChats }),
    } as Response);

    mockedFormatMessages.mockResolvedValue(formattedMessages);

    await storeMessages(mockMobileNumber, mockRealm);

    expect(mockedGetTokens).toHaveBeenCalledWith(mockMobileNumber);
    expect(mockedGetUserMessages).toHaveBeenCalledWith(mockMobileNumber, 'mocked-token');
    expect(mockedFormatMessages).toHaveBeenCalledWith(formattedChats, 'mocked-token');
    expect(mockedStoreChats).toHaveBeenCalledWith(mockRealm, formattedMessages);
  });

  it('should not call formatMessages or storeChats if chats array is empty', async () => {
    mockedGetTokens.mockResolvedValue({
      access_token: 'mocked-token',
      refresh_token: 'mocked-refresh',
    });

    mockedGetUserMessages.mockResolvedValue({
      ok: true,
      json: async () => ({ chats: [] }),
    } as Response);

    await storeMessages(mockMobileNumber, mockRealm);

    expect(mockedFormatMessages).not.toHaveBeenCalled();
    expect(mockedStoreChats).not.toHaveBeenCalled();
  });

  it('should handle error if token fetching fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    mockedGetTokens.mockRejectedValue(new Error('Token fetch failed'));

    await storeMessages(mockMobileNumber, mockRealm);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in fetching messages',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should handle error when fetching user messages fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    mockedGetTokens.mockResolvedValue({
      access_token: 'mocked-token',
      refresh_token: 'mocked-refresh',
    });

    mockedGetUserMessages.mockRejectedValue(new Error('API failed'));

    await storeMessages(mockMobileNumber, mockRealm);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in fetching messages',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
