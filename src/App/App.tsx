import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { AppNavigator } from '../navigations/AppNavigator.tsx';
import { store } from '../redux/store.ts';
import i18next from 'i18next';
import * as RNLocalize from 'react-native-localize';
import { resources } from '../i18n/i18n.config.ts';



function App(): React.JSX.Element {

  useEffect(() => {
    const locales = RNLocalize.getLocales();
    const languageTag =
      locales.find((locale) => Object.keys(resources).includes(locale.languageCode))?.languageCode || 'en';
      i18next.changeLanguage(languageTag);
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  );
}

export default App;
