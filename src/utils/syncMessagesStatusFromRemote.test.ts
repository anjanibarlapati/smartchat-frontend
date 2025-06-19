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

describe('syncMessagesStatusFromRemote', () => {
  const mockWrite = jest.fn((fn) => fn());
  const mockFiltered = jest.fn();
  const mockMessages: any[] = [];
  const mockObjects = jest.fn();

  let realm: any;
  const senderMobileNumber = '+91 63039 74914';

  beforeEach(() => {
    jest.clearAllMocks();
    mockMessages.length = 0;

    mockFiltered.mockReturnValue(mockMessages);
    mockObjects.mockImplementation(() => ({
      filtered: mockFiltered,
    }));

    realm = {
      write: mockWrite,
      objects: jest.fn().mockReturnValue({ filtered: mockFiltered }),
    };
  });

  it('should return early if there are no sent messages', async () => {
    mockFiltered.mockReturnValue([]);
    await syncMessagesStatusFromRemote(senderMobileNumber, realm);
    expect(getTokens).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should return early if tokens are not available', async () => {
    mockMessages.push({ sentAt: '2025-06-01T12:00:00Z' });
    (getTokens as jest.Mock).mockResolvedValue(null);

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);
    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should fetch status updates and update realm if response is ok', async () => {
    mockMessages.push({ sentAt: '2025-06-01T12:00:00Z', status: MessageStatus.SENT });

    const updatedStatus = MessageStatus.SEEN;
    const updatedSentAt = '2025-06-01T12:00:00Z';
    const responseJson = {
      messagesToUpdate: [{ sentAt: updatedSentAt, status: updatedStatus }],
    };

    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(responseJson),
    });

    const messageToUpdate = {
      sentAt: updatedSentAt,
      status: MessageStatus.SENT,
    };
    mockFiltered.mockReturnValue([messageToUpdate]);

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('user/messages/status'),
      expect.objectContaining({ method: 'POST' })
    );

    expect(messageToUpdate.status).toBe(updatedStatus);
    expect(mockWrite).toHaveBeenCalled();
  });

    it('should fetch successfully and update message status in realm', async () => {
    const updatedStatus = MessageStatus.SEEN;
    const updatedSentAt = '2025-06-01T12:00:00Z';

    const messageToUpdate = {
        sentAt: updatedSentAt,
        status: MessageStatus.SENT,
    };

    mockFiltered.mockReturnValue([messageToUpdate]);

    realm = {
        write: mockWrite,
        objects: jest.fn().mockReturnValue({ filtered: mockFiltered }),
    };

    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });

    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
        messagesToUpdate: [
            { sentAt: updatedSentAt, status: updatedStatus },
        ],
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
        }),
    );

    expect(realm.objects).toHaveBeenCalledWith('Message');
    expect(mockFiltered).toHaveBeenCalledWith(
        'status == $0 AND isSender == true',
        MessageStatus.SENT
    );

    expect(mockWrite).toHaveBeenCalled();
    expect(messageToUpdate.status).toBe(updatedStatus);
    });
    it('should not update realm if response.ok is false', async () => {
    const sentMessage = {
        sentAt: '2025-06-01T12:00:00Z',
        status: MessageStatus.SENT,
    };
    mockFiltered.mockReturnValue([sentMessage]);
    realm = {
        write: mockWrite,
        objects: jest.fn().mockReturnValue({ filtered: mockFiltered }),
    };
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn(),
    });

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);
    expect(getTokens).toHaveBeenCalledWith(senderMobileNumber);
    expect(fetch).toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();
    });

  it('should handle errors correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockMessages.push({ sentAt: '2025-06-01T12:00:00Z' });
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    await syncMessagesStatusFromRemote(senderMobileNumber, realm);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to sync messages status:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
