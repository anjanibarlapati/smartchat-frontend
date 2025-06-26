import { useNavigation } from '@react-navigation/native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Alert, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Registration from './Registration';
import * as RegistrationHandler from './Registration.service';

jest.mock('../../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));


const renderRegistrationScreen = () => {
  return render(
    <Provider store={store}>
      <Registration />
    </Provider>,
  );
};

describe('Registration Screen check', () => {
  let mockVerifyUserDetails: jest.SpyInstance;
  const mockReplace = jest.fn();
  const mockNavigate = jest.fn();

  beforeAll(() => {
    mockVerifyUserDetails = jest.spyOn(RegistrationHandler, 'verifyUserDetails');
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
      navigate: mockNavigate,
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    mockVerifyUserDetails.mockRestore();
  });

  it('Should render the registration screen correctly', () => {
    const {getByPlaceholderText, getByText, getByLabelText} =
      renderRegistrationScreen();
    const image = getByLabelText('profile-image');
    expect(image).toBeTruthy();
    expect(getByPlaceholderText('First Name *')).toBeTruthy();
    expect(getByPlaceholderText('Last Name *')).toBeTruthy();
    expect(getByPlaceholderText('Email *')).toBeTruthy();
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
      expect(queryByText('Email is required')).toBeTruthy();
    });
  });
  it('Should show validation when password when it doesn`t meet the require conditions ', async () => {
    const {getByLabelText, getByPlaceholderText, getByText, queryByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Anjali');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Gogu');
    fireEvent.changeText(getByPlaceholderText('Email *'), 'anju415@.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 7702153247');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'anjali');

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(
        queryByText(
          'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
        ),
      ).toBeTruthy();
    });
  });
  it(' Should show error when passwords do not match', async () => {
    const {getByLabelText, getByPlaceholderText, getByText, queryByText} =
      renderRegistrationScreen();
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niya;');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu415#',
    );
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
    fireEvent.changeText(getByPlaceholderText('Email *'), 'mamathagmail.com');
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
    fireEvent.changeText(getByPlaceholderText('Email *'), 'mamathagmail.com');
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
    fireEvent.changeText(getByPlaceholderText('Email *'), 'anju@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu18@',
    );
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
  });

  it('Should give an alert with error message if response of verifyUserDetails API is not ok', async () => {
    const response = {
      ok: false,
      json: async () => ({message: 'User already exists'}),
    };
    mockVerifyUserDetails.mockResolvedValue(response);

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email *'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu18@',
    );
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(getByText('User already exists')).toBeTruthy();
    });
  });

    it('Should give an alert with warning if the API gives an error with no response message', async () => {
    const response = {
      ok: false,
      json: async () => ({}),
    };
    mockVerifyUserDetails.mockResolvedValue(response);

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email *'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu18@',
    );
    await act(async () => {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(getByText('Please check your inputs')).toBeTruthy();
    });
  });

  it('Should give an alert with Something went wrong. Please try again message if API throws an error', async () => {
    mockVerifyUserDetails.mockRejectedValue(new Error('Internal server error'));

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email *'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu18@',
    );
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

  it('Should navigate to OTPVerification Screen if user details are verified', async () => {
    const response = {
      ok: true,
      json: async () => ({}),
    };


    (mockVerifyUserDetails as jest.Mock).mockResolvedValue(response);

    const {getByLabelText, getByPlaceholderText, getByText} =
      renderRegistrationScreen();

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email *'), 'varun@gmail.com');
    fireEvent.changeText(getByLabelText('phone-input'), '+91 1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'Anjaligogu18@');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'Anjaligogu18@',
    );

    await act(async () => {
      fireEvent.press(getByText('Register'));
    });

    await waitFor(() => {

      expect(mockNavigate).toHaveBeenCalledWith(
        'OTPVerificationScreen', {'email': 'varun@gmail.com', 'from': 'registration', 'mobileNumber': '+91 1234 567 890'}
      );
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
    const flattenedStyle = StyleSheet.flatten(
      bodyContainer?.props.contentContainerStyle,
    );
    expect(flattenedStyle.paddingHorizontal).toBe(100);
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderRegistrationScreen();
    const body = screen.getByLabelText('body-container').parent?.parent;
     const flattenedStyle2 = StyleSheet.flatten(
      body?.props.contentContainerStyle,
    );
    expect(flattenedStyle2.paddingHorizontal).toBe(2);
  });
});
