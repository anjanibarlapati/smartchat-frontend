import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Registration from './Registration';
import {Provider} from 'react-redux';
import store from '../../redux/store';

describe('Registration Screen check', () => {
  it('renders the registration screen correctly', () => {
    const {getByPlaceholderText, getByText, getByLabelText} = render(
      <Provider store={store}>
        <Registration />
      </Provider>,
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
      </Provider>,
    );
    fireEvent.press(getByText('Register'));
    await waitFor(() => {
      expect(queryByText('First name is required')).toBeTruthy();
      expect(queryByText(' Last name is required')).toBeTruthy();
      expect(queryByText('Mobile number is required')).toBeTruthy();
      expect(queryByText('Password is required')).toBeTruthy();
    });
  });
  it('shows error when passwords do not match', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <Provider store={store}>
        <Registration />
      </Provider>,
    );
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Mamatha');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Niya;');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password *'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '123');
    fireEvent.press(getByText('Register'));
    await waitFor(() => {
      expect(queryByText('Passwords do not match')).toBeTruthy();
    });
  });
  it('shows error for invalid email address', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <Provider store={store}>
        <Registration />
      </Provider>,
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

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(queryByText('Invalid email address')).toBeTruthy();
    });
  });

  it('submits the form successfully when all fields are valid', async () => {
    const {getByPlaceholderText, getByText} = render(
      <Provider store={store}>
        <Registration />
      </Provider>,
    );
    fireEvent.changeText(getByPlaceholderText('First Name *'), 'Anjani');
    fireEvent.changeText(getByPlaceholderText('Last Name *'), 'Barlapati');
    fireEvent.changeText(getByPlaceholderText('Email'), 'anju@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Mobile Number *'), '9876543210');
    fireEvent.changeText(getByPlaceholderText('Password *'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password *'), '1234');
    fireEvent.press(getByText('Register'));
  });
});
