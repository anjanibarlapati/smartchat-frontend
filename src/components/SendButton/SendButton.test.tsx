import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {SendButton} from './SendButton';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
}));
jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

describe('Send Button Component', () => {
  const data = {
    receiverMobileNumber: '+91 6303974914',
    message: 'Hi',
  };
  test('Should render the send button', () => {
    render(
      <Provider store={store}>
        <SendButton
          receiverMobileNumber={data.receiverMobileNumber}
          message={data.message}
          onSend={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Provider>,
    );
    const image = screen.getByLabelText('send-icon');
    expect(image.props.source).toEqual(
      require('../../../assets/icons/send.png'),
    );
  });
});
