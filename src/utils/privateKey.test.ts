import Sodium from 'react-native-libsodium';
import { decryptPrivateKey, encryptPrivateKey } from './privateKey';


jest.mock('react-native-libsodium', () => ({
  randombytes_buf: jest.fn(),
  crypto_pwhash: jest.fn(),
  crypto_secretbox_easy: jest.fn(),
  crypto_secretbox_open_easy: jest.fn(),
  from_base64: jest.fn(),
  to_base64: jest.fn(),
  crypto_pwhash_SALTBYTES: 16,
  crypto_secretbox_NONCEBYTES: 24,
  crypto_secretbox_KEYBYTES: 32,
  crypto_pwhash_ALG_DEFAULT: 2,
}));

describe('Encrypt private key of the user', () => {
  const mockSalt = new Uint8Array(16).fill(1);
  const mockNonce = new Uint8Array(24).fill(2);
  const mockKey = new Uint8Array(32).fill(3);
  const mockCipher = new Uint8Array([10, 20, 30]);

  beforeEach(() => {
    jest.clearAllMocks();

    (Sodium.randombytes_buf as jest.Mock)
      .mockReturnValueOnce(mockSalt)
      .mockReturnValueOnce(mockNonce);

    (Sodium.crypto_pwhash as jest.Mock).mockReturnValue(mockKey);
    (Sodium.from_base64 as jest.Mock).mockImplementation(input => `raw_${input}`);
    (Sodium.crypto_secretbox_easy as jest.Mock).mockReturnValue(mockCipher);
    (Sodium.to_base64 as jest.Mock).mockImplementation(input => `base64(${input})`);
  });

  it('should return encrypted private key, salt, and nonce as base64 strings', async () => {
    const base64PrivateKey = 'base64PrivateKeyString';
    const userId = 'anjani_123';

    const result = await encryptPrivateKey(base64PrivateKey, userId);

    expect(Sodium.randombytes_buf).toHaveBeenCalledTimes(2);
    expect(Sodium.crypto_pwhash).toHaveBeenCalledWith(
      Sodium.crypto_secretbox_KEYBYTES,
      userId,
      mockSalt,
      3,
      33554432,
      Sodium.crypto_pwhash_ALG_DEFAULT
    );
    expect(Sodium.crypto_secretbox_easy).toHaveBeenCalledWith(
      `raw_${base64PrivateKey}`,
      mockNonce,
      mockKey
    );
    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('nonce');
    expect(result).toHaveProperty('privateKey');
  });
});


describe('Decrypt private key of the user', () => {
  const mockSaltBytes = new Uint8Array(16).fill(1);
  const mockNonceBytes = new Uint8Array(24).fill(2);
  const mockCipherBytes = new Uint8Array([10, 20, 30]);
  const mockKey = new Uint8Array(32).fill(3);
  const mockDecrypted = new Uint8Array([100, 101, 102]);

  beforeEach(() => {
    jest.clearAllMocks();

    (Sodium.from_base64 as jest.Mock)
      .mockImplementationOnce(() => mockSaltBytes)
      .mockImplementationOnce(() => mockNonceBytes)
      .mockImplementationOnce(() => mockCipherBytes);

    (Sodium.crypto_pwhash as jest.Mock).mockReturnValue(mockKey);
    (Sodium.crypto_secretbox_open_easy as jest.Mock).mockReturnValue(mockDecrypted);
    (Sodium.to_base64 as jest.Mock).mockReturnValue('decryptedPrivateKey');
  });

  it('should return decrypted private key as base64', async () => {
    const result = await decryptPrivateKey(
      'salt',
      'nonce',
      'ciphertext',
      'anjani_123'
    );

    expect(Sodium.crypto_pwhash).toHaveBeenCalledWith(
      Sodium.crypto_secretbox_KEYBYTES,
      'anjani_123',
      mockSaltBytes,
      3,
      33554432,
      Sodium.crypto_pwhash_ALG_DEFAULT
    );

    expect(Sodium.crypto_secretbox_open_easy).toHaveBeenCalledWith(
      mockCipherBytes,
      mockNonceBytes,
      mockKey
    );

    expect(result).toBe('decryptedPrivateKey');
  });
});
