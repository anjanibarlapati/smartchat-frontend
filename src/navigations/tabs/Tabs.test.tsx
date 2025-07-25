import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { Tabs } from './Tabs';
import { store } from '../../redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { syncContacts } from '../../utils/syncContacts';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
  },
  AndroidImportance: { HIGH: 'high' },
  TriggerType: { TIMESTAMP: 'timestamp' },
}));

jest.mock('../../utils/syncContacts', ()=>({
  syncContacts: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));
jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  clean: jest.fn(),
}));
jest.mock('react-native-libsodium', () => ({
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
}));

jest.mock('@realm/react', () => {
  const actual = jest.requireActual('@realm/react');

  return {
    ...actual,
    createRealmContext: () => ({
      RealmProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      useRealm: () => ({}),
      useQuery: () => [],
    }),
  };
});

export const renderWithProviders = (ui: ReactElement) =>
  render(
    <Provider store={store}>
      <RealmProvider>
        <NavigationContainer>{ui}</NavigationContainer>
      </RealmProvider>
    </Provider>
  );

jest.mock('../../hooks/unreadChatsCount', () => ({
  useUnreadChatsCount: jest.fn(),
}));

jest.mock('../../hooks/unreadChats', () => ({
  useUnreadChats: jest.fn(() => [
    {
      contact: {
        mobileNumber: '1234567890',
        name: 'Test Contact',
        originalNumber: '1234567890',
        profilePicture: null,
      },
      lastMessage: {
        message: 'Test message',
        sentAt: new Date(),
        isSender: false,
        status: 'sent',
      },
      unreadCount: 2,
    },
  ]),
}));


const mockUseUnreadChatsCount = require('../../hooks/unreadChatsCount').useUnreadChatsCount;

describe('Tabs Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(message => {
      if (
        typeof message === 'string' &&
        message.includes("The action 'RESET' with payload")
      ) {
        return;
      }
      console.error(message);
    });
  });

  it('should show unread badge when there are unread chats', () => {
    mockUseUnreadChatsCount.mockReturnValue(3);
    const { getAllByLabelText } = renderWithProviders(<Tabs />);
    expect(getAllByLabelText('badge').length).toBeGreaterThan(0);
  });

  it('should not show unread badge when there are no unread chats', () => {
    mockUseUnreadChatsCount.mockReturnValue(0);
    const { queryByLabelText } = renderWithProviders(<Tabs />);
    expect(queryByLabelText('badge')).toBeNull();
  });

  it('renders All Chats, Unread, and Profile tabs', () => {
    mockUseUnreadChatsCount.mockReturnValue(0);
    const { getAllByText } = renderWithProviders(<Tabs />);
    expect(getAllByText('All Chats').length).toBeGreaterThan(0);
    expect(getAllByText('Unread').length).toBeGreaterThan(0);
    expect(getAllByText('Profile').length).toBeGreaterThan(0);
  });
    it('Should render unread tab content after clicking Unread', async () => {
    const {getAllByText, findAllByText} = renderWithProviders(<Tabs />);
    const unreadTab = getAllByText('Unread');
    fireEvent.press(unreadTab[0]);
    const unreadLabel = await findAllByText(/Unread/i);
    expect(unreadLabel.length).toBeGreaterThan(0);
  });

  it('Should render Profile tab content after clicking Profile', async () => {
    const {getAllByText, findAllByText} = renderWithProviders(<Tabs />);

    const profileTab = getAllByText('Profile');
    fireEvent.press(profileTab[0]);

    const profileLabel = await findAllByText(/Profile/i);
    expect(profileLabel.length).toBeGreaterThan(0);
  });

  it('should render CustomAlert when sync contacts throws error', async () => {
    (syncContacts as jest.Mock).mockRejectedValue(new Error(''));
    mockUseUnreadChatsCount.mockReturnValue(0);

    const { getByText } = renderWithProviders(<Tabs />);
    await waitFor(() => {
      expect(getByText('Failed to sync contacts')).toBeTruthy();
    });
  });

  it('should show alert if contact permission denied', async () => {
    (syncContacts as jest.Mock).mockResolvedValue(false);
    const { getByText } = renderWithProviders(<Tabs />);
    await waitFor(() => {
      expect(getByText('Permission for contacts was denied')).toBeTruthy();
    });
  });

});
