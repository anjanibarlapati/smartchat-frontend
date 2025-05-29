import { BASE_URL } from '../../utils/constants';
import { register } from './Registration.service';

global.fetch = jest.fn();

const mockResponse = {
    ok: true,
    json: jest.fn().mockResolvedValue({ success: true, message: 'User registered successfully' }),
};

const mockFormData = new FormData();
mockFormData.append('firstName', 'Varun');
mockFormData.append('lastName', 'Kumar');
mockFormData.append('email', 'varun@gmail.com');
mockFormData.append('mobileNumber', '6303522765');
mockFormData.append('password', '1234');
mockFormData.append('profilePic', {});

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

describe('RegistrationHandler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call fetch with the correct URL and method', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        await register(mockFormData);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: mockFormData,
        });
    });

    it('should return the response from the fetch call', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        const result = await register(mockFormData);
        expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
        const mockError = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        try {
            await register(mockFormData);
        } catch (error) {
            expect(error).toBe(mockError);
        }
    });

    it('should handle response errors', async () => {
        const mockErrorResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({ error: 'User registration failed' }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);

        try {
            await register(mockFormData);
        } catch (error) {
            expect(error).toEqual({ error: 'User registration failed' });
        }
    });
});
