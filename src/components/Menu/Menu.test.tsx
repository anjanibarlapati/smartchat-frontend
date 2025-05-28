import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {Menu} from './Menu';

jest.mock('../ChatOptionsModal/blockChat.service', () => ({
  blockUserChat: jest.fn().mockResolvedValue({ok: true}),
}));

const mockShowAlert = jest.fn();
const mockHideAlert = jest.fn();
jest.mock('../../hooks/useAlertModal', () => ({
  useAlertModal: () => ({
    showAlert: mockShowAlert,
    alertVisible: false,
    alertType: '',
    alertMessage: '',
    hideAlert: mockHideAlert,
  }),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const props = {
  senderMobileNumber: '8639523822',
  receiverMobileNumber: '9951534919',
};

describe('Tests related to Menu component', () => {
  it('should render the menu image', () => {
    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );
    expect(screen.getByLabelText('Menu-Image')).toBeTruthy();
  });

  it('should close the modal when "Clear Chat" is pressed', async () => {
    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByText('Clear Chat'));
    fireEvent.press(screen.getByText('Yes'));
    await waitFor(() => {
      expect(screen.queryByText('Clear Chat')).toBeNull();
    });
  });

  it('should close the modal when "Block" is pressed', async () => {
    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Block')).toBeTruthy();

    fireEvent.press(screen.getByText('Block'));
    fireEvent.press(screen.getByText('Yes'));

    await waitFor(() => {
      expect(screen.queryByText('Block')).toBeNull();
    });
  });

  it('should close the modal when clicking outside the modal (overlay)', async () => {
    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('overlay'));
    await waitFor(() => {
      expect(screen.queryByText('Clear Chat')).toBeNull();
    });
  });

  it('should show success alert when blockUserChat succeeds', async () => {
    const mockBlockUserChat =
      require('../ChatOptionsModal/blockChat.service').blockUserChat;
    mockBlockUserChat.mockResolvedValue({ok: true});

    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    fireEvent.press(screen.getByText('Block'));
    fireEvent.press(screen.getByText('Yes'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'User has been blocked successfully',
        'info',
      );
    });
  });
  it('should show warning alert when blockUserChat fails with message', async () => {
    const mockBlockUserChat =
      require('../ChatOptionsModal/blockChat.service').blockUserChat;
    mockBlockUserChat.mockResolvedValue({
      ok: false,
      json: async () => ({message: 'Block failed'}),
    });
    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    fireEvent.press(screen.getByText('Block'));
    fireEvent.press(screen.getByText('Yes'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith('Block failed', 'warning');
    });
  });

  it('should show error alert when blockUserChat throws an exception', async () => {
    const mockBlockUserChat =
      require('../ChatOptionsModal/blockChat.service').blockUserChat;
    mockBlockUserChat.mockRejectedValue(new Error('Network error'));

    render(
      <Provider store={store}>
        <Menu {...props} />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    fireEvent.press(screen.getByText('Block'));
    fireEvent.press(screen.getByText('Yes'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Something went wrong please try again',
        'error',
      );
    });
  });
});
