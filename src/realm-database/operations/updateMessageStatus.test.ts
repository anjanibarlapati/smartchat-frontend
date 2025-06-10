import { getRealmInstance } from '../connection';
import { updateMessageStatusInRealm } from './updateMessageStatus';

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('../connection', () => ({
  getRealmInstance: jest.fn(),
}));

describe('updateMessageStatusInRealm', () => {
  const mockWrite = jest.fn((fn) => fn());
  const mockFiltered = jest.fn();
  const mockSorted = jest.fn();

  const mockMessages: any[] = [];

  const chatId = '8639523822';
  const sentAt = '2025-06-03T00:00:00Z';
  const status = 'seen';

  beforeEach(() => {
    jest.clearAllMocks();

    mockMessages.length = 0;

    mockSorted.mockImplementation(() => mockMessages);

    mockFiltered.mockImplementation(() => ({
      sorted: mockSorted,
    }));

    (getRealmInstance as jest.Mock).mockReturnValue({
      write: mockWrite,
      objects: jest.fn().mockReturnValue({
        filtered: mockFiltered,
      }),
    });
  });

  it('should update a single message status if found', async () => {
    const message = { sentAt, status: 'sent' };
    mockMessages.push(message);

    const filteredForSentAt = jest.fn().mockReturnValue([message]);
    mockSorted.mockReturnValue({
      filtered: filteredForSentAt,
    });

    await updateMessageStatusInRealm({ chatId, sentAt, status });

    expect(getRealmInstance).toHaveBeenCalled();
    expect(mockWrite).toHaveBeenCalled();
    expect(message.status).toBe(status);

    expect(mockFiltered).toHaveBeenCalledWith('chat.chatId == $0', chatId);
    expect(mockSorted).toHaveBeenCalledWith('sentAt');
    expect(filteredForSentAt).toHaveBeenCalledWith('sentAt == $0', sentAt);
  });

  it('should not update if the specific message is not found', async () => {
    const filteredForSentAt = jest.fn().mockReturnValue([]);
    mockSorted.mockReturnValue({
      filtered: filteredForSentAt,
    });

    await updateMessageStatusInRealm({ chatId, sentAt, status });

    expect(getRealmInstance).toHaveBeenCalled();
    expect(mockWrite).toHaveBeenCalled();

    expect(mockFiltered).toHaveBeenCalledWith('chat.chatId == $0', chatId);
    expect(mockSorted).toHaveBeenCalledWith('sentAt');
    expect(filteredForSentAt).toHaveBeenCalledWith('sentAt == $0', sentAt);
  });

  it('should update messages sent in socket payload before sentAt if updateAllBeforeSentAt is true for sender', async () => {
    const message1 = { sentAt: '2025-05-30T00:00:00Z', status: 'sent' };
    const message2 = { sentAt: '2025-06-01T00:00:00Z', status: 'delivered' };
    const newer = { sentAt: '2025-06-02T00:00:00Z', status: 'sent' };

    const messageIds = [message1.sentAt, message2.sentAt, newer.sentAt];

    mockMessages.push(message1, message2, newer);

    await updateMessageStatusInRealm({ chatId, sentAt, status, updateAllBeforeSentAt: true, messageIds: messageIds });

    expect(message1.status).toBe(status);
    expect(message2.status).toBe(status);
    expect(newer.status).toBe('seen');
  });

   it('should not update status if it is blocked message', async () => {
    const message1 = { sentAt: '2025-05-30T00:00:00Z', status: 'sent' };
    const message2 = { sentAt: '2025-06-01T00:00:00Z', status: 'delivered' };
    const newer = { sentAt: '2025-06-02T00:00:00Z', status: 'sent', isSender: false};
    mockMessages.push(message1, message2);
     const messageIdss = [message1.sentAt, message2.sentAt];
    await updateMessageStatusInRealm({ chatId, sentAt, status, updateAllBeforeSentAt: true, messageIds: messageIdss });
    expect(message1.status).toBe(status);
    expect(message2.status).toBe(status);
    expect(newer.status).toBe('sent');
  });

    it('should not update any message sent in socket payload before sentAt if updateAllBeforeSentAt is true for sender', async () => {
    const message1 = { sentAt: '2025-05-30T00:00:00Z', status: 'sent' };
    const message2 = { sentAt: '2025-06-01T00:00:00Z', status: 'delivered' };
    const newer = { sentAt: '2025-06-02T00:00:00Z', status: 'sent' };

    const messageIds = [message1.sentAt, message2.sentAt, newer.sentAt];

    mockMessages.push(message1, message2, newer);

    await updateMessageStatusInRealm({ chatId, sentAt, status, updateAllBeforeSentAt: true, messageIds: messageIds });

    expect(message1.status).toBe(status);
    expect(message2.status).toBe(status);
    expect(newer.status).toBe('seen');
  });

  it('should update all messages if all messages are seen already', async () => {
    const message1 = { sentAt: '2025-05-30T00:00:00Z', status: 'seen', isSender: false };
    const message2 = { sentAt: '2025-06-01T00:00:00Z', status: 'seen', isSender: false };
    const newer = { sentAt: '2025-06-02T00:00:00Z', status: 'seen', isSender: false };
    mockMessages.push(message1, message2, newer);
    await updateMessageStatusInRealm({ chatId, sentAt, status, updateAllBeforeSentAt: true });
    expect(message1.status).toBe(status);

  });
  it('should catch and log errors thrown during realm.write', async () => {
    const error = new Error('Write failed');
    (getRealmInstance as jest.Mock).mockReturnValue({
      write: jest.fn(() => {
        throw error;
      }),
      objects: jest.fn(),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateMessageStatusInRealm({ chatId, sentAt, status });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error while updating message status:', error);

    consoleErrorSpy.mockRestore();
  });
});
