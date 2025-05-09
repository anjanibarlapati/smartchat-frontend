import { Alert } from 'react-native';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import Registration from './Registration';
import * as RegistrationHandler from './Registration.handler';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

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

describe('Registration Screen check', () => {

  let mockRegister: jest.SpyInstance;

  beforeAll(() => {
    mockRegister = jest.spyOn(RegistrationHandler, 'register');
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    mockRegister.mockRestore();
  });

  it('renders the registration screen correctly', () => {
    const {getByPlaceholderText, getByText, getByLabelText} = render(
      <Provider store={store}>
         <Registration />
      </Provider>
    );
    const image = getByLabelText('profile-image');
    expect(image).toBeTruthy();
    expect(getByPlaceholderText('First Name *')).toBeTruthy();
    expect(getByPlaceholderText('Last Name *')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mobile Number *')).toBeTruthy();
    expect(getByPlaceholderText('Password *')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password *')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });
  it('shows validation errors when fields are empty', async () => {
    const {getByText, queryByText} = render(
      <Provider store={store}>
        <Registration />
      </Provider>
    );
    fireEvent.press(getByText('Register'));
    await waitFor(() => {
      expect(queryByText('First name is required')).toBeTruthy();
      expect(queryByText('Last name is required')).toBeTruthy();
      expect(queryByText('Mobile number is required')).toBeTruthy();
      expect(queryByText('Password is required')).toBeTruthy();
    });
  });
  it('shows error when passwords do not match', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niya;');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '123');
    await act(async ()=> {
      fireEvent.press(getByText('Register'));
    });    await waitFor(() => {
      expect(queryByText('Passwords do not match')).toBeTruthy();
    });
  });
  it('shows error for invalid email address', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niyal');
    fireEvent.changeText(getByPlaceholderText('Email'), 'mamathagmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'password123');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password *'),
      'password123',
    );

    await act(async ()=> {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(queryByText('Invalid email address')).toBeTruthy();
    });
  });

  it('submits the form successfully when all fields are valid', async () => {
    const {getByPlaceholderText, getByText} = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Anjani');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Barlapati');
    fireEvent.changeText(getByPlaceholderText('Email'), 'anju@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '9876543210');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async ()=> {
        fireEvent.press(getByText('Register'));
      });
    });

  it('should give an alert on successful registration with message', async () => {
    const response = {
      ok: true,
      json: async () => ({ message: 'Registered Successfully' }),
    };
    mockRegister.mockResolvedValue(response);

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');

    await act(async ()=> {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('User Registered Successfully!');
    });
  });

  it('should give an alert with error message if the API gives an error', async () => {
    const response = {
      ok: false,
      json: async () => ({ message: 'User already exists' }),
    };
    mockRegister.mockResolvedValue(response);

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async ()=> {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('User already exists');
    });
  });

  it('should give an alert with Invalid error shows if API throws an error', async () => {
    mockRegister.mockRejectedValue(new Error('Internal server error'));

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
      <Registration />
    </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Varun');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Kumar');
    fireEvent.changeText(getByPlaceholderText('Email'), 'varun@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '5432123456');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    await act(async ()=> {
      fireEvent.press(getByText('Register'));
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Invalid error!');
    });
  });

});
