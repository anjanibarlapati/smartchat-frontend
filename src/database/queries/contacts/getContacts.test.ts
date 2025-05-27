import { getContacts } from './getContacts';

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
const mockContacts = [
    {
        doesHaveAccount: 1,
        id: 1,
        mobileNumber: '+91 86395 23822',
        name: 'Anjani Barlapati',
        originalNumber: '+91 86395 23822',
        profilePicture: null,
    },
];

describe('Get contacts data from contacts table', ()=> {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('Should fetch contacts from contacts table', async()=> {
        (mockDbInstance.executeSql as jest.Mock).mockImplementation(()=> { return [{rows:{raw:()=>{return mockContacts;}}}];});
        const result = await getContacts(mockDbInstance);
        expect(mockDbInstance.executeSql).toHaveBeenCalledWith(`SELECT * FROM contacts`);
        expect(result).toEqual([{
            doesHaveAccount: true,
            mobileNumber: '+91 86395 23822',
            name: 'Anjani Barlapati',
            originalNumber: '+91 86395 23822',
            profilePicture: null,
        }]);
    });
    test('Should throw an error if fetching contacts from contacts table fails', async()=> {
        (mockDbInstance.executeSql as jest.Mock).mockRejectedValue(new Error(''));
        await expect(getContacts(mockDbInstance)).rejects.toThrow('Failed to fetch contacts from local DB');
    });
});

