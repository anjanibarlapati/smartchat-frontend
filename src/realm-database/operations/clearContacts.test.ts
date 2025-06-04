import Realm from 'realm';
import { clearAllContactsInRealm } from './clearContacts';

jest.mock('realm');

describe('Clear all contacts in realm db', () => {
  let mockRealm: Partial<Realm>;
  const mockWrite = jest.fn((fn) => fn());
  const mockObjects = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      write: mockWrite,
      objects: mockObjects,
      delete: mockDelete,
    };
  });

  it('should clear all contacts from Realm', () => {
    const mockContcts = [{ id: '1', name: 'Anjani', originalNumber: '8639523822', mobileNUmber:'+91 86395 23822', profilePicture:'' },
          {id: '1', name: 'Anjaniiii', originalNumber: '8639523823', mobileNUmber:'+91 86395 23823', profilePicture:'' },
        ];

    mockObjects.mockReturnValue(mockContcts);

    clearAllContactsInRealm(mockRealm as Realm);

    expect(mockRealm.write).toHaveBeenCalled();
    expect(mockObjects).toHaveBeenCalledWith('Contact');
    expect(mockDelete).toHaveBeenCalledWith(mockContcts);
  });
});
