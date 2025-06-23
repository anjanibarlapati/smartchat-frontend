import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getContactsFromRealm } from '../../realm-database/operations/getContacts.ts';
import { store } from '../../redux/store';
import { Contact } from './Contact';
import { syncContacts } from '../../utils/syncContacts.ts';
import { getRealmInstance } from '../../realm-database/connection.ts';
import { useNavigation } from '@react-navigation/native';

jest.mock('../../utils/syncContacts', () => ({
  syncContacts: jest.fn(),
}));

jest.mock('../../realm-database/connection.ts', () => ({
  getRealmInstance: jest.fn(),
}));

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

jest.mock('../../realm-database/operations/getContacts.ts', () => ({
  getContactsFromRealm: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
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

describe('Contact Screen', () => {
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ reset: mockReset });
  });

  it('displays alert if loading contacts fails', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockImplementation(() => {
      throw new Error('error');
    });

    renderContactScreen();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Something went wrong while fetching contacts details. Please try again'
        )
      ).toBeTruthy();
    });
  });

  it('loads contacts from DB and renders correctly', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      expect(screen.getByText('Anjani')).toBeTruthy();
    });
  });

  it('switches to Invite tab and shows contacts not on app', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      fireEvent.press(screen.getByText('Invite to SmartChat'));
    });

    await waitFor(() => {
      expect(screen.getByText('Anjaniiii')).toBeTruthy();
      expect(screen.queryByText('Anjani')).toBeNull();
    });
  });

  it('switches to Contacts tab and shows contacts on app', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      fireEvent.press(screen.getByText('Contacts on SmartChat'));
    });

    await waitFor(() => {
      expect(screen.getByText('Anjani')).toBeTruthy();
      expect(screen.queryByText('Anjaniiii')).toBeNull();
    });
  });

  it('shows message when no device contacts are available', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue([]);

    renderContactScreen();

    await waitFor(() => {
      expect(
        screen.getByText('Add your friends to contacts and invite them to SmartChat'),
      ).toBeTruthy();
    });
  });

  it('shows message when no contacts are on app in Contacts tab', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue([
      mockContacts[1],
    ]);

    renderContactScreen();

    fireEvent.press(screen.getByText('Contacts on SmartChat'));

    await waitFor(() => {
      expect(
        screen.getByText('Invite your contacts to SmartChat and start your conversations'),
      ).toBeTruthy();
    });
  });

  it('shows message when all contacts are on app in Invite tab', async () => {
    (getRealmInstance as jest.Mock).mockResolvedValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue([
      mockContacts[0],
    ]);

    renderContactScreen();

    fireEvent.press(screen.getByText('Invite to SmartChat'));

    await waitFor(() => {
      expect(
        screen.getByText('All your contacts are on SmartChat. Continue your conversations with them'),
      ).toBeTruthy();
    });
  });

  it('shows warning alert when contact permission is denied during sync', async () => {
    (syncContacts as jest.Mock).mockResolvedValue(false);
    (getRealmInstance as jest.Mock).mockReturnValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      fireEvent.press(screen.getByText('Invite to SmartChat'));
      fireEvent(screen.getByLabelText('contacts-list'), 'refresh');
    });

    await waitFor(() => {
      expect(screen.getByText('Permission for contacts was denied')).toBeTruthy();
    });
  });

  it('syncs contacts successfully and reloads contacts on refresh', async () => {
    (syncContacts as jest.Mock).mockResolvedValue(true);
    (getRealmInstance as jest.Mock).mockReturnValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      fireEvent(screen.getByLabelText('contacts-list'), 'refresh');
    });

    await waitFor(() => {
      expect(syncContacts).toHaveBeenCalled();
      expect(screen.getByText('Anjani')).toBeTruthy();
    });
  });

  it('shows error alert when syncContacts throws an error', async () => {
    (syncContacts as jest.Mock).mockRejectedValue(new Error('Sync failed'));
    (getRealmInstance as jest.Mock).mockReturnValue({});
    (getContactsFromRealm as jest.Mock).mockReturnValue(mockContacts);

    renderContactScreen();

    await waitFor(() => {
      fireEvent(screen.getByLabelText('contacts-list'), 'refresh');
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to sync contacts')).toBeTruthy();
    });
  });

  it('applies styles based on screen width and height', async () => {
    const useWindowDimensions = jest.spyOn(require('react-native'), 'useWindowDimensions');

    useWindowDimensions.mockReturnValue({ width: 800, height: 1600 });
    renderContactScreen();

    const tabContainerLarge = screen.getByLabelText('switch-tabs').parent;
    expect(tabContainerLarge?.props.style.height).toBe('8%');

    useWindowDimensions.mockReturnValue({ width: 10, height: 100 });
    renderContactScreen();

    const tabContainerSmall = screen.getByLabelText('switch-tabs').parent;
    expect(tabContainerSmall?.props.style.height).toBe('7%');
  });
});
