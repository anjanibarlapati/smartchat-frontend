import Realm from 'realm';

export class Contact extends Realm.Object<Contact> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  originalNumber!: string;
  mobileNumber!: string;
  profilePicture!: string | null;
  doesHaveAccount!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Contact',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      originalNumber: 'string',
      mobileNumber: 'string',
      profilePicture: 'string?',
      doesHaveAccount: 'bool',
    },
  };
}
