import { encryptMessage } from '../../utils/encryptMessage';
import { getTokens } from '../../utils/getTokens';
import { getSocket } from '../../utils/socket';
import { sendMessage } from './InputChatBox.service';

jest.mock('../../utils/getTokens');
jest.mock('../../utils/encryptMessage');
jest.mock('../../utils/socket');


jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
}));

describe('sendMessage', () => {
  const mockSender = '+91 63039 74914';
  const mockReceiver = '+91 97021 47010';
  const mockMessage = 'Hello';
  const mockSentAt = new Date().toISOString();
  const mockStatus = 'sent';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should emit an encrypted message to server', async () => {
    const mockTokens = { access_token: 'valid_token' };
    const mockEncryption = { ciphertext: 'encryptedText', nonce: 'nonce' };
    const emitMock = jest.fn();

    (getTokens as jest.Mock).mockResolvedValue(mockTokens);
    (encryptMessage as jest.Mock).mockResolvedValue(mockEncryption);
    (getSocket as jest.Mock).mockReturnValue({
      emit: emitMock,
    });

    const result = await sendMessage(mockSender, mockReceiver, mockMessage, mockSentAt, mockStatus);

    expect(getTokens).toHaveBeenCalledWith(mockSender);
    expect(encryptMessage).toHaveBeenCalledWith(
      mockReceiver,
      mockMessage,
      mockTokens.access_token
    );

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith('store-message', {
      senderMobileNumber: mockSender,
      receiverMobileNumber: mockReceiver,
      message: mockEncryption.ciphertext,
      nonce: mockEncryption.nonce,
      sentAt: mockSentAt,
      status: mockStatus,
    });
    expect(result).toBeUndefined();
  });

  it('Should return false if socket is not available', async () => {
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'valid_token' });
    (encryptMessage as jest.Mock).mockResolvedValue({ ciphertext: 'encryptedText', nonce: 'nonce' });
    (getSocket as jest.Mock).mockReturnValue(null);
    const result = await sendMessage(mockSender, mockReceiver, mockMessage, mockSentAt, mockStatus);
    expect(result).toBe(false);
  });

  it('Should throw an error if something fails in try block', async () => {
    (getTokens as jest.Mock).mockRejectedValue(new Error('Token error'));
    (getSocket as jest.Mock).mockReturnValue({
      emit: jest.fn(),
    });
    await expect(sendMessage(mockSender, mockReceiver, mockMessage, mockSentAt, mockStatus)).rejects.toThrow(
      'Unable to emit message to server'
    );
  });
});




