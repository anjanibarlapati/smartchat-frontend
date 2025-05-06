import { app } from './App.ts';
import React from 'react';
import { View } from 'react-native';
import LoadingScreen from '../screens/Loading/LoadingScreen.tsx';

function App(): React.JSX.Element {

  return (
    <View style={app.container}>
      <LoadingScreen/>
    </View>
  );
}

export default App;

