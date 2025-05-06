import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { app } from './App.ts';
import LoadingScreen from '../screens/Loading/LoadingScreen.tsx';

function App(): React.JSX.Element {

  return (
    <View style={app.container}>
      <LoadingScreen/>
    </View>
  );
}

export default App;

