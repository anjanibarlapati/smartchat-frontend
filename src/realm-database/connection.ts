import { Realm } from 'realm';
import { realmConfig } from '../contexts/RealmContext';

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

export async function deleteAllRealmData() {
    if (!realmInstance.isClosed) {
      realmInstance.close();
    }
    Realm.deleteFile(realmConfig);
}
