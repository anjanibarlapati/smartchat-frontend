import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { app } from './App.ts';

function App(): React.JSX.Element {

  return (
    <View style={app.container}>
      <Text style = {app.text}>Welcome to SmartChat</Text>
    </View>
  );
}

export default App;

