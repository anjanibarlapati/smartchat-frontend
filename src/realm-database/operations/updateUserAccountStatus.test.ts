import { updateUserAccountStatusInRealm } from './updateUserAccountStatus';
import { getRealmInstance } from '../connection';

jest.mock('../connection', () => ({
  getRealmInstance: jest.fn(),
}));

describe('updateUserAccountStatusInRealm', () => {
  const mockWrite = jest.fn((fn) => fn());
  const mockObjectForPrimaryKey = jest.fn();

  const chatId = '8639523822';

  beforeEach(() => {
    jest.clearAllMocks();

    (getRealmInstance as jest.Mock).mockResolvedValue({
      write: mockWrite,
      objectForPrimaryKey: mockObjectForPrimaryKey,
    });
  });

  it('should update isAccountDeleted to true if chat exists', async () => {
    const mockChat = { chatId, isAccountDeleted: false };
    mockObjectForPrimaryKey.mockReturnValue(mockChat);

    await updateUserAccountStatusInRealm(chatId, true);

    expect(getRealmInstance).toHaveBeenCalled();
    expect(mockWrite).toHaveBeenCalled();
    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', chatId);
    expect(mockChat.isAccountDeleted).toBe(true);
  });

  it('should update isAccountDeleted to false if chat exists', async () => {
    const mockChat = { chatId, isAccountDeleted: true };
    mockObjectForPrimaryKey.mockReturnValue(mockChat);

    await updateUserAccountStatusInRealm(chatId, false);

    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', chatId);
    expect(mockChat.isAccountDeleted).toBe(false);
  });

  it('should do nothing if chat does not exist', async () => {
    mockObjectForPrimaryKey.mockReturnValue(null);

    await updateUserAccountStatusInRealm(chatId, true);

    expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', chatId);
    expect(mockWrite).toHaveBeenCalled();
  });

  it('should console error that were thrown to catch block', async () => {
    const error = new Error('Error');

    (getRealmInstance as jest.Mock).mockResolvedValue({
      write: jest.fn(() => {
        throw error;
      }),
      objectForPrimaryKey: mockObjectForPrimaryKey,
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateUserAccountStatusInRealm(chatId, true);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error while updating message status:', error);

    consoleErrorSpy.mockRestore();
  });
});
