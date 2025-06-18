import EncryptedStorage from 'react-native-encrypted-storage';
import { getRealmInstance } from '../realm-database/connection';
import { store } from '../redux/store';
import { decryptMessage } from '../utils/decryptMessage';
import { getTokens } from '../utils/getTokens';
import { handleIncomingMessageNotification } from '../utils/handleIncomingNotification';
import { sendLocalNotification } from '../utils/localNotifications';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../realm-database/connection', () => ({
  getRealmInstance: jest.fn(),
}));

jest.mock('../utils/decryptMessage', () => ({
  decryptMessage: jest.fn(),
}));

jest.mock('../utils/getTokens', () => ({
  getTokens: jest.fn(),
}));

jest.mock('../utils/localNotifications', () => ({
  sendLocalNotification: jest.fn(),
}));

jest.mock('../redux/store', () => ({
  store: {
    getState: jest.fn(),
  },
}));

const mockRealm = {
  objects: jest.fn(),
};

describe('Tests related to the handleIncomingMessageNotification method', () => {
  const mockSender = '9393939393';
  const mockMessage = 'Encrypted_Message';
  const mockNonce = 'nonce';
  const mockProfilePic = 'https://example.com/profile.jpg';
  const mockUserData = {
    mobileNumber: '6303522765',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUserData));
    (getRealmInstance as jest.Mock).mockReturnValue(mockRealm);
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'EVEREST_TOKEN' });
    (decryptMessage as jest.Mock).mockResolvedValue('Hey Man!');
    (store.getState as jest.Mock).mockReturnValue({
      activeChat: {
        currentChatMobileNumber: '',
      },
    });
  });

  it('Should do nothing if the user data is not available', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
    await handleIncomingMessageNotification({
      sender: mockSender,
      message: mockMessage,
      nonce: mockNonce,
      from: 'background',
    });
    expect(decryptMessage).not.toHaveBeenCalled();
    expect(sendLocalNotification).not.toHaveBeenCalled();
  });

  it('Should skip notification if user is actively chatting with sender which was triggered from socket event', async () => {
    (store.getState as jest.Mock).mockReturnValue({
      activeChat: {
        currentChatMobileNumber: mockSender,
      },
    });
    await handleIncomingMessageNotification({
      sender: mockSender,
      message: mockMessage,
      nonce: mockNonce,
      from: 'socket',
    });
    expect(decryptMessage).not.toHaveBeenCalled();
    expect(sendLocalNotification).not.toHaveBeenCalled();
  });

  it('Should decrypt message and send notification if all conditions are met', async () => {
    mockRealm.objects.mockReturnValue({
      filtered: jest.fn().mockReturnValue([
        {
          name: 'Varun',
          mobileNumber: mockSender,
        },
      ]),
    });
    await handleIncomingMessageNotification({
      sender: mockSender,
      message: mockMessage,
      nonce: mockNonce,
      profilePic: mockProfilePic,
      from: 'background',
    });
    expect(getTokens).toHaveBeenCalledWith(mockUserData.mobileNumber);
    expect(decryptMessage).toHaveBeenCalledWith(
      mockSender,
      mockMessage,
      mockNonce,
      'EVEREST_TOKEN',
      mockRealm
    );
    expect(sendLocalNotification).toHaveBeenCalledWith(
      'Varun',
      'Hey Man!',
      mockProfilePic
    );
  });

  it('Should show sender number if contact name not found', async () => {
    mockRealm.objects.mockReturnValue({
      filtered: jest.fn().mockReturnValue([]),
    });
    await handleIncomingMessageNotification({
      sender: mockSender,
      message: mockMessage,
      nonce: mockNonce,
      from: 'background',
    });
    expect(sendLocalNotification).toHaveBeenCalled();
  });

  it('Should handle the errors if any error occurred', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
    await handleIncomingMessageNotification({
      sender: mockSender,
      message: mockMessage,
      nonce: mockNonce,
      from: 'background',
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in handleIncomingMessageNotification:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
