import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import './Contact';
import {Contact} from './Contact';
import {store} from '../../redux/store';
import {Provider} from 'react-redux';
import { requestPermission } from '../../permissions/permissions';
import EncryptedStorage from 'react-native-encrypted-storage';
import Contacts from 'react-native-contacts';
import { getContactsDetails } from '../../utils/getContactsDetails';
import { getTokens } from '../../utils/getTokens.ts';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-native-contacts', () => ({
  getAll: jest.fn(),
}));

jest.mock('../../utils/getContactsDetails.ts', () => ({
  getContactsDetails: jest.fn(),
}));

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

jest.mock('../../utils/getTokens', () => ({
    getTokens: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

const mockContacts = [
  { name: 'Anjani', mobileNumber: '+91 8639523822', doesHaveAccount: true, profilePicture: '/image.jpg' },
  { name: 'Anj', mobileNumber: '+91 8639523823', doesHaveAccount: false, profilePicture: null},
];


const renderContactScreen = () => {
  return render(
    <Provider store={store}>
        <Contact />
    </Provider>,
  );
};
describe('Contacts Screen', () => {
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      reset: mockReset,
    });
  });

    it('should display alert if permission is denied', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(false);

      await waitFor(() => {
        renderContactScreen();
      });

      await waitFor(() => {
        expect(screen.getByText('Permission for contacts was denied')).toBeTruthy();
      });
    });


    it('should display alert if loading contacts from device fails', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      ( getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'mock_token' })
      );
      (Contacts.getAll as jest.Mock).mockRejectedValue(new Error('Could not load contacts.'));

      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        expect(screen.getByText(`Something went wrong while fetching contacts details. Please try again`)).toBeTruthy();
      });
    });

    it('should clear encrypted storage, clear stack and navigate to welcome screen if empty tokens are returned from async storage', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(null);

      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        expect(EncryptedStorage.clear).toHaveBeenCalled();
        expect(mockReset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: 'WelcomeScreen' }],
        });
      });
    });

    it('should switch to Invite tab and show contacts who are not on app', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue(mockContacts);
      (getContactsDetails as jest.Mock).mockResolvedValue(mockContacts);

      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        fireEvent.press(screen.getByText('Invite to SmartChat'));
      });
      await waitFor(()=> {
        expect(screen.getByText('Anj')).toBeTruthy();
        expect(screen.queryByText('Anjani')).toBeNull();
      });

    });

    it('should switch to Contacts tab and show contacts who are on app', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue(mockContacts);
      (getContactsDetails as jest.Mock).mockResolvedValue(mockContacts);

      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        fireEvent.press(screen.getByText('Contacts on SmartChat'));
      });

      await waitFor(()=> {
        expect(screen.getByText('Anjani')).toBeTruthy();
        expect(screen.queryByText('Anj')).toBeNull();
      });

    });

    it('should show a message when no device contacts are available', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([]);
      (getContactsDetails as jest.Mock).mockResolvedValue([]);

      await waitFor(() => {
        renderContactScreen();
      });

      await waitFor(() => {
        expect(screen.getByText('Add your friends to contacts and invite them to SmartChat')).toBeTruthy();
      });
    });

    it('should show a message when no contacts are on app', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([mockContacts[1]]);
      (getContactsDetails as jest.Mock).mockResolvedValue([mockContacts[1]]);

      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        fireEvent.press(screen.getByText('Contacts on SmartChat'));
      });

      await waitFor(() => {
        expect(screen.getByText('Invite your contacts to SmartChat and start your conversations')).toBeTruthy();
      });
    });

    it('should show a message when all contacts are on app', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (getTokens as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([mockContacts[0]]);
      (getContactsDetails as jest.Mock).mockResolvedValue([mockContacts[0]]);
      await waitFor(() => {
        renderContactScreen();
      });
      await waitFor(() => {
        fireEvent.press(screen.getByText('Invite to SmartChat'));
      });
      await waitFor(() => {
        fireEvent.press(screen.getByText('Invite to SmartChat'));
      });

      await waitFor(() => {
        expect(screen.getByText('All your contacts are on SmartChat. Continue your conversations with them')).toBeTruthy();
      });
    });
});
