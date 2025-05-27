import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {render, screen} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {IndividualChat} from './IndividualChat';
import {configureStore} from '@reduxjs/toolkit';
import messagesReducer, {
  addMessage,
} from '../../redux/reducers/messages.reducer';
import {themeReducer} from '../../redux/reducers/theme.reducer';

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
jest.mock('react-native-libsodium', () => ({
  from_base64: jest.fn(),
  randombytes_buf: jest.fn(),
  crypto_box_easy: jest.fn(),
  to_base64: jest.fn(),
}));

describe('IndividualChat', () => {
  beforeEach(() => {
    const setOptionsMock = jest.fn();

    const getParentMock = jest.fn().mockReturnValue({
      setOptions: setOptionsMock,
    });

    (useNavigation as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
      setOptions: setOptionsMock,
      getParent: getParentMock,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        name: 'Shailu',
        originalNumber: '9392345627',
        mobileNumber: '+91 93923 45627',
        profilePic: 'pic-url',
      },
    });
  });
  const renderWithMessage = () => {
    const store = configureStore({
      reducer: {
        messages: messagesReducer,
        theme: themeReducer,
      },
    });
    store.dispatch(
      addMessage({
        chatId: '+91 93923 45627',
        message: {
          id: '1',
          sender: '+91 93923 45627',
          receiver: 'me',
          message: 'Hello there!',
          sentAt: new Date().toISOString(),
          isSender: true,
          status: 'sent',
        },
      }),
    );
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>,
    );
  };

  test('Should render message from the FlatList', () => {
    renderWithMessage();
    expect(screen.getByText('Hello there!')).toBeTruthy();
  });

  test('should render the InputChatBox', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>,
    );

    const inputChatBox = screen.getByPlaceholderText('Type a message');
    expect(inputChatBox).toBeTruthy();
  });

  test('should render the menu icon', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>,
    );

    const menuIcon = screen.getByLabelText('send-icon');
    expect(menuIcon).toBeTruthy();
  });

  test('should call setOptions on navigation', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>,
    );

    const navigation = useNavigation();
    expect(navigation.setOptions).toHaveBeenCalledTimes(2);
  });
});
