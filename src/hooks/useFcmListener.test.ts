import { renderHook, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { messaging } from '../utils/fcmService';
import { getTokens } from '../utils/getTokens';
import { decryptMessage } from '../utils/decryptMessage';
import { sendLocalNotification } from '../utils/localNotifications';
import { useFCMListener } from './useFcmListener';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../redux/store', () => ({
  store: {
    getState: jest.fn(() => ({
      activeChat: {
        currentChatMobileNumber: '9999999999',
      },
    })),
  },
}));

jest.mock('../utils/getTokens', () => ({
  getTokens: jest.fn(),
}));

jest.mock('../utils/decryptMessage', () => ({
  decryptMessage: jest.fn(),
}));

jest.mock('../utils/localNotifications', () => ({
  sendLocalNotification: jest.fn(),
}));

const mockContact = {
  name: 'Alice',
  mobileNumber: '1234567890',
};

jest.mock('../contexts/RealmContext', () => ({
  useQuery: () => ({
    filtered: (_query: string, mobile: string) =>
      mobile === '1234567890' ? [mockContact] : [],
  }),
}));

jest.mock('../utils/fcmService', () => ({
  messaging: {
    onMessage: jest.fn(),
  },
}));

describe('Tests related to the useFcmListener hook', () => {
  let unsubscribeFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    unsubscribeFn = jest.fn();
  });

  it('Should handle and display incoming FCM message when not in active chat', async () => {
    const mockRemoteMessage = {
      data: {
        sender: '1234567890',
        nonce: 'nonce',
        profilePic: 'pic_url',
        message: 'encrypted_message',
      },
      notification: {
        body: 'encrypted message',
      },
    };

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ mobileNumber: '9999999999' })
    );
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'fake_token' });
    (decryptMessage as jest.Mock).mockResolvedValue('Decrypted Message');

    (messaging.onMessage as jest.Mock).mockImplementation((cb) => {
      setTimeout(() => cb(mockRemoteMessage), 0);
      return unsubscribeFn;
    });

    const { unmount } = renderHook(() => useFCMListener());

    await waitFor(() => {
      expect(sendLocalNotification).toHaveBeenCalledWith(
        'Alice',
        'Decrypted Message',
        'pic_url'
      );
    });

    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });

  it('Should not send notification if user is in active chat with sender', async () => {
    const store = require('../redux/store').store;
    store.getState.mockReturnValue({
      activeChat: { currentChatMobileNumber: '1234567890' },
    });

    const mockRemoteMessage = {
      data: {
        sender: '1234567890',
      },
      notification: {
        body: 'Encrypted',
      },
    };

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ mobileNumber: '9999999999' })
    );

    (messaging.onMessage as jest.Mock).mockImplementation((cb) => {
      setTimeout(() => cb(mockRemoteMessage), 0);
      return unsubscribeFn;
    });

    const { unmount } = renderHook(() => useFCMListener());

    await waitFor(() => {
      expect(sendLocalNotification).not.toHaveBeenCalled();
    });

    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });

  it('Should return early if user data is not found in storage', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    (messaging.onMessage as jest.Mock).mockImplementation((cb) => {
      setTimeout(() => cb({
        data: { sender: '1234567890' },
        notification: { body: 'Encrypted' },
      }), 0);
      return unsubscribeFn;
    });

    const { unmount } = renderHook(() => useFCMListener());

    await waitFor(() => {
      expect(sendLocalNotification).not.toHaveBeenCalled();
    });

    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });

  it('Should fallback to sender number if contact is not found', async () => {
    const mockRemoteMessage = {
      data: {
        sender: '0987654321',
        nonce: 'nonce',
        profilePic: 'pic_url',
        message: 'encrypted_message',
      },
      notification: {
        body: 'encrypted message',
      },
    };

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ mobileNumber: '9999999999' })
    );
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'token' });
    (decryptMessage as jest.Mock).mockResolvedValue('Decrypted Fallback');

    (messaging.onMessage as jest.Mock).mockImplementation((cb) => {
      setTimeout(() => cb(mockRemoteMessage), 0);
      return unsubscribeFn;
    });

    const { unmount } = renderHook(() => useFCMListener());

    await waitFor(() => {
      expect(sendLocalNotification).toHaveBeenCalledWith(
        '0987654321',
        'Decrypted Fallback',
        'pic_url'
      );
    });

    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });
});
