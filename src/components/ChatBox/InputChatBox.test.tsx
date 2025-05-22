import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {InputChatBox} from './InputChatBox';

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
}));
jest.mock('../SendButton/SendButton.service', () => ({
  sendMessage: jest.fn(() => Promise.resolve()),
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
});
