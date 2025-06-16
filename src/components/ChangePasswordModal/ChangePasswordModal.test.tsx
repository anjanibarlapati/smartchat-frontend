import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { store } from '../../redux/store';
import * as profileService from '../../screens/Profile/Profile.services';
import * as tokens from '../../utils/getTokens';
import { ChangePasswordModal } from './ChangePasswordModal';

jest.mock('../../utils/getTokens');
jest.mock('../../screens/Profile/Profile.services');

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  clear: jest.fn(),
}));

const mockResetRealm = jest.fn();
jest.mock('../../contexts/RealmContext', () => ({
  useRealmReset: () => ({
    resetRealm: mockResetRealm,
  }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: () => mockUser,
  useDispatch: () => mockDispatch,
}));

const mockShowAlert = jest.fn();
jest.mock('../../hooks/useAlertModal', () => {
  return {
    useAlertModal: () => ({
      alertVisible: false,
      alertMessage: '',
      alertType: '',
      showAlert: mockShowAlert,
      hideAlert: jest.fn(),
    }),
  };
});

const mockDispatch = jest.fn();
const mockUser = {
  firstName: 'Mamatha',
  email: 'mamatha@gmail.com',
  mobileNumber: '+91 63039 74914',
};

describe(' Check for ChangePasswordModal', () => {
  const onClose = jest.fn();

  const renderChangePasswordModal = () =>
    render(
      <Provider store={store}>
        <ChangePasswordModal visible={true} onClose={onClose} />,
      </Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render all the fields correctly', () => {
    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    expect(getByText('Change Password')).toBeTruthy();
    expect(getByPlaceholderText('Old Password')).toBeTruthy();
    expect(getByPlaceholderText('New Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
  });
  it('Should show all fields required error if all fields are empty', () => {
    const {getByText} = renderChangePasswordModal();
    const saveBtn = getByText('Save');
    fireEvent.press(saveBtn);
    expect(getByText('All fields are required')).toBeTruthy();
  });
  it('Should show error for new password when it does not match the conditions', () => {
    const {getByPlaceholderText, getByText, queryByText} =
      renderChangePasswordModal();
    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), '12');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '12');

    fireEvent.press(getByText('Save'));

    expect(
      getByText(
        'Must be at least 8 characters, include uppercase, lowercase, number, and at least one special character',
      ),
    ).toBeTruthy();
    expect(queryByText('Passwords do not match')).toBeNull();
  });
  it('Should show error only for old password when it is missing', () => {
    const {getByPlaceholderText, getByText} = renderChangePasswordModal();
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamtha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );
    fireEvent.press(getByText('Save'));

    expect(getByText('Old password is required')).toBeTruthy();
  });
  it('Should show mismatch error when passwords don’t match', () => {
    const {getByPlaceholderText, getByText} = renderChangePasswordModal();
    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '12');

    fireEvent.press(getByText('Save'));

    expect(getByText('Passwords do not match')).toBeTruthy();
  });
  it('Should clear old password error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} =
      renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Save'));

    expect(getByText('Old password is required')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');

    expect(queryByText('Old password is required')).toBeNull();
  });
  it('Should clear new password error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} =
      renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Save'));

    expect(getByText('New password is required')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');

    expect(queryByText('New password is required')).toBeNull();
  });
  it('Should clear confirm password error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} =
      renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');

    fireEvent.press(getByText('Save'));

    expect(getByText('Please confirm your password')).toBeTruthy();

    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    expect(queryByText('Please confirm your password')).toBeNull();
  });
  it('Shoudl clear inputs and errors when cancel is pressed', () => {
    const {getByText, getByPlaceholderText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });
  it('Should clear storage and reset realm if getTokens returns null', async () => {
    (tokens.getTokens as jest.Mock).mockResolvedValue(null);

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Old@1234');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'New@1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'New@1234');

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(EncryptedStorage.clear).toHaveBeenCalled();
      expect(mockResetRealm).toHaveBeenCalled();
    });
  });
  it('Should call updatePassword API and show success alert', async () => {
    jest.spyOn(tokens, 'getTokens').mockResolvedValue({access_token: 'token'});
    jest.spyOn(profileService, 'updatePassword').mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        statusText: 'OK',
        headers: {'Content-Type': 'application/json'},
      }),
    );

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
  it('Should show error alert if API returns 401', async () => {
    jest.spyOn(tokens, 'getTokens').mockResolvedValue({access_token: 'token'});

    jest.spyOn(profileService, 'updatePassword').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as unknown as Response);

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'wrongpass');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Old password is incorrect',
        'error',
      );
    });
  });
  it('Should show info alert if old and new password are same', async () => {
    const mockUpdatePassword = jest.spyOn(profileService, 'updatePassword');
    mockUpdatePassword.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({message: 'Please give a different value'}),
    } as unknown as Response);

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Same@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Same@123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Same@123');

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Please give a different value',
        'info',
      );
    });
  });
  it('Should show default error message if no message in response', async () => {
    const mockUpdatePassword = jest.spyOn(profileService, 'updatePassword');
    mockUpdatePassword.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response);

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Old@1234');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'New@1234');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'New@1234');

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Failed to update password',
        'error',
      );
    });
  });
  it('Should show error alert if updatePassword throws an error', async () => {
    jest.spyOn(tokens, 'getTokens').mockResolvedValue({access_token: 'token'});
    jest
      .spyOn(profileService, 'updatePassword')
      .mockRejectedValue(new Error('Network error'));

    const {getByPlaceholderText, getByText} = renderChangePasswordModal();

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'Mamatha@123');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'Mamatha@12');
    fireEvent.changeText(
      getByPlaceholderText('Confirm Password'),
      'Mamatha@12',
    );

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Something went wrong',
        'error',
      );
    });
  });
});
