import { Platform } from 'react-native';
import { Contact } from 'react-native-contacts';
import { fetchContacts } from '../screens/Contact/Contact.service';
import { Contact as ContactType } from '../types/Contacts';
import { getContactsDetails } from './getContactsDetails';

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
      recordID: '1',
      backTitle: '',
      company: '',
      department: '',
      displayName: 'Rekha',
      emailAddresses: [],
      familyName: '',
      givenName: 'Rekha',
      hasThumbnail: false,
      isStarred: false,
      jobTitle: '',
      middleName: '',
      note: '',
      phoneNumbers: [{ label: 'mobile', number: '8639523822' }, { label: 'mobile', number: '8639523822' }],
      postalAddresses: [],
      prefix: '',
      suffix: '',
      thumbnailPath: '',
      urlAddresses: [],
      imAddresses: [],
      birthday: undefined,
    },
    {
      recordID: '2',
      backTitle: '',
      company: '',
      department: '',
      displayName: 'Anush',
      emailAddresses: [],
      familyName: '',
      givenName: 'Anush',
      hasThumbnail: false,
      isStarred: false,
      jobTitle: '',
      middleName: '',
      note: '',
      phoneNumbers: [{ label: 'Mobile', number: '9849545903' }],
      postalAddresses: [],
      prefix: '',
      suffix: '',
      thumbnailPath: '',
      urlAddresses: [],
      imAddresses: [],
      birthday: undefined,
    },
    {
      recordID: '3',
      backTitle: '',
      company: '',
      department: '',
      displayName: 'Anjani',
      emailAddresses: [],
      familyName: '',
      givenName: 'Anjani',
      hasThumbnail: false,
      isStarred: false,
      jobTitle: '',
      middleName: '',
      note: '',
      phoneNumbers: [],
      postalAddresses: [],
      prefix: '',
      suffix: '',
      thumbnailPath: '',
      urlAddresses: [],
      imAddresses: [],
      birthday: undefined,
    },
    {
      recordID: '4',
      backTitle: '',
      company: '',
      department: '',
      displayName: 'Anjaniii',
      emailAddresses: [],
      familyName: '',
      givenName: 'Anjaniii',
      hasThumbnail: false,
      isStarred: false,
      jobTitle: '',
      middleName: '',
      note: '',
      phoneNumbers: [{ label: 'Mobile', number: '12345' }],
      postalAddresses: [],
      prefix: '',
      suffix: '',
      thumbnailPath: '',
      urlAddresses: [],
      imAddresses: [],
      birthday: undefined,
    },
  ];


  const mockResponseData = [
    {
      originalNumber: '8639523822',
      mobileNumber: '+91 86395 23822',
      doesHaveAccount: true,
      profilePicture: 'smartchatpic1.jpg',
    },
    {
      originalNumber: '8639523833',
      mobileNumber: '+91 86395 23833',
      doesHaveAccount: true,
      profilePicture: 'smartchatpic1.jpg',
    },
    {
      originalNumber: '9849545903',
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
      ['+91 86395 23822', '+91 86395 23822', '+91 98495 45903'],
      mockAccessToken
    );

    expect(result).toEqual([
      {
        name: 'Anjaniii',
        originalNumber:'12345',
        mobileNumber: '12345',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anush',
        originalNumber: '9849545903',
        mobileNumber: '+91 98495 45903',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Rekha',
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        doesHaveAccount: true,
        profilePicture: 'smartchatpic1.jpg',
      },
    ]);
  });

  it('should return same values when no match is found in the response', async () => {
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    const result: ContactType[] = await getContactsDetails(mockContacts, mockAccessToken);

    expect(mockFetchContacts).toHaveBeenCalledWith(
      ['+91 86395 23822', '+91 86395 23822', '+91 98495 45903'],
      mockAccessToken
    );

    expect(result).toEqual([
      {
        name: 'Anjaniii',
        originalNumber:'12345',
        mobileNumber: '12345',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anush',
        originalNumber: '9849545903',
        mobileNumber: '9849545903',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Rekha',
        originalNumber: '8639523822',
        mobileNumber: '8639523822',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ]);
  });

  it('Should to take only first number from each contact phone numbers for Android', async()=>{
    Platform.OS = 'android';

    const mockAndroidResponseData = [
      {
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        doesHaveAccount: true,
        profilePicture: 'smartchatpic1.jpg',
      },
      {
        originalNumber: '9849545903',
        mobileNumber: '+91 98495 45903',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ];
    mockFetchContacts.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockAndroidResponseData),
    });

    const result: ContactType[] = await getContactsDetails(mockContacts, mockAccessToken);

    expect(mockFetchContacts).toHaveBeenCalledWith(
      ['+91 86395 23822', '+91 98495 45903'],
      mockAccessToken
    );

    expect(result).toEqual([
      {
        name: 'Anjaniii',
        originalNumber:'12345',
        mobileNumber: '12345',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Anush',
        originalNumber: '9849545903',
        mobileNumber: '+91 98495 45903',
        doesHaveAccount: false,
        profilePicture: null,
      },
      {
        name: 'Rekha',
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        doesHaveAccount: true,
        profilePicture: 'smartchatpic1.jpg',
      },
    ]);
  });
});
