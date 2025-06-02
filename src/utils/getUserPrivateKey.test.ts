import { getUserPublicKey } from './getUserPrivateKey';
import { getPublicKey } from './keyPairs';
import Realm from 'realm';

jest.mock('./keyPairs');

jest.mock('react-native-libsodium', () => ({
  crypto_box_keypair: jest.fn(),
  to_base64: jest.fn(),
}));

describe('getUserPublicKey', () => {
  let mockRealm: Partial<Realm>;
  const mobileNumber = '1234567890';
  const accessToken = 'mock-token';
  const mockWrite = jest.fn((fn) => fn());

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      objectForPrimaryKey: jest.fn(),
      write: mockWrite,
      create: jest.fn(),
    };
  });

  it('Shoud return public key if already stored in realm', async () => {
    const existingChat = { publicKey: 'stored-key' };
    (mockRealm.objectForPrimaryKey as jest.Mock).mockReturnValue(existingChat);

    const result = await getUserPublicKey(mockRealm as Realm, mobileNumber, accessToken);
    expect(result).toBe('stored-key');
    expect(getPublicKey).not.toHaveBeenCalled();
  });

  it('Should fetch public key and updates existing chat in realm', async () => {
    const existingChat = { publicKey: null };
    (mockRealm.objectForPrimaryKey as jest.Mock).mockReturnValue(existingChat);

    const mockResponse = {
      ok: true,
      json: async () => ({ publicKey: 'fetched-key' }),
    };
    (getPublicKey as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getUserPublicKey(mockRealm as Realm, mobileNumber, accessToken);

    expect(result).toBe('fetched-key');
    expect(existingChat.publicKey).toBe('fetched-key');
    expect(mockRealm.create).not.toHaveBeenCalled();
  });

  it('Should create new chat entry if not found in realm', async () => {
    (mockRealm.objectForPrimaryKey as jest.Mock).mockReturnValue(null);

    const mockResponse = {
      ok: true,
      json: async () => ({ publicKey: 'new-key' }),
    };
    (getPublicKey as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getUserPublicKey(mockRealm as Realm, mobileNumber, accessToken);

    expect(result).toBe('new-key');
    expect(mockRealm.create).toHaveBeenCalledWith('Chat', {
      chatId: mobileNumber,
      isBlocked: false,
      publicKey: 'new-key',
    });
  });

  it('Should throw an error if fetch fails', async () => {
    (mockRealm.objectForPrimaryKey as jest.Mock).mockReturnValue(null);

    const mockResponse = { ok: false };
    (getPublicKey as jest.Mock).mockResolvedValue(mockResponse);

    await expect(getUserPublicKey(mockRealm as Realm, mobileNumber, accessToken))
      .rejects.toThrow('Failed to fetch public key');
  });

  it('Should throws an error if public key is still missing after fetch', async () => {
    (mockRealm.objectForPrimaryKey as jest.Mock).mockReturnValue(null);

    const mockResponse = {
      ok: true,
      json: async () => ({}),
    };
    (getPublicKey as jest.Mock).mockResolvedValue(mockResponse);

    await expect(getUserPublicKey(mockRealm as Realm, mobileNumber, accessToken))
      .rejects.toThrow('Public key is missing for decrypting message');
  });
});
