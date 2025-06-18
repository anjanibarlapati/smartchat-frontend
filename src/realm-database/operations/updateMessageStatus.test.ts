import { MessageStatus } from '../../types/message';
import { getRealmInstance } from '../connection';
import { updateMessageStatusInRealm } from './updateMessageStatus';

jest.mock('../connection', () => ({
  getRealmInstance: jest.fn(),
}));

describe('updateMessageStatusInRealm', () => {
  const mockWrite = jest.fn((fn) => fn());
  const mockFiltered = jest.fn();
  const mockSorted = jest.fn();

  const mockMessages: any[] = [];

  const chatId = '8639523822';
  const status = MessageStatus.SEEN;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMessages.length = 0;

    mockSorted.mockImplementation(() => mockMessages);
    mockFiltered.mockReturnValue({
      sorted: mockSorted,
    });

    (getRealmInstance as jest.Mock).mockReturnValue({
      write: mockWrite,
      objects: jest.fn().mockReturnValue({
        filtered: mockFiltered,
      }),
    });
  });

  it('should update status of matching messages if messageIds are given and isSender is true', async () => {
    const m1 = { sentAt: '1', status: MessageStatus.SENT, isSender: true };
    const m2 = { sentAt: '2', status: MessageStatus.DELIVERED, isSender: true };
    const m3 = { sentAt: '3', status: MessageStatus.SEEN, isSender: true };

    mockMessages.push(m1, m2, m3);
    const messageIds = ['1', '2', '3'];

    await updateMessageStatusInRealm({ chatId, status, messageIds });

    expect(m1.status).toBe(MessageStatus.SEEN);
    expect(m2.status).toBe(MessageStatus.SEEN);
    expect(m3.status).toBe(MessageStatus.SEEN);
  });

  it('should skip updating if message.isSender is false for messageIds', async () => {
    const m1 = { sentAt: '1', status: MessageStatus.SENT, isSender: false };
    const m2 = { sentAt: '2', status: MessageStatus.SENT, isSender: true };

    mockMessages.push(m1, m2);
    const messageIds = ['1', '2'];

    await updateMessageStatusInRealm({ chatId, status, messageIds });

    expect(m1.status).toBe(MessageStatus.SENT);
    expect(m2.status).toBe(MessageStatus.SEEN);
  });

  it('should update all received messages (isSender === false) if no messageIds are given', async () => {
    const m1 = { sentAt: '1', status: MessageStatus.SENT, isSender: false };
    const m2 = { sentAt: '2', status: MessageStatus.DELIVERED, isSender: false };
    const m3 = { sentAt: '3', status: MessageStatus.SEEN, isSender: false };

    mockMessages.push(m1, m2, m3);

    await updateMessageStatusInRealm({ chatId, status });

    expect(m1.status).toBe(MessageStatus.SEEN);
    expect(m2.status).toBe(MessageStatus.SEEN);
    expect(m3.status).toBe(MessageStatus.SEEN);
  });

  it('should not update status if current status is equal or higher than new status', async () => {
    const m1 = { sentAt: '1', status: MessageStatus.SEEN, isSender: true };

    mockMessages.push(m1);

    await updateMessageStatusInRealm({ chatId, status, messageIds: ['1'] });

    expect(m1.status).toBe(MessageStatus.SEEN);
  });

  it('should stop processing on first message with equal or higher status', async () => {
    const m1 = { sentAt: '1', status: MessageStatus.SENT, isSender: true };
    const m2 = { sentAt: '2', status: MessageStatus.SEEN, isSender: true };
    const m3 = { sentAt: '3', status: MessageStatus.SENT, isSender: true };

    mockMessages.push(m1, m2, m3);

    await updateMessageStatusInRealm({ chatId, status, messageIds: ['1', '2', '3'] });

    expect(m1.status).toBe(MessageStatus.SEEN);
    expect(m2.status).toBe(MessageStatus.SEEN);
    expect(m3.status).toBe(MessageStatus.SENT);
  });

  it('should catch and log errors during realm write', async () => {
    const error = new Error('write failed');
    (getRealmInstance as jest.Mock).mockReturnValue({
      write: () => {
        throw error;
      },
      objects: jest.fn(),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateMessageStatusInRealm({ chatId, status });

    expect(consoleSpy).toHaveBeenCalledWith('Error while updating message status:', error);
    consoleSpy.mockRestore();
  });
});
