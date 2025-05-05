import React from 'react';
import { View} from 'react-native';
import {app} from './App.ts';
import WelcomeScreen from '../screens/Welcome/Welcome.tsx';

function App(): React.JSX.Element {
  return (
    <View style={app.container}>
      <WelcomeScreen />
    </View>
  );
}

export default App;
