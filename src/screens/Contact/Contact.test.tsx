import {fireEvent, render, waitFor} from '@testing-library/react-native';
import './Contact';
import {Contact} from './Contact';
import {store} from '../../redux/store';
import {Provider} from 'react-redux';
import { requestPermission } from '../../permissions/permissions';
import EncryptedStorage from 'react-native-encrypted-storage';
import Contacts from 'react-native-contacts';
import { getContactsDetails } from '../../utils/getContactsDetails';
import { Alert } from 'react-native';

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



jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

const mockContacts = [
  { name: 'Anjani', mobileNumber: '8639523822', doesHaveAccount: true, profilePicture: '/image.jpg' },
  { name: 'Anj', mobileNumber: '8639523823', doesHaveAccount: false, profilePicture: null},
];


const renderContactScreen = () => {
  return render(
    <Provider store={store}>
        <Contact />
    </Provider>,
  );
};
describe('Contacts Screen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('should display alert if permission is denied', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(false);

      renderContactScreen();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Permission for contacts was denied');
      });
    });


    it('should display alert if loading contacts from device fails', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'mock_token' })
      );
      (Contacts.getAll as jest.Mock).mockRejectedValue(new Error('Could not load contacts.'));

      renderContactScreen();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Something went wrong while loading contacts from device. Please try again'
        );
      });
    });

    it('should display alert if empty tokens are returned from async storage', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

      renderContactScreen();
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Something went wrong while loading contacts from device. Please try again'
        );
      });
    });

    it('should switch to Invite tab and show contacts who are not on app', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue(mockContacts);
      (getContactsDetails as jest.Mock).mockResolvedValue(mockContacts);

      const { getByText, queryByText } = renderContactScreen();

      await waitFor(() => {
        fireEvent.press(getByText('Invite to SmartChat'));
      });

      expect(getByText('Anj')).toBeTruthy();
      expect(queryByText('Anjani')).toBeNull();
    });

    it('should switch to Contacts tab and show contacts who are on app', async () => {

      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue(mockContacts);
      (getContactsDetails as jest.Mock).mockResolvedValue(mockContacts);

      const { getByText, queryByText } = renderContactScreen();

      await waitFor(() => {
        fireEvent.press(getByText('Contacts on SmartChat'));
      });

      expect(getByText('Anjani')).toBeTruthy();
      expect(queryByText('Anj')).toBeNull();
    });

    it('should show a message when no device contacts are available', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([]);
      (getContactsDetails as jest.Mock).mockResolvedValue([]);

      const { getByText } = renderContactScreen();

      await waitFor(() => {
        expect(getByText('Add your friends to contacts and invite them to SmartChat')).toBeTruthy();
      });
    });

    it('should show a message when no contacts are on app', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([mockContacts[1]]);
      (getContactsDetails as jest.Mock).mockResolvedValue([mockContacts[1]]);

      const { getByText } = renderContactScreen();
      await waitFor(() => {
        fireEvent.press(getByText('Contacts on SmartChat'));
      });

      await waitFor(() => {
        expect(getByText('Invite your contacts to SmartChat and start your conversations')).toBeTruthy();
      });
    });

    it('should show a message when all contacts are on app', async () => {
      (requestPermission as jest.Mock).mockResolvedValue(true);
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ access_token: 'access_token' })
      );
      (Contacts.getAll as jest.Mock).mockResolvedValue([mockContacts[0]]);
      (getContactsDetails as jest.Mock).mockResolvedValue([mockContacts[0]]);

      const { getByText } = renderContactScreen();
      await waitFor(() => {
        fireEvent.press(getByText('Invite to SmartChat'));
      });

      await waitFor(() => {
        expect(getByText('All your contacts are on SmartChat. Continue your conversations with them')).toBeTruthy();
      });
    });
});
