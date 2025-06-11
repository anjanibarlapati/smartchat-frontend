import Realm from 'realm';
import { Messages, MessageStatus } from '../../types/message';
import { storeChats } from './storeChats';

jest.mock('realm', () => {
  return {
    BSON: {
      ObjectId: jest.fn(() => 'mocked-object-id'),
    },
  };
});


describe('Add chats with their message in realm db', () => {
  let mockRealm: Partial<Realm>;
  const mockWrite = jest.fn(fn => fn());
  const mockObjectForPrimaryKey = jest.fn();
  const mockCreate = jest.fn();
  const mockMessages: Messages = {
    '8639523822': [
        {
            message: 'Anjani',
            sentAt: '2025-06-01T00:00:00Z',
            isSender: true,
            status: MessageStatus.SENT,
        },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      write: mockWrite,
      objectForPrimaryKey: mockObjectForPrimaryKey,
      create: mockCreate,
    };
  });


  it('Should create chats if they do not exist and store messages', () => {
    mockObjectForPrimaryKey.mockReturnValue(null);

    storeChats(mockRealm as Realm, mockMessages);
    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', '8639523822');
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith('Chat', {
      chatId: '8639523822',
      isBlocked: false,
      publicKey: null,
    });

   expect(mockCreate).toHaveBeenCalledWith('Message', expect.objectContaining({
      message: 'Anjani',
      isSender: true,
      status: MessageStatus.SENT,
    }));
  });
    it('Should not create a chat if it already exists and store messages', () => {
    const existingChat = { chatId: '8639523822' };
    mockObjectForPrimaryKey.mockReturnValue(existingChat);

    storeChats(mockRealm as Realm, mockMessages);
    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', '8639523822');
    expect(mockCreate).not.toHaveBeenCalledWith('Chat', expect.anything());
    expect(mockCreate).toHaveBeenCalledWith('Message', expect.objectContaining({
      message: 'Anjani',
      isSender: true,
      status: MessageStatus.SENT,
    }));
  });

});
