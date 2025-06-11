import Realm from 'realm';
import { Contact } from '../../types/Contacts';
import { insertContactsInRealm } from './insertContacts';

jest.mock('realm', () => {
  return {
    BSON: {
      ObjectId: jest.fn(() => 'mocked-object-id'),
    },
  };
});


describe('insertContactsInRealm', () => {
  let mockRealm: Partial<Realm>;
  const mockWrite = jest.fn((fn) => fn());
  const mockCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      write: mockWrite,
      create: mockCreate,
    };
  });

  it('should insert each contact into Realm', () => {
    const mockContacts: Contact[] = [
      {
        name: 'Anjani',
        originalNumber: '8639523822',
        mobileNumber: '+91 86395 23822',
        doesHaveAccount: true,
        profilePicture: 'image.png',
      },
      {
        name: 'Anjani B',
        originalNumber: '9999999999',
        mobileNumber: '+91 99999 99999',
        doesHaveAccount: false,
        profilePicture: null,
      },
    ];

    insertContactsInRealm(mockRealm as Realm, mockContacts);

    expect(mockRealm.write).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith('Contact', expect.objectContaining({
      name: 'Anjani',
      originalNumber: '8639523822',
      mobileNumber: '+91 86395 23822',
      doesHaveAccount: true,
      profilePicture: 'image.png',
    }));
    expect(mockCreate).toHaveBeenCalledWith('Contact', expect.objectContaining({
      name: 'Anjani B',
      originalNumber: '9999999999',
      mobileNumber: '+91 99999 99999',
      doesHaveAccount: false,
      profilePicture: null,
    }));

  });
});
