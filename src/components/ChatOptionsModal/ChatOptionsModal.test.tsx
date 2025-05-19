import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { ChatOptionsModal } from './ChatOptionsModal';
import { Platform } from 'react-native';
const renderChatOptionsModal = ({
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
    </Provider>
  );
};

describe('ChatOptionsModal Component', () => {
  it('should render the modal with "Clear Chat" and "Block" options', () => {
    renderChatOptionsModal();

    expect(screen.getByText('Clear Chat')).toBeTruthy();
    expect(screen.getByText('Block')).toBeTruthy();
  });

  it('should call onClearChat when "Clear Chat" is pressed', () => {
    const handleClearChat = jest.fn();
    renderChatOptionsModal({ onClearChat: handleClearChat });

    fireEvent.press(screen.getByText('Clear Chat'));
    expect(handleClearChat).toHaveBeenCalledTimes(1);
  });

  it('should call onBlock when "Block" is pressed', () => {
    const handleBlock = jest.fn();
    renderChatOptionsModal({ onBlock: handleBlock });

    fireEvent.press(screen.getByText('Block'));
    expect(handleBlock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking outside the modal', () => {
    const handleClose = jest.fn();
    renderChatOptionsModal({ onClose: handleClose });

    fireEvent.press(screen.getByLabelText('overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should apply correct paddingTop based on the platform (Android)', () => {
    Platform.OS = 'android';
    const { getByLabelText } = renderChatOptionsModal();

    const overlayView = getByLabelText('overlay');
    const styles = overlayView.props.style;

    expect(styles).toContainEqual({ paddingTop: 57 });
  });

  it('should apply correct paddingTop based on the platform (iOS)', () => {
    Platform.OS = 'ios';
    const { getByLabelText } = renderChatOptionsModal();

    const overlayView = getByLabelText('overlay');
    const styles = overlayView.props.style;

    expect(styles).toContainEqual({ paddingTop: 101 });
  });
});
