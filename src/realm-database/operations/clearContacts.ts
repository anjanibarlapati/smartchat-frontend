import Realm from 'realm';

export const clearAllContactsInRealm = (realm: Realm) => {
  realm.write(() => {
    const allContacts = realm.objects('Contact');
    realm.delete(allContacts);
  });
};
