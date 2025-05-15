import {getContactsDetails} from './getContactsDetails';
import {Contact as ContactType} from '../types/Contacts';
import {Contact} from 'react-native-contacts';
import {fetchContacts} from '../screens/Contact/Contact.service';

jest.mock('../screens/Contact/Contact.service', () => {
  const originalModule = jest.requireActual(
    '../screens/Contact/Contact.service',
  );
  return {
    ...originalModule,
    fetchContacts: jest.fn(),
  };
});

const mockFetchContacts = fetchContacts as jest.Mock;
const mockAccessToken = 'test-access-token';

describe('test getContactsDetails functionality', () => {
  const mockContacts: Contact[] = [
    {
      recordID: '2',
      givenName: 'Rekha',
      middleName: 'hii',
      familyName: 'Korepu',
      phoneNumbers: [{id: '4', label: 'Mobile', number: '+91 86395 23822'}],
    } as unknown as Contact,
    {
      recordID: '3',
      givenName: 'Anush',
      middleName: '',
      familyName: '',
      phoneNumbers: [{id: '6', label: 'Mobile', number: '+91 98495 45903'}],
    } as unknown as Contact,
  ];

  const mockResponseData = [
    {
      mobileNumber: '8639523822',
      doesHaveAccount: true,
      profilePicture: 'smartchatpic1.jpg',
    },
    {
      mobileNumber: '9849545903',
      doesHaveAccount: false,
      profilePicture: null,
    },
  ];

  beforeEach(() => {
    mockFetchContacts.mockReset();
  });

  it('should return account details and profile picture if contact is registered', async () => {
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const result: ContactType[] = await getContactsDetails(
      mockContacts,
      mockAccessToken,
    );

    expect(mockFetchContacts).toHaveBeenCalledWith(
      ['8639523822', '9849545903'],
      mockAccessToken,
    );

    expect(result).toEqual([
      {
        name: 'Rekha hii Korepu',
        mobileNumber: '8639523822',
        doesHaveAccount: true,
        profilePicture: 'smartchatpic1.jpg',
      },
      {
        name: 'Anush',
        mobileNumber: '9849545903',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ]);
  });

  it('should return same values when no match is found in the response', async () => {
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    const result: ContactType[] = await getContactsDetails(
      mockContacts,
      mockAccessToken,
    );

    expect(result).toEqual([
      {
        name: 'Rekha hii Korepu',
        mobileNumber: '8639523822',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anush',
        mobileNumber: '9849545903',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ]);
  });
});
