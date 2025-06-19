import { MessageStatus } from '../types/message';
import { getTokens } from './getTokens';
import { syncMessagesStatusFromRemote } from './syncMessagesStatusFromRemote';

global.fetch = jest.fn();

jest.mock('./getTokens');
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Sync Messages Status From Remote', () => {
  const senderMobileNumber = '+91 63039 74914';
  const mockWrite = jest.fn(fn => fn());
  const mockFiltered = jest.fn();
  const mockObjects = jest.fn().mockReturnValue({ filtered: mockFiltered });

  let realm: any;

  beforeEach(() => {
    jest.clearAllMocks();

    realm = {
      write: mockWrite,
      objects: mockObjects,
    };
  });

  it('should return early if there are no messages to sync', async () => {
    mockFiltered.mockReturnValue([]);

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(getTokens).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should return early if token fetch fails', async () => {
    const localMessages = [{ sentAt: '2025-06-01T12:00:00Z', status: MessageStatus.SENT }];
    mockFiltered.mockReturnValue(localMessages);
    (getTokens as jest.Mock).mockResolvedValue(null);

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should not update if response.ok is false', async () => {
    const localMessages = [{ sentAt: '2025-06-01T12:00:00Z', status: MessageStatus.SENT }];
    mockFiltered.mockReturnValue(localMessages);

    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(fetch).toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('should update message status in Realm on successful response', async () => {
    const updatedStatus = MessageStatus.SEEN;
    const updatedSentAt = '2025-06-01T12:00:00Z';

    const messageToUpdate = {
      sentAt: updatedSentAt,
      status: MessageStatus.SENT,
    };

    mockFiltered.mockImplementation(query => {
      if (query === 'status IN { $0, $1 } AND isSender == true') {
        return [messageToUpdate];
      } else if (query === 'sentAt == $0') {
        return [messageToUpdate];
      }
      return [];
    });

    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        messagesToUpdate: [{ sentAt: updatedSentAt, status: updatedStatus }],
      }),
    });

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('user/messages/status'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'smart-chat-token-header-key': 'Bearer mock-token',
        }),
        body: expect.stringContaining(updatedSentAt),
      }),
    );

    expect(mockWrite).toHaveBeenCalled();
    expect(messageToUpdate.status).toBe(updatedStatus);
  });

  it('should handle fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const localMessages = [{ sentAt: '2025-06-01T12:00:00Z', status: MessageStatus.SENT }];
    mockFiltered.mockReturnValue(localMessages);

    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to sync messages status:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
