import React from 'react';
import { Provider } from 'react-redux';
import { AppNavigator } from '../navigations/AppNavigator.tsx';
import { store } from '../redux/store.ts';


function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  );
}

export default App;
