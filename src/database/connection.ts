import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

let dbInstance: SQLite.SQLiteDatabase;

export const getDBConnection = async () => {
  try {
    dbInstance = await SQLite.openDatabase({
      name: 'smartchat.db',
      location: 'default',
    });
  } catch (error) {
    throw new Error('Failed to open database');
  }
};

export const getDBinstance = async() => {
  return dbInstance;
};

export const closeConnection = async () => {
    try{
    return await dbInstance.close();
  } catch(error){
    throw new Error('Failed to close database');
  }
};

export const deleteDatabase = async()=> {
  try{
      await closeConnection();
      await SQLite.deleteDatabase({ name: 'smartchat.db', location: 'default' });
  }catch(error) {
      throw new Error('Failed to delete database');
  }
};
