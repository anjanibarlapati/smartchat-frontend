import { useNavigation } from '@react-navigation/native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { generateKeyPair, storeKeys } from '../../utils/keyPairs';
import { decryptPrivateKey, encryptPrivateKey } from '../../utils/privateKey';
import Registration from './Registration';
import * as RegistrationHandler from './Registration.service';

jest.mock('../../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_keypair: jest.fn(),
  to_base64: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../utils/keyPairs', () => ({
  __esModule: true,
  generateKeyPair: jest.fn().mockResolvedValue({
    publicKey: 'mockPublicKey',
    privateKey: 'mockPrivateKey',
  }),
  storeKeys: jest.fn().mockResolvedValue({ok: true}),
}));

jest.mock('../../utils/privateKey', () => ({
  encryptPrivateKey: jest.fn().mockResolvedValue({
    salt: 'mockSalt',
    nonce: 'mockNonce',
    privateKey: 'mockEncryptedPrivateKey',
  }),
  decryptPrivateKey: jest.fn().mockResolvedValue('mockDecryptedPrivateKey'),
}));

const renderRegistrationScreen = () => {
  return render(
    <Provider store={store}>
      <Registration />
    </Provider>,
  );
};

describe('Registration Screen check', () => {
  let mockRegister: jest.SpyInstance;
  const mockReplace = jest.fn();
  const mockReset = jest.fn();

  beforeAll(() => {
    mockRegister = jest.spyOn(RegistrationHandler, 'register');
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
      reset: mockReset,
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    mockRegister.mockRestore();
  });

  it('Should render the registration screen correctly', () => {
    const {getByPlaceholderText, getByText, getByLabelText} =
      renderRegistrationScreen();
    const image = getByLabelText('profile-image');
    expect(image).toBeTruthy();
    expect(getByPlaceholderText('First Name *')).toBeTruthy();
    expect(getByPlaceholderText('Last Name *')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByLabelText('phone-input')).toBeTruthy();
    expect(getByPlaceholderText('Password *')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password *')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });
  it('Should show validation errors when fields are empty', async () => {
    const {getByText, queryByText} = renderRegistrationScreen();
    fireEvent.press(getByText('Register'));
    await waitFor(() => {
      expect(queryByText('First name is required')).toBeTruthy();
      expect(queryByText('Last name is required')).toBeTruthy();
      expect(queryByText('Mobile number is required')).toBeTruthy();
      expect(queryByText('Password is required')).toBeTruthy();
    });
  });
  it('shows error when passwords do not match', async () => {
    const {getByLabelText, getByPlaceholderText, getByText, queryByText} =
      renderRegistrationScreen();
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niya;');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '123');
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(queryByText('Passwords do not match')).toBeTruthy();
    });
  });
  it('Should show error for invalid email address', async () => {
    const {getByLabelText, getByPlaceholderText, getByText, queryByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niyal');
    fireEvent.changeText(getByPlaceholderText('Email'), 'mamathagmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'password123');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'password123',
    );

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(queryByText('Invalid email address')).toBeTruthy();
    });
  });

  test('Should show error for invalid mobile number', async () => {
    const {getByLabelText, getByPlaceholderText, getByText, queryByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niyal');
    fireEvent.changeText(getByPlaceholderText('Email'), 'mamathagmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 34567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'password123');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'password123',
    );

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(queryByText('Invalid mobile number')).toBeTruthy();
    });
  });

  it('Should submit the form successfully when all fields are valid', async () => {
    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Anjani');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Barlapati');
    fireEvent.changeText(getByPlaceholderText('Email'), 'anju@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
  });

  it('Should give an alert on successful registration with message', async () => {
    const response = {
      ok: true,
      json: async () => ({user: {}, userId: 'anjani123', access_token: 'access_token', refresh_token: 'refresh_token'}),
    };
    (generateKeyPair as jest.Mock).mockResolvedValue({
      publicKey: 'mockPublicKey',
      privateKey: 'mockPrivateKey',
    });

    (storeKeys as jest.Mock).mockResolvedValue({ok: true});
    (encryptPrivateKey as jest.Mock).mockResolvedValue({
      salt: 'mockSalt',
      nonce: 'mockNonce',
      privateKey: 'mockEncryptedPrivateKey',
    });
    (decryptPrivateKey as jest.Mock).mockResolvedValue('mockDecryptedPrivateKey');
    mockRegister.mockResolvedValue(response);
    (EncryptedStorage.setItem as jest.Mock).mockReturnValue(() => {});
    const {getByLabelText, getByPlaceholderText, getByText} =
    renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 12345 67890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(async () => {
      expect(EncryptedStorage.setItem).toHaveBeenCalled();
    });
  });

  it('Should give an alert with error message if the API gives an error', async () => {
    const response = {
      ok: false,
      json: async () => ({message: 'User already exists'}),
    };
    mockRegister.mockResolvedValue(response);

    const {getByLabelText, getByPlaceholderText, getByText} =
    renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(getByText('User already exists')).toBeTruthy();
    });
  });

  it('Should give an alert with Something went wrong. Please try again message if API throws an error', async () => {
    mockRegister.mockRejectedValue(new Error('Internal server error'));

    const {getByLabelText, getByPlaceholderText, getByText} =
    renderRegistrationScreen();
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(getByText('Something went wrong. Please try again')).toBeTruthy();
    });
  });

  it('Should navigate to Login Screen on pressing login text', () => {
    const {getByText} = renderRegistrationScreen();

    fireEvent.press(getByText(/login/i));
    expect(mockReplace).toHaveBeenCalledWith('LoginScreen');
  });

  it('Should navigate to Home Screen on successful registration and store keys', async () => {
    const response = {
      ok: true,
      json: async () => ({
        user: {
          firstName: 'Varun',
          lastName: 'Kumar',
          email: 'varun@gmail.com',
          mobileNumber: '1234567890',
        },
        userId: 'anjani123',
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }),
    };

    (generateKeyPair as jest.Mock).mockResolvedValue({
      publicKey: 'mockPublicKey',
      privateKey: 'mockPrivateKey',
    });

    (storeKeys as jest.Mock).mockResolvedValue({ok: true});
    (EncryptedStorage.setItem as jest.Mock).mockResolvedValue(null);
    (encryptPrivateKey as jest.Mock).mockResolvedValue({
      salt: 'mockSalt',
      nonce: 'mockNonce',
      privateKey: 'mockEncryptedPrivateKey',
    });
    (decryptPrivateKey as jest.Mock).mockResolvedValue('mockDecryptedPrivateKey');

    (mockRegister as jest.Mock).mockResolvedValue(response);

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });

    await waitFor(() => {
      expect(generateKeyPair).toHaveBeenCalled();

      expect(storeKeys).toHaveBeenCalledWith(
        '1234567890',
        'mockPublicKey',
        { salt: 'mockSalt', nonce: 'mockNonce', privateKey: 'mockEncryptedPrivateKey'},
        'access_token'
      );

      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'privateKey',
        JSON.stringify({privateKey: 'mockDecryptedPrivateKey'}),
      );

      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{name: 'Tabs'}],
      });
    });
  });
  it('Should open profile picture modal on image press', async () => {
    renderRegistrationScreen();
    const image = await waitFor(() => screen.getByLabelText('profile-image'));
    fireEvent.press(image);
    await waitFor(() => {
      expect(screen.getByText('Profile Photo')).toBeTruthy();
    });
  });
  it('Should close profile picture modal on cancel icon press', async () => {
    renderRegistrationScreen();
    const editIcon = await waitFor(() =>
      screen.getByLabelText('profile-image'),
    );
    fireEvent.press(editIcon);
    const cancelIcon = await waitFor(() =>
      screen.getByLabelText('cancel-icon'),
    );
    fireEvent.press(cancelIcon);
  });
  it('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderRegistrationScreen();
    const bodyContainer = getByLabelText('body-container').parent;
    expect(bodyContainer?.props.contentContainerStyle.paddingHorizontal).toBe(
      100,
    );
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderRegistrationScreen();
    const body = screen.getByLabelText('body-container').parent?.parent;
    expect(body?.props.contentContainerStyle.paddingHorizontal).toBe(2);
  });
});
