import SQLite from 'react-native-sqlite-storage';

export const clearContacts = async (db: SQLite.SQLiteDatabase) => {
    try{
        await db.executeSql('DELETE FROM contacts');
    } catch(error){
        throw new Error('Failed to clear contacts in local DB');
    }
};
