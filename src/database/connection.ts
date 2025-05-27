import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);


export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabase({
      name: 'smartchat.db',
      location: 'default',
    });
    return db;
  } catch (error) {
    throw new Error('Failed to open database');
  }
};

export const closeConnection = async (db: SQLite.SQLiteDatabase) => {
    try{
    return await db.close();
  } catch(error){
    throw new Error('Failed to close database');
  }
};

