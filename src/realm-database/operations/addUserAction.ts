
import Realm, { BSON } from 'realm';
import { SyncActionType } from '../../utils/syncPendingActions';
import { UserAction } from '../schemas/UserAction';


export const addUserAction = (
    realm: Realm,
    type: SyncActionType,
    payload: Record<string, any>
) => {

    realm.write(() => {
        realm.create<UserAction>('UserAction', {
            _id: new BSON.ObjectId(),
            type: type,
            payload: payload,
            createdAt: new Date(),
            status: 'pending',
        });
    });
    console.log('sync action added');
};

