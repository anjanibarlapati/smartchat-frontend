import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import Contacts from 'react-native-contacts';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { requestPermission } from '../../permissions/permissions';
import { store } from '../../redux/store';
import { Contact as ContactType } from '../../types/Contacts.ts';
import { getContactsDetails } from '../../utils/getContactsDetails';
import { getTokens } from '../../utils/getTokens.ts';
import { Contact } from './Contact';
import { clearAllContactsInRealm } from '../../realm-database/operations/clearContacts.ts';
import { getRealmInstance } from '../../realm-database/connection.ts';
import { getContactsFromRealm } from '../../realm-database/operations/getContacts.ts';
import { insertContactsInRealm } from '../../realm-database/operations/insertContacts.ts';

jest.mock('../../realm-database/connection.ts', () => ({
  getRealmInstance: jest.fn(),
}));

jest.mock('../../realm-database/operations/clearContacts.ts', () => ({
  clearAllContactsInRealm: jest.fn(),
}));

jest.mock('../../realm-database/operations/getContacts.ts', () => ({
  getContactsFromRealm: jest.fn(),
}));

jest.mock('../../realm-database/operations/insertContacts.ts', () => ({
  insertContactsInRealm: jest.fn(),
}));

jest.mock('react-native-contacts', () => ({
  getAll: jest.fn(),
}));

jest.mock('../../utils/getContactsDetails.ts', () => ({
  getContactsDetails: jest.fn(),
}));

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

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


jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

const mockContacts = [
  {
    name: 'Anjani',
    originalNumber: '8639523822',
    mobileNumber: '+91 86395 23822',
    doesHaveAccount: true,
    profilePicture: '/image.jpg',
  },
  {
    name: 'Anjaniiii',
    originalNumber: '8639523823',
    mobileNumber: '+91 86395 23823',
    doesHaveAccount: false,
    profilePicture: null,
  },
];

const renderContactScreen = () => {
  return render(
    <Provider store={store}>
      <Contact />
    </Provider>,
  );
};

const mockFunctions = (netStatus: boolean, contacts: ContactType[]) => {
  (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: netStatus});
  (Contacts.getAll as jest.Mock).mockResolvedValue(contacts);
  (getContactsDetails as jest.Mock).mockReturnValue(contacts);
  (getRealmInstance as jest.Mock).mockReturnValue({});
  (insertContactsInRealm as jest.Mock).mockReturnValue({});
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
      expect(
        screen.getByText('Permission for contacts was denied'),
      ).toBeTruthy();
    });
  });

  it('should display alert if loading contacts from device fails', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'mock_token'}),
    );
    (Contacts.getAll as jest.Mock).mockRejectedValue(
      new Error('Could not load contacts.'),
    );
    await waitFor(() => {
      renderContactScreen();
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          `Something went wrong while fetching contacts details. Please try again`,
        ),
      ).toBeTruthy();
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
    });
  });

  it('should load contacts from DB when user is offline', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({isConnected: false});
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue({access_token: 'access_token'});
    (getRealmInstance as jest.Mock).mockReturnValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    await waitFor(() => {
      renderContactScreen();
    });
    waitFor(()=>{
      expect(screen.getByText('Anjani')).toBeTruthy();
    });
  });

  it('should switch to Invite tab and show contacts who are not on app', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'access_token'}),
    );
    mockFunctions(true, mockContacts);
    await waitFor(() => {
      renderContactScreen();
    });
    await waitFor(() => {
      fireEvent.press(screen.getByText('Invite to SmartChat'));
    });
    await waitFor(() => {
      expect(screen.getByText('Anjaniiii')).toBeTruthy();
      expect(screen.queryByText('Anjani')).toBeNull();
    });
  });

  it('should switch to Contacts tab and show contacts who are on app', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'access_token'}),
    );
    mockFunctions(true, mockContacts);
    await waitFor(() => {
      renderContactScreen();
    });
    await waitFor(() => {
      fireEvent.press(screen.getByText('Contacts on SmartChat'));
    });
    await waitFor(() => {
      expect(screen.getByText('Anjani')).toBeTruthy();
      expect(screen.queryByText('Anjaniiii')).toBeNull();
    });
  });

  it('should show a message when no device contacts are available', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'access_token'}),
    );
    (clearAllContactsInRealm as jest.Mock).mockReturnValue({});
    mockFunctions(true, []);
    await waitFor(() => {
      renderContactScreen();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Add your friends to contacts and invite them to SmartChat',
        ),
      ).toBeTruthy();
    });
  });

  it('should show a message when no contacts are on app in contacts tab', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'access_token'}),
    );
    mockFunctions(true, [mockContacts[1]]);
    await waitFor(() => {
      renderContactScreen();
    });
    await waitFor(() => {
      fireEvent.press(screen.getByText('Contacts on SmartChat'));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Invite your contacts to SmartChat and start your conversations',
        ),
      ).toBeTruthy();
    });
  });

  it('should show a message when all contacts are on app in invite tab', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (getTokens as jest.Mock).mockResolvedValue(
      JSON.stringify({access_token: 'access_token'}),
    );
    mockFunctions(true, [mockContacts[0]]);
    await waitFor(() => {
      renderContactScreen();
    });
    await waitFor(() => {
      fireEvent.press(screen.getByText('Invite to SmartChat'));
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          'All your contacts are on SmartChat. Continue your conversations with them',
        ),
      ).toBeTruthy();
    });
  });
  it('Should apply styles based on the width of the screen', async () => {
    await waitFor(() => {
      renderContactScreen();
    });
    const switchtabContainer = screen.getByLabelText('switch-tabs').parent;
    expect(switchtabContainer?.props.style.height).toBe('8%');
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    await waitFor(() => {
      renderContactScreen();
    });
    const smallSwitchtabContainer = screen.getByLabelText('switch-tabs').parent;
    expect(smallSwitchtabContainer?.props.style.height).toBe('7%');
  });
});
