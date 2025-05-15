import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import {fireEvent, render} from '@testing-library/react-native';
import {Unread} from './Unread';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
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
    const {getByText} = renderUnreadScreen();
    expect(getByText(/No unread chats here/i)).toBeTruthy();
  });

  test('should render "View all chats" text', () => {
    const {getByText} = renderUnreadScreen();
    expect(getByText(/View all chats/i)).toBeTruthy();
  });

  test('should navigate to AllChatsTab when pressing "View all chats"', () => {
    const {getByText} = renderUnreadScreen();
    fireEvent.press(getByText(/View all chats/i));
    expect(mockNavigateToAllChats).toHaveBeenCalledWith('AllChatsTab');
  });

  test('should render add contact button', () => {
    const {getByLabelText} = renderUnreadScreen();
    expect(getByLabelText('addContact')).toBeTruthy();
  });

  test('should navigate to Contact when pressing add contact button', () => {
    const {getByLabelText} = renderUnreadScreen();
    fireEvent.press(getByLabelText('addContact'));
    expect(mockNavigateToContact).toHaveBeenCalledWith('Contact');
  });
});
