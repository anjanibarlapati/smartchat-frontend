import { getUserMessages } from './getUserMessages';

global.fetch = jest.fn();

describe('test getUserMessages API request service', () => {
  const mockMobileNumber = '+91 99999 00001';
  const mockToken = 'access-token';

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should call fetch with correct URL and headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await getUserMessages(mockMobileNumber, mockToken);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('user/messages'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${mockToken}`,
      },
      body: JSON.stringify({ mobileNumber: mockMobileNumber }),
    });
     expect(response).toBe(mockResponse);
  });
});
