import EncryptedStorage from 'react-native-encrypted-storage';
import Sodium from 'react-native-libsodium';
import { getRealmInstance } from '../realm-database/connection';
import { decryptMessage } from './decryptMessage';
import { getUserPublicKey } from './getUserPublicKey';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));


jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('./getUserPublicKey', ()=>({
  getUserPublicKey: jest.fn(),
}));

jest.mock('../realm-database/connection', ()=>({
  getRealmInstance: jest.fn(),
}));


const mockRealmInstance = {
  write: jest.fn((fn) => fn()),
  create: jest.fn(),
};

jest.mock('react-native-libsodium', () => ({
  from_base64: jest.fn(),
  crypto_box_open_easy: jest.fn(),
  to_string: jest.fn(),
}));

describe('Check for decryption of messages', () => {
  const mockAccessToken = 'valid_token';
  const mockSenderNumber = '6303977010';
  const mockCiphertextBase64 = 'ciphertext_base64';
  const mockNonceBase64 = 'nonce_base64';

  beforeEach(() => {
    jest.clearAllMocks();
    (getRealmInstance as jest.Mock).mockResolvedValue(mockRealmInstance);
  });

  it('Should decrypt a message and return the message', async () => {
    const mockPrivateKey = 'receiver_private_key_base64';
    const mockPublicKey = 'sender_public_key_base64';

    const mockDecrypted = 'decrypted_buffer';
    const mockDecryptedMessage = 'Hii';

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({privateKey: mockPrivateKey}),
    );

    (getUserPublicKey as jest.Mock).mockResolvedValue(mockPublicKey);

    (Sodium.from_base64 as jest.Mock).mockImplementation(
      input => `raw_${input}`,
    );
    (Sodium.crypto_box_open_easy as jest.Mock).mockReturnValue(mockDecrypted);
    (Sodium.to_string as jest.Mock).mockReturnValue(mockDecryptedMessage);

    const result = await decryptMessage(
      mockSenderNumber,
      mockCiphertextBase64,
      mockNonceBase64,
      mockAccessToken,
    );
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('privateKey');
    expect(getUserPublicKey).toHaveBeenCalledWith(
      mockRealmInstance,
      mockSenderNumber,
      mockAccessToken,
    );
    expect(Sodium.from_base64).toHaveBeenCalledWith(mockCiphertextBase64);
    expect(Sodium.from_base64).toHaveBeenCalledWith(mockNonceBase64);
    expect(Sodium.from_base64).toHaveBeenCalledWith(mockPublicKey);
    expect(Sodium.from_base64).toHaveBeenCalledWith(mockPrivateKey);
    expect(Sodium.crypto_box_open_easy).toHaveBeenCalledWith(
      'raw_ciphertext_base64',
      'raw_nonce_base64',
      'raw_sender_public_key_base64',
      'raw_receiver_private_key_base64',
    );
    expect(Sodium.to_string).toHaveBeenCalledWith(mockDecrypted);
    expect(result).toBe(mockDecryptedMessage);
  });
it('should throw error if private key is not found', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    await expect(
      decryptMessage(mockSenderNumber, mockCiphertextBase64, mockNonceBase64, mockAccessToken),
    ).rejects.toThrow('Unable to decrypt message');
  });
});
