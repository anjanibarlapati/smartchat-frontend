import React from 'react';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react-native';
import {InputChatBox} from './InputChatBox';
import {store} from '../../redux/store';

describe('InputChatBox', () => {
  test('should chaeck the placeholder text', () => {
    render(
      <Provider store={store}>
        <InputChatBox />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Type a message');

    expect(input).toBeTruthy();
  });
});
