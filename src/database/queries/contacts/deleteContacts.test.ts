import { deleteContacts } from './deleteContacts';

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

describe('Removed contacts deletion in contacts table', ()=> {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const currentContacts = ['+91 8639523822', '+91 8639523833'];
    test('Should delete removed contacts from contacts table', async()=> {
        await deleteContacts(mockDbInstance,currentContacts);
        expect(mockDbInstance.executeSql).toHaveBeenCalledWith(`DELETE FROM contacts WHERE mobileNumber NOT IN (?, ?)`, currentContacts);
    });
    test('Should throw an error if deleting removed contacts from contacts table fails', async()=> {
        (mockDbInstance.executeSql as jest.Mock).mockRejectedValue(new Error(''));
        await expect(deleteContacts(mockDbInstance,currentContacts)).rejects.toThrow('Failed to delete removed contacts');
    });
});



