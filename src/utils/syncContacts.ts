import { getTokens } from './getTokens';
import NetInfo from '@react-native-community/netinfo';
import { clearAllContactsInRealm } from '../realm-database/operations/clearContacts';
import Contacts from 'react-native-contacts';
import { insertContactsInRealm } from '../realm-database/operations/insertContacts';
import { getContactsDetails } from './getContactsDetails';
import { requestPermission } from '../permissions/permissions';
import { getRealmInstance } from '../realm-database/connection';

export const syncContacts = async (mobileNumber: string, shouldSync?: boolean)=>{
    try{
        const realm =  getRealmInstance();
        const hasPermission = await requestPermission('contacts');
        if (!hasPermission) {
          return false;
        }
        const netState = await NetInfo.fetch();
        const isOnline = netState.isConnected;
        if (!isOnline) {
          return;
        }
        const tokens = await getTokens(mobileNumber);
        const deviceContacts = await Contacts.getAll();
        if (!deviceContacts || deviceContacts.length === 0) {
          clearAllContactsInRealm(realm);
          return;
        }
        const resultantContacts = await getContactsDetails(deviceContacts, tokens.access_token, shouldSync);
        if(resultantContacts.length !== 0 ) {
            clearAllContactsInRealm(realm);
            insertContactsInRealm(realm, resultantContacts);
        }

    } catch(error:any){
        throw error;
    }
};
