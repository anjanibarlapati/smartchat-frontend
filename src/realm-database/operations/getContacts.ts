import Realm from 'realm';
import { Contact } from '../schemas/Contact';

export const getContactsFromRealm = (realm: Realm) => {
  const contacts = realm.objects<Contact>('Contact').sorted('name');
  return contacts.map(contact => ({
    id: contact._id.toString(),
    name: contact.name,
    originalNumber: contact.originalNumber,
    mobileNumber: contact.mobileNumber,
    profilePicture: contact.profilePicture,
    doesHaveAccount: contact.doesHaveAccount,
  }));
};
