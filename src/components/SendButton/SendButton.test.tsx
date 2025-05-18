import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {SendButton} from './SendButton';

describe('Send Button Component', () => {
  test('Should render the send button', () => {
    render(
      <Provider store={store}>
        <SendButton />
      </Provider>,
    );
    const image = screen.getByLabelText('send-icon');
    expect(image.props.source).toEqual(require('../../../assets/icons/send.png'));
  });
});
