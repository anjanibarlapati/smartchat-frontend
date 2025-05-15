import { BASE_URL } from '../../utils/constants';
import { fetchContacts } from './Contact.service';

global.fetch = jest.fn();

const mockResponse = {
    ok: true,
    json: jest.fn().mockResolvedValue({ }),
};

const phoneNumbers:string[] = [ '8639523822', '9849545903'];
const mockedAccessToken: string = 'anjani';


describe('Get contacts details of user HTTP request', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call fetch with the correct URL and method', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        await fetchContacts(phoneNumbers, mockedAccessToken);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}user/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'smart-chat-token-header-key': `Bearer ${mockedAccessToken}`,
            },
            body: JSON.stringify({phoneNumbers}),
        });
    });

    it('should return the response from the fetch call', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        const result = await fetchContacts(phoneNumbers, mockedAccessToken);
        expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
        const mockError = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        try {
            await fetchContacts(phoneNumbers, mockedAccessToken);
        } catch (error) {
            expect(error).toBe(mockError);
        }
    });

});
