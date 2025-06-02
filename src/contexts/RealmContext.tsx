import { createRealmContext } from '@realm/react';
import { Chat } from '../realm-database/schemas/Chat';
import { Message } from '../realm-database/schemas/Message';

export const { RealmProvider, useRealm, useQuery } = createRealmContext({
  schema: [Chat, Message],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
});


