import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {View} from 'react-native';
import {app} from './App.styles.ts';
import WelcomeScreen from '../screens/Welcome/Welcome.tsx';

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={app.container}>
      <WelcomeScreen />
    </View>
  );
}

export default App;
