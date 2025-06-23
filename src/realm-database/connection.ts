import { Realm } from 'realm';
import { realmConfig } from '../contexts/RealmContext';

let realmInstance: Realm;

export const setRealmInstance = (realm: Realm) => {
      realmInstance = realm;
};

export const getRealmInstance = async (): Promise<Realm> => {
  if(!realmInstance || realmInstance.isClosed){
    realmInstance = await Realm.open(realmConfig);
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
