import Realm from 'realm';
import { Message } from '../../types/message';
import { addNewMessageInRealm } from './addNewMessage';

jest.mock('realm', () => {
  return {
    BSON: {
      ObjectId: jest.fn(() => 'mocked-object-id'),
    },
  };
});

describe('Add new message in realm db', () => {
  let mockRealm: Partial<Realm>;
  const mockWrite = jest.fn(fn => fn());
  const mockObjectForPrimaryKey = jest.fn();
  const mockCreate = jest.fn();

  const message: Message = {
    message: 'Hello Anjani',
    sentAt: new Date().toISOString(),
    isSender: true,
    status: 'sent',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      write: mockWrite,
      objectForPrimaryKey: mockObjectForPrimaryKey,
      create: mockCreate,
    };
  });

  it('should create a new chat if it does not exist', () => {
    mockObjectForPrimaryKey.mockReturnValue(null);
    const mockChat = { chatId: '8639523822', isBlocked: false, publicKey: null };
    mockCreate.mockImplementation((model, data) => {
      if (model === 'Chat') {
        return mockChat;
      }
      return data;
    });

    addNewMessageInRealm(mockRealm as Realm, '8639523822', message);

    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', '8639523822');
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith('Chat', {
      chatId: '8639523822',
      isBlocked: false,
      publicKey: null,
    });


    expect(mockCreate).toHaveBeenCalledWith('Message', expect.objectContaining({
    message: message.message,
    sentAt: message.sentAt,
    isSender: true,
    status: 'sent',
    chat: mockChat,
    }));
  });

  it('should use existing chat if found', () => {
    const existingChat = { chatId: '8639523822' };
    mockObjectForPrimaryKey.mockReturnValue(existingChat);

    addNewMessageInRealm(mockRealm as Realm, '8639523822', message);
    expect(mockCreate).toHaveBeenCalledWith('Message', expect.objectContaining({
      chat: existingChat,
    }));
  });
});
