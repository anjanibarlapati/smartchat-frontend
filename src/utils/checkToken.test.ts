import EncryptedStorage from 'react-native-encrypted-storage';
import { checkAccessToken } from './checkToken';


global.fetch = jest.fn();

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockUser = {
  mobileNumber: '1234567890',
};

const mockToken = {
  access_token: 'oldAccessToken',
  refresh_token: 'validRefreshToken',
};

describe('checkAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should update access token if newAccessToken is returned', async () => {

    (EncryptedStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(mockUser))
      .mockResolvedValueOnce(JSON.stringify(mockToken));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ newAccessToken: 'newAccessToken123' }),
    });

    await checkAccessToken();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: mockToken.access_token,
        refreshToken: mockToken.refresh_token,
      }),
    });

    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      mockUser.mobileNumber,
      JSON.stringify({
        access_token: 'newAccessToken123',
        refresh_token: mockToken.refresh_token,
      })
    );
  });

  it('Should not update access token if no newAccessToken is returned', async () => {
    (EncryptedStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(mockUser))
      .mockResolvedValueOnce(JSON.stringify(mockToken));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await checkAccessToken();

    expect(EncryptedStorage.setItem).not.toHaveBeenCalled();
  });

  it('Should do nothing if no user is stored', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    await checkAccessToken();

    expect(fetch).not.toHaveBeenCalled();
    expect(EncryptedStorage.setItem).not.toHaveBeenCalled();
  });

  it('should throw error if EncryptedStorage.getItem fails', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage failed'));

    await expect(checkAccessToken()).rejects.toThrow('Token check failed');
  });

  it('Should not update token if response is not ok', async () => {
    (EncryptedStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(mockUser))
      .mockResolvedValueOnce(JSON.stringify(mockToken));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await checkAccessToken();

    expect(EncryptedStorage.setItem).not.toHaveBeenCalled();
  });

});
