import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Contact } from '../../../types/Contacts';

export const insertOrReplaceContacts = async (db: SQLiteDatabase, contacts: Contact[]) => {
  const insertOrReplaceQuery = `
    INSERT OR REPLACE INTO contacts
    (name, originalNumber, mobileNumber, doesHaveAccount, profilePicture)
    VALUES (?, ?, ?, ?, ?);
  `;

  try {
    await db.transaction((transaction) => {
      contacts.forEach((contact) => {
        transaction.executeSql(insertOrReplaceQuery, [
          contact.name,
          contact.originalNumber,
          contact.mobileNumber,
          contact.doesHaveAccount ? 1 : 0,
          contact.profilePicture ?? null,
        ]);
      });
    });
  } catch (error) {
    throw new Error('Failed to insert or update contacts');
  }
};
