import Realm, { BSON } from 'realm';
import { Contact } from '../../types/Contacts';

export const insertContactsInRealm = (realm: Realm, contacts: Contact[] ) => {
  realm.write(() => {
    contacts.forEach((contact) => {
        realm.create(
          'Contact',
          {
            _id: new BSON.ObjectId(),
            name: contact.name,
            originalNumber: contact.originalNumber,
            mobileNumber: contact.mobileNumber,
            doesHaveAccount: !!contact.doesHaveAccount,
            profilePicture: contact.profilePicture,
          },
        );
      });
  });
};
