import { createContactsTable } from './contacts';

jest.mock('react-native-sqlite-storage', () => {
  return {
    enablePromise: jest.fn(),
    DEBUG: jest.fn(),
    openDatabase: jest.fn(),
  };
});

const mockDbInstance = {
  dbname: 'smartchat.db',
  close: jest.fn(),
  transaction: jest.fn(),
  readTransaction: jest.fn(),
  executeSql: jest.fn(),
  attach: jest.fn(),
  detach: jest.fn(),
};

describe('Contacts table creation', ()=> {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  const query = `
      CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          originalNumber TEXT,
          mobileNumber TEXT,
          profilePicture TEXT,
          doesHaveAccount INTEGER,
          UNIQUE(name, mobileNumber)
      );
  `;
    test('Should create contacts table', async()=> {
        await createContactsTable(mockDbInstance);
        expect(mockDbInstance.executeSql).toHaveBeenCalledWith(query);
    });
    test('Should throw an error if creating contacts table fails', async()=> {
        (mockDbInstance.executeSql as jest.Mock).mockRejectedValue(new Error(''));
        await expect(createContactsTable(mockDbInstance)).rejects.toThrow('Failed to create contact table');
    });
});

