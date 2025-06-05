import {MessageToSend} from './storePendingMessages';
import {unsendMessages} from './unsendMessages';

global.fetch = jest.fn();

describe('Check for unsendMessages backend fetch call', () => {
  const senderMobileNumber = '+91 63039 74914';
  const messages: MessageToSend[] = [
    {
      receiverMobileNumber: '+91 95021 47010',
      message: 'Hiiioooo',
      nonce: 'w2mqEigZ7FnjUHhoKXy431aFNfQxB-IO',
      sentAt: '2025-06-02T02:54:27.329+00:00',
    },
    {
      receiverMobileNumber: '+91 63039 61097',
      message: 'Hiii',
      nonce: 'w2mqEigZ7FnjUHhoKXy431aFNfQxB-IO',
      sentAt: '2025-06-02T02:54:27.329+00:00',
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should call fetch request with correct arguments and handles response OK', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({message: 'Successfully updated message'}),
    });
    await unsendMessages(senderMobileNumber, messages);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/unsendMessages'),
      expect.objectContaining({
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({senderMobileNumber, messages}),
      }),
    );
  });
  it('Should throw error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(unsendMessages(senderMobileNumber, messages)).rejects.toThrow(
      'Unable to sync messages',
    );
  });
  it('Should do nothing when response.ok is false', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await unsendMessages(senderMobileNumber, messages);
  });
});
