import { Realm } from 'realm';

let realmInstance: Realm;

export const setRealmInstance = (realm: Realm) => {
  realmInstance = realm;
};

export const getRealmInstance = (): Realm => {
  if (!realmInstance) {
    throw new Error('Realm instance is not set');
  }
  return realmInstance;
};

export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
  }
};
