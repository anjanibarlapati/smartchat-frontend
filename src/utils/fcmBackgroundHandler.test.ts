import { HandleIncomingFCM } from './fcmBackgroundHandler';
import { handleIncomingMessageNotification } from './handleIncomingNotification';

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('./fcmService', () => ({
  messaging: {
    setBackgroundMessageHandler: jest.fn(),
  },
}));

jest.mock('./handleIncomingNotification', () => ({
  handleIncomingMessageNotification: jest.fn(),
}));

describe('Tests related to the background notifications', () => {
  const mockRemoteMessage = {
    data: {
      sender: 'varun',
      message: 'message',
      nonce: 'nonce',
      profilePic: 'my-image-s3-bucker.com',
    },
  } as any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should call handleIncomingMessageNotification with correct data from remoteMessage', async () => {
    await HandleIncomingFCM(mockRemoteMessage);
    expect(handleIncomingMessageNotification).toHaveBeenCalledWith({
      sender: 'varun',
      message: 'message',
      nonce: 'nonce',
      profilePic: 'my-image-s3-bucker.com',
      from: 'background',
    });
  });

  it('Should handle error if handleIncomingMessageNotification throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (handleIncomingMessageNotification as jest.Mock).mockRejectedValueOnce(new Error('Error occurred'));
    await HandleIncomingFCM(mockRemoteMessage);
    expect(consoleSpy).toHaveBeenCalledWith(
      'FCM background handler error:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
