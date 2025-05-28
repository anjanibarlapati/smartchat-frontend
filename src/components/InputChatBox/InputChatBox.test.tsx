import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {InputChatBox} from './InputChatBox';
import {sendMessage} from './InputChatBox.service';

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
      },
    }),
  ),
}));

describe('InputChatBox', () => {
  test('Should render the input placeholder', () => {
    render(
      <Provider store={store}>
        <InputChatBox receiverMobileNumber="" onSendMessage={() => {}} />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('Type a message');
    expect(input).toBeTruthy();
    const image = screen.getByLabelText('send-icon');
    expect(image.props.source).toEqual(
      require('../../../assets/icons/send.png'),
    );
  });

  test('Should send message and clear input', () => {
    const onSendMessageMock = jest.fn();

    render(
      <Provider store={store}>
        <InputChatBox
          receiverMobileNumber=""
          onSendMessage={onSendMessageMock}
        />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello');

    const sendButton = screen.getByLabelText('send-icon');
    fireEvent.press(sendButton);

    expect(onSendMessageMock).toHaveBeenCalledWith('Hello');
  });

  test('Should not send message if input is empty', () => {
    const onSendMessageMock = jest.fn();

    render(
      <Provider store={store}>
        <InputChatBox
          receiverMobileNumber=""
          onSendMessage={onSendMessageMock}
        />
      </Provider>,
    );

    const sendButton = screen.getByLabelText('send-icon');
    fireEvent.press(sendButton);

    expect(onSendMessageMock).not.toHaveBeenCalled();
  });
  test('Should not send message if input contains only spaces', () => {
    const onSendMessageMock = jest.fn();

    render(
      <Provider store={store}>
        <InputChatBox
          receiverMobileNumber=""
          onSendMessage={onSendMessageMock}
        />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, '   ');

    const sendButton = screen.getByLabelText('send-icon');
    fireEvent.press(sendButton);

    expect(onSendMessageMock).not.toHaveBeenCalled();
  });

  test('Should throw error when sendMessage fails', async () => {
    (sendMessage as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('encryption failed')),
    );

    const onSendMessageMock = jest.fn();

    render(
      <Provider store={store}>
        <InputChatBox
          receiverMobileNumber=""
          onSendMessage={onSendMessageMock}
        />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.changeText(input, 'Hello ');

    const sendButton = screen.getByLabelText('send-icon');

    await expect(() => fireEvent.press(sendButton)).rejects.toThrow(
      'unable to encrypt message',
    );
  });
});
