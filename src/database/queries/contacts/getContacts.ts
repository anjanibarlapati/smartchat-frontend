import SQLite from 'react-native-sqlite-storage';
import { Contact } from '../../../types/Contacts';

export const getContacts = async (db: SQLite.SQLiteDatabase) => {
    try{
        const [results] = await db.executeSql('SELECT * FROM contacts');
        const contacts: Contact[] =  results.rows.raw().map(contact => ({
            name: contact.name,
            originalNumber: contact.originalNumber,
            mobileNumber: contact.mobileNumber,
            doesHaveAccount: !!contact.doesHaveAccount,
            profilePicture: contact.profilePicture,
        }));
        return contacts;
    } catch(error) {
        throw new Error('Failed to fetch contacts from local DB');
    }

};
