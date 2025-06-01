import { Credentials } from '../../types/Credentials';
import { Chat } from '../../types/message';
import { BASE_URL } from '../../utils/constants';
import { decryptMessage } from '../../utils/decryptMessage';
import { fetchChats, formatMessages, login } from './Login.service';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('../../utils/decryptMessage');
jest.mock('react-native-libsodium');

global.fetch = jest.fn();

const mockResponse = {
    ok: true,
    json: jest.fn().mockResolvedValue({ success: true, message: 'User login successfully' }),
};

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

const mockedCredentials: Credentials = { mobileNumber: '6303522765', password: '1234'};

describe('Login Handler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call fetch with the correct URL and method', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        await login(mockedCredentials);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockedCredentials),
        });
    });

    it('should return the response from the fetch call', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        const result = await login(mockedCredentials);
        expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
        const mockError = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        try {
            await login(mockedCredentials);
        } catch (error) {
            expect(error).toBe(mockError);
        }
    });

    it('should handle response errors', async () => {
        const mockErrorResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({ error: 'User login failed' }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);

        try {
            await login(mockedCredentials);
        } catch (error) {
            expect(error).toEqual({ error: 'User login failed' });
        }
    });
});


describe('Fetch all chats of a user', () => {
  const mobileNumber = '8639523822';
  const accessToken = 'acess_token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a fetch call properly', async () => {
    const fetchChatsMockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ chats: [] }),
    };
    (fetch as jest.Mock).mockResolvedValue(fetchChatsMockResponse);

    await fetchChats(mobileNumber, accessToken);

    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}user/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ mobileNumber }),
    });
  });

  it('Should return the response from fetch call', async () => {
    const fetchChatsMockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ chats: [] }),
    };
    (fetch as jest.Mock).mockResolvedValue(fetchChatsMockResponse);

    const response = await fetchChats(mobileNumber, accessToken);
    expect(response).toEqual(fetchChatsMockResponse);
  });

  it('Should throw error if there is any network error', async () => {
    const error = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(error);

    await expect(fetchChats(mobileNumber, accessToken)).rejects.toThrow('Network error');
  });
});


describe('Format messages of a user', ()=> {
    const accessToken = 'access_token';
    beforeAll(()=> {
        jest.clearAllMocks();
    });
    it('Should decrypt each message and format chat messages correctly', async () => {
        const chats: Chat[] = [
            {
                chatId: 'chat1',
                messages: [
                {
                    message: 'AnjaniEncrypted',
                    nonce: 'nonce',
                    chatId: 'chatid',
                    sentAt: '2023-01-01T00:00:00Z',
                    isSender: true,
                    status: 'sent',
                },
                ],
            },
        ];
        (decryptMessage as jest.Mock).mockResolvedValue('Anjani');
        const formattedMessages = await formatMessages(chats, accessToken);
        expect(decryptMessage).toHaveBeenCalledTimes(1);
        expect(formattedMessages).toEqual({
            chat1: [
                {
                message: 'Anjani',
                sentAt: '2023-01-01T00:00:00Z',
                isSender: true,
                status: 'sent',
                },
            ],
        });
    });
});
