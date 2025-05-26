import SQLite from 'react-native-sqlite-storage';


export const createContactsTable = async (db: SQLite.SQLiteDatabase) => {
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
  try{
      await db.executeSql(query);
  } catch(error) {
    throw Error('Failed to create contact table');
  }
};



