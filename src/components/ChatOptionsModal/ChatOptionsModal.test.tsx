import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {ChatOptionsModal} from './ChatOptionsModal';
import {store} from '../../redux/store';

const renderChatBlockModal = ({
  visible = true,
  onClearChat = jest.fn(),
  onBlock = jest.fn(),
  onClose = jest.fn(),
} = {}) => {
  return render(
    <Provider store={store}>
      <ChatOptionsModal
        visible={visible}
        onClearChat={onClearChat}
        onBlock={onBlock}
        onClose={onClose}
      />
    </Provider>,
  );
};

describe('Chat Options Modal', () => {
  it('Should render the modal with "Clear Chat" and "Block" options', () => {
    const {getByText} = renderChatBlockModal();
    expect(getByText('Clear Chat')).toBeTruthy();
    expect(getByText('Block')).toBeTruthy();
  });

  it('Should call onClearChat when "Clear Chat" is pressed', () => {
    const handleClearChat = jest.fn();
    const {getByText} = renderChatBlockModal({onClearChat: handleClearChat});

    fireEvent.press(getByText('Clear Chat'));
    expect(handleClearChat).toHaveBeenCalledTimes(1);
  });

  it('Should call onBlock when "Block" is pressed', () => {
    const handleBlock = jest.fn();
    const {getByText} = renderChatBlockModal({onBlock: handleBlock});

    fireEvent.press(getByText('Block'));
    expect(handleBlock).toHaveBeenCalledTimes(1);
  });
});
