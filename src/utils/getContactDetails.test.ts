import { getContactsDetails } from './getContactsDetails';
import { Contact as ContactType } from '../types/Contacts';
import { Contact } from 'react-native-contacts';
import { fetchContacts } from '../screens/Contact/Contact.service';

jest.mock('../screens/Contact/Contact.service', () => {
  const originalModule = jest.requireActual('../screens/Contact/Contact.service');
  return {
    ...originalModule,
    fetchContacts: jest.fn(),
  };
});

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'IN'),
}));

const mockFetchContacts = fetchContacts as jest.Mock;
const mockAccessToken = 'test-access-token';

describe('getContactsDetails', () => {
  const mockContacts: Contact[] = [
    {
      recordID: '2',
      givenName: 'Rekha',
      middleName: 'hii',
      familyName: 'Korepu',
      phoneNumbers: [{ id: '4', label: 'Mobile', number: '+91 8639523822' }],
    } as unknown as Contact,
    {
      recordID: '3',
      givenName: 'Anush',
      middleName: '',
      familyName: '',
      phoneNumbers: [{ id: '6', label: 'Mobile', number: '+91 9849545903' }],
    } as unknown as Contact,
    {
      recordID: '4',
      givenName: 'Anjani',
      middleName: '',
      familyName: '',
      phoneNumbers: [{ id: '6', label: 'Mobile', number: '' }],
    } as unknown as Contact,
    {
      recordID: '5',
      givenName: 'Anjaniii',
      middleName: '',
      familyName: '',
      phoneNumbers: [{ id: '6', label: 'Mobile', number: '+91 12345' }],
    } as unknown as Contact,
  ];

  const mockResponseData = [
    {
      mobileNumber: '+91 86395 23822',
      doesHaveAccount: true,
      profilePicture: 'smartchatpic1.jpg',
    },
    {
      mobileNumber: '+91 98495 45903',
      doesHaveAccount: false,
      profilePicture: null,
    },
  ];

  beforeEach(() => {
    mockFetchContacts.mockReset();
  });

  it('should throw an error if fetching contact details', async () => {
    mockFetchContacts.mockRejectedValue(new Error('Something went wrong'));
    await expect(getContactsDetails(mockContacts, mockAccessToken)).rejects.toThrow(
      'Something went wrong while fetching contacts details'
    );
  });

  it('should return account details and profile picture if contact is registered', async () => {
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const result: ContactType[] = await getContactsDetails(mockContacts, mockAccessToken);

    expect(mockFetchContacts).toHaveBeenCalledWith(
      ['+91 86395 23822', '+91 98495 45903'],
      mockAccessToken
    );

    expect(result).toEqual([
      {
        name: 'Rekha hii Korepu',
        mobileNumber: '+91 8639523822',
        doesHaveAccount: true,
        profilePicture: 'smartchatpic1.jpg',
      },
      {
        name: 'Anush',
        mobileNumber: '+91 9849545903',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anjani',
        mobileNumber: '',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anjaniii',
        mobileNumber: '+91 12345',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ]);
  });

  it('should return same values when no match is found in the response', async () => {
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    const result: ContactType[] = await getContactsDetails(mockContacts, mockAccessToken);

    expect(mockFetchContacts).toHaveBeenCalledWith(
      ['+91 86395 23822', '+91 98495 45903'],
      mockAccessToken
    );

    expect(result).toEqual([
      {
        name: 'Rekha hii Korepu',
        mobileNumber: '+91 8639523822',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anush',
        mobileNumber: '+91 9849545903',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anjani',
        mobileNumber: '',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anjaniii',
        mobileNumber: '+91 12345',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ]);
  });
});
