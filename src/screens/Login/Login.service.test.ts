import { Credentials } from '../../types/Credentials';
import { BASE_URL } from '../../utils/constants';
import { login } from './Login.service';

global.fetch = jest.fn();

const mockResponse = {
    ok: true,
    json: jest.fn().mockResolvedValue({ success: true, message: 'User login successfully' }),
};

const mockedCredentials: Credentials = { mobileNumber: '6303522765', password: '1234'};

describe('LoginHandler', () => {
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
