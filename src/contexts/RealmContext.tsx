import { createContext, ReactNode, useContext, useState } from 'react';
import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import { deleteAllRealmData } from '../realm-database/connection';
import { Chat } from '../realm-database/schemas/Chat';
import { Contact } from '../realm-database/schemas/Contact';
import { Message } from '../realm-database/schemas/Message';


export const realmConfig: Realm.Configuration = {
  schema: [Chat, Message, Contact],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
};

const { RealmProvider, useRealm, useQuery } = createRealmContext(realmConfig);

const RealmResetContext = createContext({ resetRealm: () => {} });

export function RealmResetProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const [realmKey, setRealmKey] = useState<number>(0);
    const resetRealm = () => {
      deleteAllRealmData();
      setRealmKey(previousKey => previousKey + 1);
    };

    return (
      <RealmResetContext.Provider value={{ resetRealm }}>
        <RealmProvider key={realmKey}>
          {children}
        </RealmProvider>
      </RealmResetContext.Provider>
    );
}

export const useRealmReset = () => useContext(RealmResetContext);
export { useQuery, useRealm };

