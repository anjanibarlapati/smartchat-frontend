import { MessageStatus } from '../types/message';
import { encryptMessage } from './encryptMessage';
import { getTokens } from './getTokens';
import { storePendingMessages } from './storePendingMessages';
import { unsendMessages } from './unsendMessages';
import Realm from 'realm';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('react-native-libsodium', () => ({
  crypto_box_open_easy: jest.fn(),
  crypto_box_seal_open: jest.fn(),
}));

jest.mock('./encryptMessage');
jest.mock('./getTokens');
jest.mock('./unsendMessages');


describe('Storing pending messages', () => {
  const senderMobileNumber = '+91 63039 74914';

  const mockMessages = [
    {
      message: 'Hii',
      sentAt: '2025-06-01T12:00:00Z',
      status: MessageStatus.PENDING,
      isSender: true,
      chat: { chatId: '+91 95021 47010' },
    },
    {
      message: 'hello',
      sentAt: '2025-06-01T12:01:00Z',
      status: MessageStatus.PENDING,
      isSender: true,
      chat: { chatId: senderMobileNumber },
    },
  ];

  const mockRealmWrite = jest.fn(cb => cb());

  let realm: Partial<Realm>;

  beforeEach(() => {
    jest.clearAllMocks();

    realm = {
      objects: jest.fn().mockReturnValue({
        filtered: jest.fn().mockReturnValue(mockMessages),
      }),
      write: mockRealmWrite,
    };

    (getTokens as jest.Mock).mockResolvedValue({
      access_token: 'mock-token',
    });

    (encryptMessage as jest.Mock).mockImplementation(
      async (chatId, message) => ({
        ciphertext: `encrypted-${message}`,
        nonce: `nonce-${chatId}`,
      }),
    );
  });

  it('should encrypt, send, and mark messages as sent/seen if unsend succeeds', async () => {
    (unsendMessages as jest.Mock).mockResolvedValue({ ok: true });

    await storePendingMessages(senderMobileNumber, realm as Realm);

    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);
    expect(encryptMessage).toHaveBeenCalledTimes(2);
    expect(encryptMessage).toHaveBeenCalledWith(
      '+91 95021 47010',
      'Hii',
      'mock-token',
    );
    expect(encryptMessage).toHaveBeenCalledWith(
      senderMobileNumber,
      'hello',
      'mock-token',
    );

    expect(unsendMessages).toHaveBeenCalledWith(senderMobileNumber, [
      {
        receiverMobileNumber: '+91 95021 47010',
        message: 'encrypted-Hii',
        nonce: 'nonce-+91 95021 47010',
        sentAt: '2025-06-01T12:00:00Z',
      },
      {
        receiverMobileNumber: senderMobileNumber,
        message: 'encrypted-hello',
        nonce: 'nonce-+91 63039 74914',
        sentAt: '2025-06-01T12:01:00Z',
      },
    ], 'mock-token');

    expect(realm.write).toHaveBeenCalledTimes(1);
  });

  it('should not call anything if no pending messages exist', async () => {
    realm.objects = jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue([]),
    });

    await storePendingMessages(senderMobileNumber, realm as Realm);

    expect(getTokens).not.toHaveBeenCalled();
    expect(encryptMessage).not.toHaveBeenCalled();
    expect(unsendMessages).not.toHaveBeenCalled();
    expect(realm.write).not.toHaveBeenCalled();
  });

  it('should skip and not encrypt messages without a chat object', async () => {
    const messagesWithMissingChats = [
      {
        message: 'No chat message',
        sentAt: '2025-06-01T12:02:00Z',
        status: MessageStatus.PENDING,
        isSender: true,
        chat: undefined,
      },
    ];

    realm.objects = jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue(messagesWithMissingChats),
    });

    await storePendingMessages(senderMobileNumber, realm as Realm);

    expect(getTokens).toHaveBeenCalled();
    expect(encryptMessage).not.toHaveBeenCalled();
    expect(unsendMessages).toHaveBeenCalledWith(senderMobileNumber, [], 'mock-token');

  });

  it('should not write to realm if unsendMessages fails', async () => {
    (unsendMessages as jest.Mock).mockResolvedValue({ ok: false });

    await storePendingMessages(senderMobileNumber, realm as Realm);

    expect(realm.write).not.toHaveBeenCalled();
  });

  it('should return early if getTokens fails', async () => {
    (getTokens as jest.Mock).mockResolvedValue(undefined);

    await storePendingMessages(senderMobileNumber, realm as Realm);

    expect(encryptMessage).not.toHaveBeenCalled();
    expect(unsendMessages).not.toHaveBeenCalled();
    expect(realm.write).not.toHaveBeenCalled();
  });
});
