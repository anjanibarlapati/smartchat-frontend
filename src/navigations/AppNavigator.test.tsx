import NetInfo from '@react-native-community/netinfo';
import { RealmProvider } from '@realm/react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { useAlertModal } from '../hooks/useAlertModal';
import { store } from '../redux/store';
import { checkAccessToken } from '../utils/checkToken';
import { socketConnection } from '../utils/socket.ts';
import { AppNavigator } from './AppNavigator';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));


jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));


jest.mock('react-native-libsodium', () => ({
  crypto_box_seal: jest.fn().mockReturnValue('mockEncryptedMessage'),
  crypto_secretbox_easy: jest.fn().mockReturnValue('mockEncryptedMessage'),
  randombytes_buf: jest.fn().mockReturnValue('mockNonce'),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPhotoLibrary: jest.fn(),
}));

jest.mock('../permissions/permissions', () => ({
  requestPermission: jest.fn(),
}));
jest.mock('../hooks/useAlertModal', () => ({
  useAlertModal: jest.fn(),
}));
const mockShowAlert = jest.fn();

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock('../utils/checkToken.ts', () => ({
  checkAccessToken: jest.fn().mockResolvedValue(false),
}));

jest.mock('../utils/socket.ts', () => ({
  socketConnection: jest.fn().mockResolvedValue(undefined),
}));


jest.mock('../contexts/RealmContext', () => ({
  RealmProvider: ({children}: any) => <>{children}</>,
  useRealm: jest.fn(),
  useQuery: jest.fn(() => []),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

describe('render AppNavigator', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(message => {
      if (
        typeof message === 'string' &&
        message.includes("The action 'RESET' with payload")
      ) {
        return;
      }
      console.error(message);
    });
  });
  beforeEach(() => {
    (useAlertModal as jest.Mock).mockReturnValue({
      alertVisible: true,
      alertMessage: 'Test alert',
      alertType: 'warning',
      showAlert: mockShowAlert,
      hideAlert: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderAppNavigator = () => {
    return render(
      <RealmProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </RealmProvider>,
    );
  };
  test('should it render the welcomscreen when no user data found', async () => {
    const {getByText} = renderAppNavigator();

    await waitFor(() => {
      expect(getByText('SmartChat')).toBeTruthy();
      expect(getByText('Where conversations evolve')).toBeTruthy();
      expect(getByText(/Let's Get Started/i)).toBeTruthy();
    });
  });

  test('should navigate to RegistrationScreen when Get Started button is clicked', async () => {
    const {getByText} = renderAppNavigator();

    const startButton = await waitFor(() => getByText(/Let's Get Started/i));
    fireEvent.press(startButton);
    await waitFor(() => {
      expect(getByText('Already have an account ?')).toBeTruthy();
    });
  });
  test('should navigate to LoginScreen when login button is clicked', async () => {
    const {getByText} = renderAppNavigator();
    const startButton = await waitFor(() => getByText(/Let's Get Started/i));
    fireEvent.press(startButton);
    const loginButton = await waitFor(() => getByText(/Login/i));
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText(/Don't have an account ?/i)).toBeTruthy();
    });
  });
  test('should navigate to RegistrationScreen when Register button is clicked', async () => {
    const {getByText} = renderAppNavigator();
    const startButton = await waitFor(() => getByText(/Let's Get Started/i));
    fireEvent.press(startButton);
    const loginButton = await waitFor(() => getByText(/Login/i));
    fireEvent.press(loginButton);
    const registerButton = await waitFor(() => getByText(/Register/i));
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText(/Already have an account ?/i)).toBeTruthy();
    });
  });

  test('should navigate to Tabs when user is authenticated', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        mobileNumber: '9908154694',
      }),
    );
    (checkAccessToken as jest.Mock).mockResolvedValue(true);

    const {getByText} = renderAppNavigator();
    await waitFor(() => {
      expect(getByText('SmartChat')).toBeTruthy();
    });
  });

  test('should still try to load user if device is offline', async() => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: false});
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
    (checkAccessToken as jest.Mock).mockResolvedValue(false);

    const {getByText} = renderAppNavigator();

    await waitFor(() => {
      expect(getByText('SmartChat')).toBeTruthy();
      expect(mockShowAlert).not.toHaveBeenCalled();
    });
  });

  test('should show alert when an error occurs', async () => {
    (NetInfo.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    renderAppNavigator();

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Failed to load user from storage',
        'error',
      );
    });
  });

  test('should hide splash screen after user load', async () => {
    renderAppNavigator();
    await waitFor(() => {
      expect(SplashScreen.hide).toHaveBeenCalled();
    });
  });

  test('should load user, when device is online', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: true});
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({user:{mobileNumber:'1234'}}));
    (checkAccessToken as jest.Mock).mockResolvedValue(true);
    (socketConnection as jest.Mock).mockResolvedValue({});

    const {getByText} = renderAppNavigator();

    await waitFor(() => {
      expect(socketConnection).toHaveBeenCalled();
    });
    await waitFor(()=> {
      expect(getByText('SmartChat')).toBeTruthy();
    });
  });
  test('should reset user and clear storage if not authenticated', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: true});
    (checkAccessToken as jest.Mock).mockResolvedValue(false);
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    renderAppNavigator();

    await waitFor(() => {
      expect(EncryptedStorage.clear).toHaveBeenCalled();
    });
  });
});
