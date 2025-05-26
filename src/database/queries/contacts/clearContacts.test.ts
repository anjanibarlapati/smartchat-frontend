import { clearContacts } from './clearContacts';

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

describe('Contacts table deletion', ()=> {
    test('Should clear contacts table', async()=> {
        await clearContacts(mockDbInstance);
        expect(mockDbInstance.executeSql).toHaveBeenCalledWith('DELETE FROM contacts');
    });
    test('Should throw an error if clearing contacts table fails', async()=> {
        (mockDbInstance.executeSql as jest.Mock).mockRejectedValue(new Error(''));
        await expect(clearContacts(mockDbInstance)).rejects.toThrow('Failed to clear contacts in local DB');
    });
});



