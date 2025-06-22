import React from 'react';
import { Provider } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useHomeChats } from '../../hooks/homechats';
import * as useAlertModalHook from '../../hooks/useAlertModal';
import { store } from '../../redux/store';
import { Home } from './Home';
import { MessageStatus } from '../../types/message';

jest.mock('../../hooks/homechats', () => ({
  useHomeChats: jest.fn(),
}));

function renderHomeScreen() {
  return render(
    <Provider store={store}>
      <Home />
    </Provider>,
  );
}
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@realm/react', () => {
return {
    createRealmContext: jest.fn(() => ({
      RealmProvider: ({ children }: any) => <>{children}</>,
      useRealm: jest.fn(() => ({})),
      useQuery: jest.fn(() => []),
    })),
  };
});

describe('Home Screen', () => {
  const mockNavigate = jest.fn();
  const showAlertMock = jest.fn();
  const hideAlertMock = jest.fn();
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      reset: jest.fn(),
    });
    (useHomeChats as jest.Mock).mockReturnValue([]);
    jest.spyOn(useAlertModalHook, 'useAlertModal').mockReturnValue({
      alertMessage: 'Test success message',
      alertType: 'success',
      alertVisible: true,
      hideAlert: hideAlertMock,
      showAlert: showAlertMock,
    });
    jest.clearAllMocks();
  });
  test('should render start conversation text correctly', async () => {
    const {getByText} = renderHomeScreen();
    expect(
      getByText(/Start Conversations with your closed ones/i),
    ).toBeTruthy();
  });
  test('Should render add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('addContact')).toBeTruthy();
  });

  test('Should navigate to ContactScreen on pressing add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    fireEvent.press(getByLabelText('addContact'));
    expect(mockNavigate).toHaveBeenCalledWith('Contact');
  });

  test('Should render the home image properly', () => {
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('home-image')).toBeTruthy();
  });
  test('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderHomeScreen();
    const homeImage = getByLabelText('home-image');
    expect(homeImage.props.style.height).toBe(300);
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderHomeScreen();
    const homeImg = screen.getByLabelText('home-image');
    expect(homeImg.props.style.height).toBe(250);
  });

  test('should render unread chat list if available', () => {
    const mockUnreadChats = [
      {
        lastMessage: {
          message: 'Hello Anjani',
          sentAt: '2025-06-03T10:00:00Z',
          isSender: false,
          status: MessageStatus.DELIVERED,
        },
        unreadCount: 3,
        contact: {
          name: 'Anjaniii',
          originalNumber: '8639523822',
          mobileNumber: '+91 86395 23822',
          profilePicture: null,
        },
      },
      {
        lastMessage: {
          message: 'Anjuu',
          sentAt: '2025-06-04T10:00:00Z',
          isSender: false,
          status: MessageStatus.DELIVERED,
        },
        unreadCount: 0,
        contact: {
          name: 'Anjani',
          originalNumber: '8639523823',
          mobileNumber: '+91 86395 23823',
          profilePicture: null,
        },
      },
    ];
    (useHomeChats as jest.Mock).mockReturnValue(mockUnreadChats);
    const { getByText } = renderHomeScreen();
    expect(getByText('Anjaniii')).toBeTruthy();
    expect(getByText('Hello Anjani')).toBeTruthy();
    expect(getByText('Anjuu')).toBeTruthy();
    expect(getByText('Anjani')).toBeTruthy();
  });
});
