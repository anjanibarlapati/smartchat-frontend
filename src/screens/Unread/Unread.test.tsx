import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import {fireEvent, render} from '@testing-library/react-native';
import {Unread} from './Unread';
import { useUnreadChats } from '../../hooks/unreadChats';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks/unreadChats', () => ({
  useUnreadChats: jest.fn(),
}));

function renderUnreadScreen() {
  return render(
    <Provider store={store}>
      <Unread />
    </Provider>,
  );
}

describe('Unread Screen', () => {
  const mockNavigateToContact = jest.fn();
  const mockNavigateToAllChats = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock)
      .mockReturnValueOnce({ navigate: mockNavigateToContact })
      .mockReturnValueOnce({ navigate: mockNavigateToAllChats });
    jest.clearAllMocks();
  });

  test('should render "No unread chats here" text', () => {
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByText} = renderUnreadScreen();
    expect(getByText(/No unread chats here/i)).toBeTruthy();
  });

  test('should render "View all chats" text', () => {
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByText} = renderUnreadScreen();
    expect(getByText(/View all chats/i)).toBeTruthy();
  });

  test('should navigate to AllChatsTab when pressing "View all chats"', () => {
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByText} = renderUnreadScreen();
    fireEvent.press(getByText(/View all chats/i));
    expect(mockNavigateToAllChats).toHaveBeenCalledWith('AllChatsTab');
  });

  test('should render add contact button', () => {
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByLabelText} = renderUnreadScreen();
    expect(getByLabelText('addContact')).toBeTruthy();
  });

  test('should navigate to Contact when pressing add contact button', () => {
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByLabelText} = renderUnreadScreen();
    fireEvent.press(getByLabelText('addContact'));
    expect(mockNavigateToContact).toHaveBeenCalledWith('Contact');
  });

  test('Should render the home image properly', ()=>{
    (useUnreadChats as jest.Mock).mockReturnValue([]);
    const {getByLabelText} = renderUnreadScreen();
    expect(getByLabelText('unread-image')).toBeTruthy();
  });
  test('should render unread chat list if available', () => {
    const mockUnreadChats = [
      {
        lastMessage: {
          message: 'Hello Anjani',
          sentAt: '2025-06-03T10:00:00Z',
          isSender: false,
          status: 'delivered',
        },
        unreadCount: 3,
        contact: {
          name: 'Anjaniii',
          originalNumber: '8639523822',
          mobileNumber: '+91 86395 23822',
          profilePicture: null,
        },
      },
    ];

    (useUnreadChats as jest.Mock).mockReturnValue(mockUnreadChats);
    const { getByText } = renderUnreadScreen();

    expect(getByText('Anjaniii')).toBeTruthy();
    expect(getByText('Hello Anjani')).toBeTruthy();
  });

});
