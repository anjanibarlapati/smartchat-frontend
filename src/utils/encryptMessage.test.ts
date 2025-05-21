import EncryptedStorage from 'react-native-encrypted-storage';
import Sodium from 'react-native-libsodium';
import {encryptMessage} from './encryptMessage';
import {getPublicKey} from './keyPairs';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('./encryptionKeyPairs', () => ({
  getPublicKey: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  from_base64: jest.fn(),
  randombytes_buf: jest.fn(),
  crypto_box_easy: jest.fn(),
  to_base64: jest.fn(),
}));

describe('Check for encryted messages', () => {
  const mockAccessToken = 'valid_token';
  const mockMobileNumber = '6303974994';
  const mockMessage = 'Hii';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should encrypt a message and return ciphertext and nonce', async () => {
    const mockPublicKey = 'receiver_public_key_base64';
    const mockPrivateKey = 'sender_private_key_base64';
    const mockNonce = 'nonce_raw';
    const mockCiphertext = 'ciphertext_raw';

    (getPublicKey as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({publicKey: mockPublicKey}),
    });

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({privateKey: mockPrivateKey}),
    );

    (Sodium.from_base64 as jest.Mock).mockImplementation(
      input => `raw_${input}`,
    );
    (Sodium.randombytes_buf as jest.Mock).mockReturnValue(mockNonce);
    (Sodium.crypto_box_easy as jest.Mock).mockReturnValue(mockCiphertext);
    (Sodium.to_base64 as jest.Mock).mockImplementation(
      input => `base64(${input})`,
    );

    const result = await encryptMessage(
      mockMobileNumber,
      mockMessage,
      mockAccessToken,
    );

    expect(getPublicKey).toHaveBeenCalledWith(
      mockMobileNumber,
      mockAccessToken,
    );
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('privateKey');

    expect(Sodium.from_base64).toHaveBeenCalledWith(mockPrivateKey);
    expect(Sodium.from_base64).toHaveBeenCalledWith(mockPublicKey);
    expect(Sodium.crypto_box_easy).toHaveBeenCalledWith(
      mockMessage,
      mockNonce,
      'raw_receiver_public_key_base64',
      'raw_sender_private_key_base64',
    );
    expect(result).toEqual({
      ciphertext: 'base64(ciphertext_raw)',
      nonce: 'base64(nonce_raw)',
    });
  });
  it('Should return null if private key is not found', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await encryptMessage(
      mockMobileNumber,
      mockMessage,
      mockAccessToken,
    );
    expect(result).toBeNull();
  });
  it('Should return null if an error is thrown during the process', async () => {
    (getPublicKey as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await encryptMessage(
      mockMobileNumber,
      mockMessage,
      mockAccessToken,
    );

    expect(result).toBeNull();
  });
});
