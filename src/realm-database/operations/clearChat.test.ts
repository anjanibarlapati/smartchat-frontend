import Realm from 'realm';
import { clearChatInRealm } from './clearChat';

jest.mock('realm');

describe('Clear chat in realm db', () => {

  const mockMessages = {
    '8639523822': [
        {
            message: 'Anjani',
            sentAt: '2023-01-01T00:00:00Z',
            isSender: true,
            status: 'sent',
        },
    ],
  };
  let mockRealm: Partial<Realm>;
  const mockWrite = jest.fn(fn => fn());
  const mockFiltered = jest.fn().mockReturnValue(mockMessages);
  const mockDelete = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      write: mockWrite,
      objects: jest.fn().mockImplementation(() => ({
        filtered: mockFiltered,
      })),
      delete: mockDelete,
    };
  });

  it('should clear the chat messages of given chatId', () => {
    mockDelete.mockReturnValue(null);
    mockFiltered.mockReturnValue(mockMessages);

    clearChatInRealm(mockRealm as Realm, '8639523822');

    expect(mockRealm.objects).toHaveBeenCalledWith('Message');
    expect(mockFiltered).toHaveBeenCalledWith('chat.chatId == $0', '8639523822');
    expect(mockDelete).toHaveBeenCalledWith(mockMessages);
  });
});
