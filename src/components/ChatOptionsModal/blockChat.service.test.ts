// import {BASE_URL} from '../../utils/constants';
import {getTokens} from '../../utils/getTokens';
import {blockUserChat} from './blockChat.service';

global.fetch = jest.fn();

jest.mock('../../utils/getTokens');
jest.mock('../../utils/encryptMessage');

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));
jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

describe('blockUserChat', () => {
  const senderMobileNumber = '+91 8639523822';
  const receiverMobileNumber = '+91 9951534919';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should call fetch when blcokUser function called', async () => {
 const mockTokens = { access_token: 'valid_token' };
      (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
      (getTokens as jest.Mock).mockResolvedValue(mockTokens);
       await blockUserChat({senderMobileNumber, receiverMobileNumber});
        expect(fetch).toHaveBeenCalled();

  });

  it('should handle fetch failure', async () => {
    (getTokens as jest.Mock).mockResolvedValue({access_token: 'valid_token'});
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(
      blockUserChat({senderMobileNumber, receiverMobileNumber}),
    ).rejects.toThrow('Network error');
  });
});
