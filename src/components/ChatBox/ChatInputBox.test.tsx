import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import {InputChatBox} from './InputChatBox';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';

describe('InputChatBox', () => {
  test('should send a message when the send button is pressed', () => {
    let sentMessage = '';

    render(
      <Provider store={store}>
        <InputChatBox />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Type a message');
    const button = screen.getByText('➤');

    fireEvent.changeText(input, 'Hello world');
    fireEvent.press(button);

    expect(sentMessage).toBe('Hello world');
  });

  test('should not send an empty message', () => {
    let sentMessage = '';

    render(
      <Provider store={store}>
        <InputChatBox />
      </Provider>,
    );

    const button = screen.getByText('➤');
    fireEvent.press(button);

    expect(sentMessage).toBe('');
  });
});
