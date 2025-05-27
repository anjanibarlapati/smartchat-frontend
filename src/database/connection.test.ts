import SQLite from 'react-native-sqlite-storage';
import { closeConnection, deleteDatabase, getDBConnection, getDBinstance } from './connection';

jest.mock('react-native-sqlite-storage', () => {
  return {
    enablePromise: jest.fn(),
    DEBUG: jest.fn(),
    openDatabase: jest.fn(),
    deleteDatabase: jest.fn(),
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

describe('DB Connection', ()=> {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Should return the db instance', async () => {
        (SQLite.openDatabase as jest.Mock).mockResolvedValue(mockDbInstance);
        await getDBConnection();
        expect(SQLite.openDatabase).toHaveBeenCalledWith({
        name: 'smartchat.db',
        location: 'default',
        });
    });
    test('Should throw error if openDatabase fails', async () => {
        (SQLite.openDatabase as jest.Mock).mockRejectedValue(new Error(''));
        await expect(getDBConnection()).rejects.toThrow('Failed to open database');
    });
});


describe('Close DB Connection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Should close the db instance', async () => {
        (mockDbInstance.close as jest.Mock).mockResolvedValue(true);

        const result = await closeConnection(mockDbInstance);

        expect(mockDbInstance.close).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    test('Should throw error if closing of database fails', async () => {
        (mockDbInstance.close as jest.Mock).mockRejectedValue(new Error(''));
        await expect(closeConnection(mockDbInstance)).rejects.toThrow('Failed to close database');
    });
});



describe('DB Instance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Should return the db instance', async () => {
        expect(await getDBinstance()).toBe(mockDbInstance);
    });
});

describe('Delete Database', ()=> {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Should delete the database', async()=> {
        (SQLite.deleteDatabase as jest.Mock).mockResolvedValue({});
        await deleteDatabase();
        expect(SQLite.deleteDatabase).toHaveBeenCalledWith({
        name: 'smartchat.db',
        location: 'default',
        });
    });
    test('Should throw error if deleting database fails', async () => {
        (SQLite.deleteDatabase as jest.Mock).mockRejectedValue(new Error(''));
        await expect(deleteDatabase()).rejects.toThrow('Failed to delete database');
    });
});
