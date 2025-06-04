import { createRealmContext } from '@realm/react';
import { Chat } from '../realm-database/schemas/Chat';
import { Message } from '../realm-database/schemas/Message';
import { Contact } from '../realm-database/schemas/Contact';


export const realmConfig: Realm.Configuration = {
  schema: [Chat, Message, Contact],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
};

export const { RealmProvider, useRealm, useQuery } = createRealmContext(realmConfig);


