import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { useQuery, useRealm } from '../../contexts/RealmContext';
import { themeReducer } from '../../redux/reducers/theme.reducer';
import { userReducer } from '../../redux/reducers/user.reducer';
import { getSocket } from '../../utils/socket';
import { IndividualChat } from './IndividualChat';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('../../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
  useRealm: jest.fn(),
}));

let mockEmit: jest.Mock = jest.fn();
jest.mock('../../utils/socket', () => ({
  getSocket: jest.fn(() => ({
    connected: true,
    emit: mockEmit,
  })),
}));

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_keypair: jest.fn(),
  to_base64: jest.fn(),
}));

const mockRealm = {
  write: jest.fn((fn) => fn()),
  objectForPrimaryKey: jest.fn().mockReturnValue({
    chatId: '+91 86395 23822',
    isBlocked: false,
    publicKey: null,
  }),
  create: jest.fn(),
};


describe('IndividualChat', () => {
  let store: ReturnType<typeof configureStore>;
  const sentAt = new Date().toISOString();

  const unseenMessage = {
    _id: '1',
    message: 'Unread message',
    sentAt,
    isSender: false,
    status: 'delivered',
    chat: {
      chatId: '+91 86395 23822',
    },
  };

  const seenMessage = {
    _id: '2',
    message: 'Hello Anjani',
    sentAt,
    isSender: true,
    status: 'seen',
    chat: {
      chatId: '+91 86395 23833',
    },
  };

  const renderComponent = () =>
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useRealm as jest.Mock).mockReturnValue(mockRealm);
    const setOptionsMock = jest.fn();
    const getParentMock = jest.fn().mockReturnValue({ setOptions: setOptionsMock });

    (useNavigation as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
      setOptions: setOptionsMock,
      getParent: getParentMock,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        name: 'Shailu',
        originalNumber: '8639523922',
        mobileNumber: '+91 86395 23822',
        profilePic: 'pic-url',
      },
    });

    store = configureStore({
      reducer: {
        theme: themeReducer,
        user: userReducer,
      },
    });
  });

  test('renders messages from the FlatList', () => {
    (useQuery as jest.Mock).mockReturnValue({
      filtered: jest.fn().mockReturnValue([seenMessage, unseenMessage]),
    });
    renderComponent();

    expect(screen.getByText('Hello Anjani')).toBeTruthy();
    expect(screen.getByText('Unread message')).toBeTruthy();
  });
  test('does not render messages when there are no messages', () => {
    (useQuery as jest.Mock).mockReturnValue({
      filtered: jest.fn().mockReturnValue([]),
    });
    const { queryByText } = renderComponent();

    expect(queryByText('Hello Anjani')).toBeNull();
  });


  test('renders the InputChatBox', () => {
    (useQuery as jest.Mock).mockReturnValue({
      filtered: jest.fn().mockReturnValue([seenMessage]),
    });

    renderComponent();

    const input = screen.getByPlaceholderText('Type a message');
    expect(input).toBeTruthy();
  });

  test('renders the menu icon (send icon)', () => {
  (useQuery as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue([seenMessage]),
   });

    renderComponent();

    const icon = screen.getByLabelText('send-icon');
    expect(icon).toBeTruthy();
  });

  test('calls navigation.setOptions twice (header + tabBar)', () => {
  (useQuery as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue([seenMessage]),
   });

    renderComponent();

    const navigation = useNavigation();
    expect(navigation.setOptions).toHaveBeenCalledTimes(2);
  });

  test('should not emit messageRead if socket is not connected', async () => {
    (getSocket as jest.Mock).mockReturnValue({
      connected: false,
      emit: mockEmit,
    });
    (useQuery as jest.Mock).mockReturnValue({
      filtered: jest.fn().mockReturnValue([unseenMessage]),
    });

    renderComponent();

    await waitFor(() => {
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  test('should emit messageRead for unread received messages', async () => {
    (getSocket as jest.Mock).mockReturnValue({
      connected: true,
      emit: mockEmit,
    });
  (useQuery as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue([unseenMessage, seenMessage]),
   });

    renderComponent();

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith('messageRead', {
        sentAt,
        chatId: '+91 86395 23822',
      });
    });
  });

  test('Should creates a new Chat if chat does not exist in Realm', () => {
    mockRealm.objectForPrimaryKey.mockReturnValue(undefined);
    renderComponent();
    expect(mockRealm.write).toHaveBeenCalled();
    expect(mockRealm.create).toHaveBeenCalledWith('Chat', {
      chatId: '+91 86395 23822',
      isBlocked: false,
      publicKey: null,
    });
  });
});
