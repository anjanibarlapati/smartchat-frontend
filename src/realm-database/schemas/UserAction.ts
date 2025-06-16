import Realm from 'realm';
export class UserAction extends Realm.Object<UserAction> {
  _id!: Realm.BSON.ObjectId;
  type!: string;
  payload!: Realm.Types.Mixed;
  createdAt!: Date;
  status!: string;

  static schema: Realm.ObjectSchema = {
    name: 'UserAction',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      type: 'string',
      payload: 'mixed',
      createdAt: 'date',
      status: 'string',
    },
  };
}
