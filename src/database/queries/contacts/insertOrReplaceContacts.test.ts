import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { insertOrReplaceContacts } from './insertOrReplaceContacts';


jest.mock('react-native-sqlite-storage', () => {
  return {
    enablePromise: jest.fn(),
    DEBUG: jest.fn(),
    openDatabase: jest.fn(),
  };
});
const mockExecuteSql = jest.fn();

const mockTransaction = jest.fn((callback: any) => {
  return Promise.resolve(callback({ executeSql: mockExecuteSql }));
});
const mockDbInstance: SQLiteDatabase = {
  dbname: 'smartchat.db',
  close: jest.fn(),
  transaction: mockTransaction,
  readTransaction: jest.fn(),
  executeSql: jest.fn(),
  attach: jest.fn(),
  detach: jest.fn(),
};
const mockContacts = [
    {
        doesHaveAccount: true,
        mobileNumber: '+91 86395 23822',
        name: 'Anjani Barlapati',
        originalNumber: '+91 86395 23822',
        profilePicture: null,
    },
    {
        doesHaveAccount: false,
        mobileNumber: '+91 86395 23833',
        name: 'Anjani',
        originalNumber: '+91 86395 23833',
        profilePicture: null,
    },
];
  const insertOrReplaceQuery = `
    INSERT OR REPLACE INTO contacts
    (name, originalNumber, mobileNumber, doesHaveAccount, profilePicture)
    VALUES (?, ?, ?, ?, ?);
  `;

describe('Insert or replace contacts data in contacts table', ()=> {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('Should insert or replace contacts in contacts table', async()=> {

        await insertOrReplaceContacts(mockDbInstance, mockContacts);
        expect(mockTransaction).toHaveBeenCalledTimes(1);
        expect(mockExecuteSql).toHaveBeenCalledTimes(mockContacts.length);
        expect(mockExecuteSql).toHaveBeenCalledWith(insertOrReplaceQuery, [
          mockContacts[0].name,
          mockContacts[0].originalNumber,
          mockContacts[0].mobileNumber,
          1,
          null,
        ]);
        expect(mockExecuteSql).toHaveBeenCalledWith(insertOrReplaceQuery, [
          mockContacts[1].name,
          mockContacts[1].originalNumber,
          mockContacts[1].mobileNumber,
          0,
          null,
        ]);
    });
    test('Should throw an error if inserting or rep lacing contacts in contacts table fails', async()=> {
        mockExecuteSql.mockImplementation(() => { throw new Error('SQL error'); });
        await expect(insertOrReplaceContacts(mockDbInstance, mockContacts)).rejects.toThrow('Failed to insert or update contacts');
    });
});

