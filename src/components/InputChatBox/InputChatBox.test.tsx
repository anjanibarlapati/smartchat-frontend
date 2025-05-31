import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {InputChatBox} from './InputChatBox';
import {sendMessage} from './InputChatBox.service';
import { getSocket } from '../../utils/socket';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
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
  sendMessage: jest.fn(() =>
    Promise.resolve({
      message: {
        _id: 'mock-message-id',
        message:'Hello',
      },
    }),
  ),
}));

let mockEmit: jest.Mock = jest.fn();
jest.mock('../../utils/socket', () => ({
  mockEmit: jest.fn(),
  getSocket: jest.fn(),
}));

const renderInputBox = (mobileNumber: string) => {
  render(
      <Provider store={store}>
        <InputChatBox receiverMobileNumber={mobileNumber} />
      </Provider>
  );
};

describe('InputChatBox', () => {
  beforeEach(()=>{
    jest.clearAllMocks();
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

  test('Should send message and clear input', async() => {
    renderInputBox('8639523822');
    const input = screen.getByPlaceholderText('Type a message');
    waitFor(()=> {
      fireEvent.changeText(input, 'Hello');
    });
    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(()=> {
        fireEvent.press(sendButton);
    });
    expect(input.props.value).toBe('');
    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('Should not send message if input is empty', () => {
    renderInputBox('8639523822');

    const sendButton = screen.getByLabelText('send-icon');
    waitFor(()=> {
        fireEvent.press(sendButton);
    });
    expect(sendMessage).not.toHaveBeenCalled();
  });

  test('Should not send message if input contains only spaces', async() => {
    renderInputBox('8639523822');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, ' ');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(()=> {
        fireEvent.press(sendButton);
    });
    expect(sendMessage).not.toHaveBeenCalled();

  });
  test('Should not emit messageRead if socket is not connected when sender and receiver are same', async()=>{
    (getSocket as jest.Mock).mockReturnValue({connected: false, emit: mockEmit});
    renderInputBox('');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor(()=> {
        fireEvent.press(sendButton);
    });
    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('Should emit messageRead if socket is connected when sender and receiver are same', async()=>{
    (getSocket as jest.Mock).mockReturnValue({connected: true, emit: mockEmit});
    renderInputBox('');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello');

    const sendButton = screen.getByLabelText('send-icon');
    await waitFor( ()=> {
        fireEvent.press(sendButton);
    });
    waitFor(()=> {
      expect(mockEmit).toHaveBeenCalledWith('messageRead', {
        messageId: 'mock-message-id',
        chatId: '',
      });
    });
  });

  test('Should throw error when sendMessage fails', async () => {
    (sendMessage as jest.Mock).mockRejectedValue(new Error('encryption failed'));
    renderInputBox('8639523822');

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello');

    const sendButton = screen.getByLabelText('send-icon');

    await expect(() => fireEvent.press(sendButton)).rejects.toThrow(
      'Unable to encrypt message',
    );
  });

});
