import SQLite from 'react-native-sqlite-storage';

export const deleteContacts = async (db: SQLite.SQLiteDatabase, currentContacts: string[] ) => {
  const contacts = currentContacts.map(() => '?').join(', ');
  const query = `DELETE FROM contacts WHERE mobileNumber NOT IN (${contacts})`;
  try {
    await db.executeSql(query, currentContacts);
  } catch (error) {
    throw new Error('Failed to delete removed contacts');
  }
};
