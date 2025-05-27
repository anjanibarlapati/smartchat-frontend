import { getTokens } from '../../utils/getTokens';
import { clearUserChat } from './clearChat.service';
global.fetch = jest.fn();

jest.mock('../../utils/getTokens');
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));
describe('clearChat service functionality',()=> {
    const senderMobileNumber = '8907651234';
    const receiverMobileNumber = '8097612342';
    beforeEach(()=> {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });
   it('should call fetch when clearUserChat function is called', async()=> {
      const mockTokens = { access_token: 'valid_token' };
      (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
      (getTokens as jest.Mock).mockResolvedValue(mockTokens);
       await clearUserChat(senderMobileNumber, receiverMobileNumber);
        expect(fetch).toHaveBeenCalled();
   });
   it('should return clearedChat successfully message if the response is ok',async()=> {
      const mockTokens = { access_token: 'valid_token' };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'Cleared chat successfully' }),
       };
      (getTokens as jest.Mock).mockResolvedValue(mockTokens);
      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
       const response = await clearUserChat(senderMobileNumber, receiverMobileNumber);
       expect(response.ok).toBe(true);
   });

   it('should throw error if fetch call fails', async()=> {
        const mockTokens = {token: 'valid_token' };
         (fetch as jest.Mock).mockRejectedValue(new Error('unable to make a fetch call'));
        (getTokens as jest.Mock).mockResolvedValue(mockTokens);
        await expect(
            clearUserChat(senderMobileNumber, receiverMobileNumber),
        ).rejects.toThrow('Error while clearing the chat');
   });
});

