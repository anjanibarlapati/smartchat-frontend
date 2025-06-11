import { MessageStatus } from '../types/message';
import {encryptMessage} from './encryptMessage';
import {getTokens} from './getTokens';
import {storePendingMessages} from './storePendingMessages';
import {unsendMessages} from './unsendMessages';

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


describe('check for storing pending messages', () => {
  const senderMobileNumber = '+91 63039 74914';

  const mockMessages = [
    {
      message: 'Hii',
      sentAt: '2025-06-01T12:00:00Z',
      status: MessageStatus.PENDING,
      isSender: true,
      chat: {chatId: '+91 95021 47010'},
    },
    {
      message: 'hello',
      sentAt: '2025-06-01T12:01:00Z',
      status: MessageStatus.PENDING,
      isSender: true,
      chat: {chatId: '+91 98765 43210'},
    },
  ];

  const mockRealmWrite = jest.fn(cb => cb());

  let realm: any;

  beforeEach(() => {
    jest.clearAllMocks();

    realm = {
      objects: jest.fn().mockReturnValue({
        filtered: jest.fn().mockReturnValue(mockMessages),
      }),
      write: mockRealmWrite,
    };

    (getTokens as jest.Mock).mockResolvedValue({access_token: 'mock-token'});

    (encryptMessage as jest.Mock).mockImplementation(
      async (chatId, message) => ({
        ciphertext: `encrypted-${message}`,
        nonce: `nonce-${chatId}`,
      }),
    );
  });

  it('should encrypt and send messages, and mark them as sent if successful', async () => {
    (unsendMessages as jest.Mock).mockResolvedValue({ok: true});

    await storePendingMessages(senderMobileNumber, realm);

    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);
    expect(encryptMessage).toHaveBeenCalledTimes(2);
    expect(unsendMessages).toHaveBeenCalledWith(senderMobileNumber, [
      {
        receiverMobileNumber: '+91 95021 47010',
        message: 'encrypted-Hii',
        nonce: 'nonce-+91 95021 47010',
        sentAt: '2025-06-01T12:00:00Z',
      },
      {
        receiverMobileNumber: '+91 98765 43210',
        message: 'encrypted-hello',
        nonce: 'nonce-+91 98765 43210',
        sentAt: '2025-06-01T12:01:00Z',
      },
    ]);
    expect(realm.write).toHaveBeenCalledTimes(1);
  });

  it('should not call unsendMessages if there are no pending messages', async () => {
    realm.objects = jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue([]),
    });

    await storePendingMessages(senderMobileNumber, realm);

    expect(getTokens).not.toHaveBeenCalled();
    expect(encryptMessage).not.toHaveBeenCalled();
    expect(unsendMessages).not.toHaveBeenCalled();
    expect(realm.write).not.toHaveBeenCalled();
  });

  it('should not write to Realm if unsendMessages response is not ok', async () => {
    (unsendMessages as jest.Mock).mockResolvedValue({ok: false});

    await storePendingMessages(senderMobileNumber, realm);

    expect(realm.write).not.toHaveBeenCalled();
  });
  it('should skip messages without chat object', async () => {
    const messagesWithMissingChat = [
      {
        message: 'No chat message',
        sentAt: '2025-06-01T12:02:00Z',
        status: MessageStatus.PENDING,
        isSender: true,
        chat: undefined,
      },
    ];

    realm.objects = jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue(messagesWithMissingChat),
    });

    await storePendingMessages(senderMobileNumber, realm);

    expect(getTokens).toHaveBeenCalled();
    expect(encryptMessage).not.toHaveBeenCalled();
    expect(unsendMessages).toHaveBeenCalledWith(senderMobileNumber, []);
    expect(realm.write).not.toHaveBeenCalled();
  });
});
