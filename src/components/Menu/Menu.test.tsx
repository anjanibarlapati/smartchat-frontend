import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {Menu} from './Menu';
import {clearUserChat} from '../ChatOptionsModal/clearChat.service';

const receiverMobileNumber = '9812345098';
jest.mock('../ChatOptionsModal/clearChat.service', () => ({
  clearUserChat: jest.fn(),
}));
jest.mock('../../hooks/useAlertModal', () => ({
  useAlertModal: jest.fn(),
}));
const mockShowAlert = jest.fn();

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));
const renderMenu = () => {
  return render(
    <Provider store={store}>
      <Menu receiverMobileNumber={receiverMobileNumber} />
    </Provider>,
  );
};

describe('Should render Menu component', () => {
  beforeAll(() => {
    (
      require('../../hooks/useAlertModal').useAlertModal as jest.Mock
    ).mockReturnValue({
      showAlert: mockShowAlert,
    });
  });
  it('should render the menu image', () => {
    const {getByLabelText} = renderMenu();
    expect(getByLabelText('Menu-Image')).toBeTruthy();
  });
  it('should close the modal when "Block" is pressed', async () => {
    const {getByText, queryByText} = renderMenu();
    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(getByText('Block')).toBeTruthy();

    fireEvent.press(getByText('Block'));
    fireEvent.press(getByText('Yes'));

    await waitFor(() => {
      expect(queryByText('Block')).toBeNull();
    });
  });

  it('should close the modal when clicking outside the modal (overlay)', async () => {
    const {getByText, queryByText, getByLabelText} = renderMenu();

    fireEvent.press(getByLabelText('Menu-Image'));
    expect(getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(getByLabelText('overlay'));
    await waitFor(() => {
      expect(queryByText('Clear Chat')).toBeNull();
    });
  });
  it('should close the modal when "Clear Chat" is pressed', async () => {
    (clearUserChat as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({message: 'Cleared chat successfully'}),
    });

    const {getByLabelText, getByText} = renderMenu();

    fireEvent.press(getByLabelText('Menu-Image'));
    expect(getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(getByText('Clear Chat'));
    fireEvent.press(getByText('Yes'));
    await waitFor(() => {
      expect(clearUserChat).toHaveBeenCalledWith(
        expect.any(String),
        receiverMobileNumber,
      );
    });
  });

  it('should show Alert if there is any error', async () => {
    (clearUserChat as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({message: 'Cleared chat successfully'}),
    });

    const {getByLabelText, getByText} = renderMenu();

    fireEvent.press(getByLabelText('Menu-Image'));
    expect(getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(getByText('Clear Chat'));
    fireEvent.press(getByText('Yes'));
    await waitFor(() => {
      expect(clearUserChat).toHaveBeenCalledWith(
        expect.any(String),
        receiverMobileNumber,
      );
    });
  });

  it('should show an alert when clearUserChat fails', async () => {
    (clearUserChat as jest.Mock).mockRejectedValue(new Error('API failure'));
    const {getByLabelText, getByText} = renderMenu();

    fireEvent.press(getByLabelText('Menu-Image'));
    fireEvent.press(getByText('Clear Chat'));
    fireEvent.press(getByText('Yes'));

    await waitFor(() => {
      expect(clearUserChat).toHaveBeenCalled();

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Something went wrong. Please try again',
        'error',
      );
    });
  });
});
