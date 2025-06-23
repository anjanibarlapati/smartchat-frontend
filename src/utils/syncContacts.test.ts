import { syncContacts } from './syncContacts';
import { getTokens } from './getTokens';
import NetInfo from '@react-native-community/netinfo';
import { clearAllContactsInRealm } from '../realm-database/operations/clearContacts';
import Contacts from 'react-native-contacts';
import { insertContactsInRealm } from '../realm-database/operations/insertContacts';
import { getContactsDetails } from './getContactsDetails';
import { requestPermission } from '../permissions/permissions';
import { getRealmInstance } from '../realm-database/connection';
import { Contact as ContactType } from '../types/Contacts';

jest.mock('./getTokens');
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
jest.mock('../realm-database/operations/clearContacts');
jest.mock('react-native-contacts');
jest.mock('../realm-database/operations/insertContacts');
jest.mock('./getContactsDetails');
jest.mock('../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));
jest.mock('../realm-database/connection');


jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockRealm = { mocked: 'realm' };
(getRealmInstance as jest.Mock).mockResolvedValue(mockRealm);

describe('Sync Contacts', () => {
  const mobileNumber = '9876543210';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false if contact permission is not granted', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(false);
    const result = await syncContacts(mobileNumber);
    expect(result).toBe(false);
    expect(requestPermission).toHaveBeenCalledWith('contacts');
  });

  it('should return early if device is offline', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

    const result = await syncContacts(mobileNumber);
    expect(result).toBeUndefined();
    expect(NetInfo.fetch).toHaveBeenCalled();
    expect(getTokens).not.toHaveBeenCalled();
  });

  it('should clear realm contacts if device has no contacts', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });
    (Contacts.getAll as jest.Mock).mockResolvedValue([]);

    await syncContacts(mobileNumber);

    expect(clearAllContactsInRealm).toHaveBeenCalledWith(mockRealm);
    expect(insertContactsInRealm).not.toHaveBeenCalled();
  });

  it('should not insert contacts if resultantContacts is empty', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });

    const mockDeviceContacts = [
      { recordID: '1', givenName: 'John', familyName: 'Doe', phoneNumbers: [{ number: '1234567890' }] },
    ];
    (Contacts.getAll as jest.Mock).mockResolvedValue(mockDeviceContacts);
    (getContactsDetails as jest.Mock).mockResolvedValue([]);

    await syncContacts(mobileNumber);

    expect(getContactsDetails).toHaveBeenCalledWith(mockDeviceContacts, 'mock-token', undefined);
    expect(clearAllContactsInRealm).not.toHaveBeenCalled();
    expect(insertContactsInRealm).not.toHaveBeenCalled();
  });

  it('should clear and insert contacts if resultantContacts is not empty', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (getTokens as jest.Mock).mockResolvedValue({ access_token: 'mock-token' });

    const mockDeviceContacts = [
      { recordID: '1', givenName: 'John', familyName: 'Doe', phoneNumbers: [{ number: '1234567890' }] },
    ];
    const mockResultantContacts: ContactType[] = [
      {
        name: 'John Doe',
        originalNumber: '1234567890',
        mobileNumber: '+91 12345 67890',
        doesHaveAccount: true,
        profilePicture: 'pic.jpg',
      },
    ];

    (Contacts.getAll as jest.Mock).mockResolvedValue(mockDeviceContacts);
    (getContactsDetails as jest.Mock).mockResolvedValue(mockResultantContacts);

    await syncContacts(mobileNumber, true);

    expect(getContactsDetails).toHaveBeenCalledWith(mockDeviceContacts, 'mock-token', true);
    expect(clearAllContactsInRealm).toHaveBeenCalledWith(mockRealm);
    expect(insertContactsInRealm).toHaveBeenCalledWith(mockRealm, mockResultantContacts);
  });

  it('should throw error if any operation fails', async () => {
    (requestPermission as jest.Mock).mockRejectedValue(new Error('Permission error'));
    await expect(syncContacts(mobileNumber)).rejects.toThrow('Permission error');
  });
});
