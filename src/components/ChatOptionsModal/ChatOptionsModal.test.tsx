import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { useRealm } from '../../contexts/RealmContext';
import { store } from '../../redux/store';
import { ChatOptionsModal } from './ChatOptionsModal';

jest.mock('../../contexts/RealmContext', () => ({
  useRealm: jest.fn(),
}));

const mockObjectForPrimaryKey = jest.fn();

const renderChatOptionsModal = ({
  visible = true,
  onClearChat = jest.fn(),
  onBlockAndUnblock = jest.fn(),
  onClose = jest.fn(),
  receiverMobileNumber = '1234567890',
} = {}) => {
  return render(
    <Provider store={store}>
      <ChatOptionsModal
        visible={visible}
        onClearChat={onClearChat}
        onBlockAndUnblock={onBlockAndUnblock}
        onClose={onClose}
        receiverMobileNumber={receiverMobileNumber}
      />
    </Provider>
  );
};

describe('Tests related to the ChatOptionsModal', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (useRealm as jest.Mock).mockReturnValue({
      objectForPrimaryKey: mockObjectForPrimaryKey,
    });
  });

  it('Should render the Clear Chat text always', () => {
    renderChatOptionsModal();
    expect(screen.getByText('Clear Chat')).toBeTruthy();
  });

  it('Should render the text Block if chat is not yet blocked', () => {
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: false });
    renderChatOptionsModal();
    expect(screen.getByText('Block')).toBeTruthy();
  });

  it('Should render the text Unblock if chat is already blocked', () => {
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: true });
    renderChatOptionsModal();
    expect(screen.getByText('Unblock')).toBeTruthy();
  });

  it('Should not render either Block or Unblock in the self chat', () => {
    const myNumber = store.getState().user.mobileNumber;
    renderChatOptionsModal({ receiverMobileNumber: myNumber });
    expect(screen.queryByText('Block')).toBeNull();
    expect(screen.queryByText('Unblock')).toBeNull();
  });

  it('Should clear the chat when Clear Chat is pressed', () => {
    const handleClearChat = jest.fn();
    renderChatOptionsModal({ onClearChat: handleClearChat });
    fireEvent.press(screen.getByText('Clear Chat'));
    expect(handleClearChat).toHaveBeenCalledTimes(1);
  });

  it('Should block the contact when user clicks on Block', () => {
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: false });
    const handleBlockUnblock = jest.fn();
    renderChatOptionsModal({ onBlockAndUnblock: handleBlockUnblock });
    fireEvent.press(screen.getByText('Block'));
    expect(handleBlockUnblock).toHaveBeenCalledTimes(1);
  });

  it('Should unblock the contact when user clicks on Unblock', () => {
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: true });
    const handleBlockUnblock = jest.fn();
    renderChatOptionsModal({ onBlockAndUnblock: handleBlockUnblock });
    fireEvent.press(screen.getByText('Unblock'));
    expect(handleBlockUnblock).toHaveBeenCalledTimes(1);
  });

  it('Should call onClose when pressed on background', () => {
    const handleClose = jest.fn();
    renderChatOptionsModal({ onClose: handleClose });
    fireEvent.press(screen.getByLabelText('overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  it('Should not display block option if user has deleted their account', () => {
    mockObjectForPrimaryKey.mockReturnValue({ isAccountDeleted: false });
    const myNumber = store.getState().user.mobileNumber;
    renderChatOptionsModal({ receiverMobileNumber: myNumber });
    expect(screen.queryByText('Block')).toBeNull();
  });

  it('Should apply correct paddingTop for Android', () => {
    Platform.OS = 'android';
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: false });
    const { getByLabelText } = renderChatOptionsModal();
    const overlay = getByLabelText('overlay');
    expect(overlay.props.style).toContainEqual({ paddingTop: 50 });
  });

  it('Should apply correct paddingTop for iOS', () => {
    Platform.OS = 'ios';
    mockObjectForPrimaryKey.mockReturnValue({ isBlocked: false });
    const { getByLabelText } = renderChatOptionsModal();
    const overlay = getByLabelText('overlay');
    expect(overlay.props.style).toContainEqual({ paddingTop: 101 });
  });
});
