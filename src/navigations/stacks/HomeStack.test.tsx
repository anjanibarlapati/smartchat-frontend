import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { HomeStack } from './HomeStack';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('../../screens/Unread/Unread', () => {
  const {Text, View} = require('react-native');
  return {
    Unread: () => (
      <View>
        <Text>Unread</Text>
        <Text>No unread chats here</Text> <Text>View all chats</Text>
      </View>
    ),
  };
});
jest.mock('../../screens/Contact/Contact', () => {
  const {Text, View} = require('react-native');
  return {
    Contact: () => (
      <View>
        <Text>Contact</Text>
        <Text>Select contact</Text>
      </View>
    ),
  };
});

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  clean: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));


jest.mock('react-native-libsodium', () => ({
  from_base64: jest.fn(),
  randombytes_buf: jest.fn(),
  crypto_box_easy: jest.fn(),
  to_base64: jest.fn(),
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
}));

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

describe('render home stack', () => {
  beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (
      typeof message === 'string' &&
      message.includes("The action 'RESET' with payload")
    ) {
      return;
    }
    console.error(message);
  });
});

  test('should it render title', () => {
    const {getByText} = renderWithProviders(<HomeStack/>);
    expect(getByText('SmartChat')).toBeTruthy();
  });

  test('should renders Home screen element', () => {
    renderWithProviders(<HomeStack/>);
    expect(
      screen.getByText('Start conversations with your closed ones'),
    ).toBeTruthy();
  });

  test('should renders Unread screen when showUnread is true', () => {
    const {getByText} = renderWithProviders(<HomeStack showUnread={true}/>);
    expect(getByText('Unread')).toBeTruthy();
    expect(screen.getByText('No unread chats here')).toBeTruthy();
    expect(screen.getByText('View all chats')).toBeTruthy();
  });

  test('should renders Contact screen', () => {
    const {getByLabelText, getAllByText} = renderWithProviders(<HomeStack/>);
    const button = getByLabelText('addContact');
    fireEvent.press(button);

    expect(getAllByText('Select contact')).toBeTruthy();
  });

  test('should return to homescreen', () => {
    const {getByLabelText, getByText} = renderWithProviders(<HomeStack/>);
    const button = getByLabelText('addContact');
    fireEvent.press(button);
    const backButton = getByLabelText('chevronIcon');
    fireEvent.press(backButton);
    expect(getByText('Start conversations with your closed ones')).toBeTruthy();
  });
});
