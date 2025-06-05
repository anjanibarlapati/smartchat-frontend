import Realm from 'realm';
import { storeChats } from '../realm-database/operations/storeChats';
import { formatMessages } from '../screens/Login/Login.service';
import { Chat, Messages, MessageStatus, UserChatData } from '../types/message';
import { getTokens } from './getTokens';
import { getUserMessages } from './getUserMessages';
import { storeMessages } from './storeMessages';

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

jest.mock('./decryptMessage');
global.fetch = jest.fn();

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));
jest.mock('./getTokens');
jest.mock('./getUserMessages');
jest.mock('../realm-database/operations/storeChats');

const mockedGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;
const mockedGetUserMessages = getUserMessages as jest.MockedFunction<typeof getUserMessages>;
const mockedFormatMessages = formatMessages as jest.MockedFunction<typeof formatMessages>;
const mockedStoreChats = storeChats as jest.MockedFunction<typeof storeChats>;

describe('tests toreMessages functionality', () => {
  const mockMobileNumber = '+91 99999 00001';
  const mockRealm = {} as Realm;

  const userChatData: UserChatData = {
    '+91 99999 00002': [
      {
        chatId: '+91 99999 00002',
        message: 'Hello!',
        nonce: 'abc123',
        sentAt: '2023-01-01T00:00:00.000Z',
        status: 'delivered',
      },
    ],
  };

  const formattedChats: Chat[] = [
    {
      chatId: '+91 99999 00002',
      messages: [
        {
          message: 'Hello!',
          nonce: 'abc123',
          sentAt: '2023-01-01T00:00:00.000Z',
          status: 'delivered',
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

  it('should fetch, format, and store messages correctly', async () => {
    mockedGetTokens.mockResolvedValue({
      access_token: 'mocked-token',
      refresh_token: 'mocked-refresh',
    });

    mockedGetUserMessages.mockResolvedValue({
      ok: true,
      json: async () => ({ chats: userChatData }),
    } as Response);

    mockedFormatMessages.mockResolvedValue(formattedMessages);

    await storeMessages(mockMobileNumber, mockRealm);

    expect(mockedGetTokens).toHaveBeenCalledWith(mockMobileNumber);
    expect(mockedGetUserMessages).toHaveBeenCalledWith(mockMobileNumber, 'mocked-token');
    expect(mockedFormatMessages).toHaveBeenCalledWith(formattedChats, 'mocked-token');
    expect(mockedStoreChats).toHaveBeenCalledWith(mockRealm, formattedMessages);
  });

  it('should throw error in case of fetch fails and any error', async () => {
    mockedGetTokens.mockRejectedValue(new Error('Token fetch failed'));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await storeMessages(mockMobileNumber, mockRealm);

    expect(consoleSpy).toHaveBeenCalledWith(
      'error in fetch unsend messages',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
