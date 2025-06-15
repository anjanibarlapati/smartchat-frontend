import React, { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { RealmResetProvider, useRealm } from '../contexts/RealmContext.tsx';
import { resources } from '../i18n/i18n.config.ts';
import { AppNavigator } from '../navigations/AppNavigator.tsx';
import { setRealmInstance } from '../realm-database/connection.ts';
import { store } from '../redux/store.ts';
import { initNotifications } from '../utils/localNotifications.ts';


function RealmSetupWrapper() {
  const realm = useRealm();

  useEffect(() => {
    setRealmInstance(realm);
  }, [realm]);

  return <AppNavigator />;
}

function App(): React.JSX.Element {
  useEffect(() => {
    const locales = RNLocalize.getLocales();
    const languageTag =
      locales.find(locale =>
        Object.keys(resources).includes(locale.languageCode),
      )?.languageCode || 'en';
    i18next.changeLanguage(languageTag);
  }, []);
  useEffect(() => {
    initNotifications();
  }, []);

  return (
    <Provider store={store}>
      <RealmResetProvider>
        <RealmSetupWrapper/>
      </RealmResetProvider>
    </Provider>
  );
}

export default App;
