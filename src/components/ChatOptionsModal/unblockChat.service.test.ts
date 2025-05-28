import { getTokens } from '../../utils/getTokens';
import { unblockUserChat } from './unblockChat.service';
global.fetch = jest.fn();

jest.mock('../../utils/getTokens');
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));
describe('blockChat service functionality',()=> {
    const senderMobileNumber = '8907651234';
    const receiverMobileNumber = '8097612342';
    beforeEach(()=> {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });
   it('should call fetch when unblockUserChat function is called', async()=> {
      const mockTokens = { access_token: 'valid_token' };
      (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
      (getTokens as jest.Mock).mockResolvedValue(mockTokens);
       await unblockUserChat(senderMobileNumber, receiverMobileNumber);
        expect(fetch).toHaveBeenCalled();
   });
   it('should return unblocked successfully if the response is ok',async()=> {
      const mockTokens = { access_token: 'valid_token' };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'User unblocked successfully' }),
       };
      (getTokens as jest.Mock).mockResolvedValue(mockTokens);
      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
       const response = await unblockUserChat(senderMobileNumber, receiverMobileNumber);
       expect(response.ok).toBe(true);
   });

   it('should throw error if fetch call fails', async()=> {
        const mockTokens = {token: 'valid_token' };
         (fetch as jest.Mock).mockRejectedValue(new Error('unable to make a fetch call'));
        (getTokens as jest.Mock).mockResolvedValue(mockTokens);
        await expect(
            unblockUserChat(senderMobileNumber, receiverMobileNumber),
        ).rejects.toThrow('Error while unblocking chat');
   });
});
