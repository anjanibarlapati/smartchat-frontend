import Realm from 'realm';
import { getContactsFromRealm } from './getContacts';

jest.mock('realm');

describe('getContactsFromRealm', () => {
  let mockRealm: Partial<Realm>;
  const mockSorted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      objects: jest.fn().mockReturnValue({
        sorted: mockSorted,
      }),
    };
  });

  it('should return mapped and sorted contacts', () => {
    const mockContacts = [
      {
        _id: '1',
        name: 'Anjani',
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        profilePicture: '',
        doesHaveAccount: true,
      },
      {
        _id: '2',
        name: 'Anjaniii',
        originalNumber: '8639523823',
        mobileNumber: '+91 86395 23823',
        profilePicture: '',
        doesHaveAccount: false,
      },
    ];

    mockSorted.mockReturnValue(mockContacts);

    const result = getContactsFromRealm(mockRealm as Realm);

    expect(mockRealm.objects).toHaveBeenCalledWith('Contact');
    expect(mockSorted).toHaveBeenCalledWith('name');
    expect(result).toEqual([
      {
        id: '1',
        name: 'Anjani',
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        profilePicture: '',
        doesHaveAccount: true,
      },
      {
        id: '2',
        name: 'Anjaniii',
        originalNumber: '8639523823',
        mobileNumber: '+91 86395 23823',
        profilePicture: '',
        doesHaveAccount: false,
      },
    ]);
  });
});
