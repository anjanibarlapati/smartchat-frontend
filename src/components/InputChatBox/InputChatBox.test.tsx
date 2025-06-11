import NetInfo from '@react-native-community/netinfo';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { useRealm } from '../../contexts/RealmContext';
import { addNewMessageInRealm } from '../../realm-database/operations/addNewMessage';
import { store } from '../../redux/store';
import { InputChatBox } from './InputChatBox';
import { sendMessage } from './InputChatBox.service';
import { MessageStatus } from '../../types/message';


jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

jest.mock('react-native-libsodium', () => ({
  from_base64: jest.fn(),
  randombytes_buf: jest.fn(),
  crypto_box_easy: jest.fn(),
  to_base64: jest.fn(),
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
}));

jest.mock('./InputChatBox.service', () => ({
  sendMessage: jest.fn(),
}));

let mockEmit: jest.Mock = jest.fn();
jest.mock('../../utils/socket', () => ({
  mockEmit: jest.fn(),
  getSocket: jest.fn(),
}));

jest.mock('../../realm-database/operations/addNewMessage', () => ({
  addNewMessageInRealm: jest.fn(),
}));

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

jest.mock('../../contexts/RealmContext', () => ({
  useRealm: jest.fn(),
}));

const mockRealmInstance = {
  write: jest.fn(fn => fn()),
  create: jest.fn(),
};
const renderInputBox = (mobileNumber: string) => {
  render(
    <Provider store={store}>
      <InputChatBox receiverMobileNumber={mobileNumber} />
    </Provider>,
  );
};

describe('InputChatBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRealm as jest.Mock).mockReturnValue(mockRealmInstance);
  });

  test('Should render the input placeholder', () => {
    renderInputBox('8639523822');
    const input = screen.getByPlaceholderText('Type a message');
    expect(input).toBeTruthy();
    const image = screen.getByLabelText('send-icon');
    expect(image.props.source).toEqual(
      require('../../../assets/icons/send.png'),
    );
  });

  test('Should send message and clear input', async () => {
    (sendMessage as jest.Mock).mockResolvedValue({});
    (addNewMessageInRealm as jest.Mock).mockResolvedValue({});
    renderInputBox('8639523822');
    const input = screen.getByPlaceholderText('Type a message');
    waitFor(() => {
      fireEvent.changeText(input, 'Hello');
    });
    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(() => {
      fireEvent.press(sendButton);
    });
    expect(input.props.value).toBe('');
    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('Should not send message if input is empty', () => {
    renderInputBox('8639523822');

    const sendButton = screen.getByLabelText('send-icon');
    waitFor(() => {
      fireEvent.press(sendButton);
    });
    expect(sendMessage).not.toHaveBeenCalled();
  });

  test('Should not send message if input contains only spaces', async () => {
    renderInputBox('8639523822');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, ' ');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(() => {
      fireEvent.press(sendButton);
    });
    expect(sendMessage).not.toHaveBeenCalled();
  });
  test('Should send status as "seen" when sender and receiver are same and network is connected', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: true});
    (sendMessage as jest.Mock).mockResolvedValue({});
    (addNewMessageInRealm as jest.Mock).mockResolvedValue({});
    renderInputBox('');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(() => {
      fireEvent.press(sendButton);
    });
    expect(addNewMessageInRealm).toHaveBeenCalledWith(
      mockRealmInstance,
      '',
      expect.objectContaining({status: MessageStatus.SEEN}),
    );
  });
  test('Should store message as pending when offline', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: false});

    renderInputBox('6303974914');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Pending message');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(() => {
      fireEvent.press(sendButton);
    });

    expect(addNewMessageInRealm).toHaveBeenCalledWith(
      mockRealmInstance,
      '6303974914',
      expect.objectContaining({
        message: 'Pending message',
        status: MessageStatus.PENDING,
      }),
    );

    expect(sendMessage).not.toHaveBeenCalled();
  });

  test('Should send message and mark as sent when online', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: true});
    (sendMessage as jest.Mock).mockResolvedValue({});
    (addNewMessageInRealm as jest.Mock).mockResolvedValue({});

    renderInputBox('9502147010');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Online message');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(() => {
      fireEvent.press(sendButton);
    });

    expect(addNewMessageInRealm).toHaveBeenCalledWith(
      mockRealmInstance,
      '9502147010',
      expect.objectContaining({
        message: 'Online message',
        status: MessageStatus.SENT,
      }),
    );

    expect(sendMessage).toHaveBeenCalledWith(
      expect.any(String),
      '9502147010',
      'Online message',
      expect.any(String),
    );
  });
});
