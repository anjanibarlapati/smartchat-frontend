import { encryptMessage } from '../../utils/encryptMessage';
import { getTokens } from '../../utils/getTokens';
import { sendMessage } from './InputChatBox.service';

jest.mock('../../utils/getTokens');
jest.mock('../../utils/encryptMessage');

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
}));

global.fetch = jest.fn();

describe('sendMessage', () => {
  const mockSender = '+91 63039 74914';
  const mockReceiver = '+91 97021 47010';
  const mockMessage = 'Hello';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should send an encrypted message successfully', async () => {
    const mockTokens = { access_token: 'valid_token' };
    const mockEncryption = { ciphertext: 'encryptedText', nonce: 'nonce' };
    const mockFetchResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    };

    (getTokens as jest.Mock).mockResolvedValue(mockTokens);
    (encryptMessage as jest.Mock).mockResolvedValue(mockEncryption);
    (fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

    const sentAt = new Date().toISOString();

    const response = await sendMessage(mockSender, mockReceiver, mockMessage, sentAt);

    expect(getTokens).toHaveBeenCalledWith(mockSender);
    expect(encryptMessage).toHaveBeenCalledWith(
      mockReceiver,
      mockMessage,
      mockTokens.access_token,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('user/message'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'smart-chat-token-header-key': `Bearer ${mockTokens.access_token}`,
        },
        body: JSON.stringify({
          senderMobileNumber: mockSender,
          receiverMobileNumber: mockReceiver,
          message: mockEncryption.ciphertext,
          sentAt: sentAt,
          nonce: mockEncryption.nonce,
        }),
      },
    );
    expect(response).toBe(mockFetchResponse);
  });

  it('Should throw an error if fetch fails', async () => {
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'valid_token' });
    (encryptMessage as jest.Mock).mockResolvedValue({
      ciphertext: 'text',
      nonce: 'nonce',
    });
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(
      sendMessage(mockSender, mockReceiver, mockMessage, new Date().toISOString()),
    ).rejects.toThrow('Unable to send message');
  });
});




