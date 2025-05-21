import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import {Tabs} from './tabs/Tabs.tsx';
import WelcomeScreen from '../screens/Welcome/Welcome.tsx';
import Registration from '../screens/Registration/Registration.tsx';
import Login from '../screens/Login/Login.tsx';
import {RootStackParamList} from '../types/Navigations.ts';
import {setUserDetails} from '../redux/reducers/user.reducer.ts';
import {checkAccessToken} from '../utils/checkToken.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const [isUserStored, setIsUserStored] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        await checkAccessToken();
        const storedUser = await EncryptedStorage.getItem('User Data');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(setUserDetails(user));
          setIsUserStored(false);
        }
      } catch (error) {
        Alert.alert('Failed to load user from storage');
      } finally {
        setIsReady(true);
        SplashScreen.hide();
      }
    };
    loadUser();
  }, [dispatch]);

  if (!isReady) {
    return <></>;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isUserStored ? 'Tabs' : 'WelcomeScreen'}
        screenOptions={{headerShown: false}}>
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{headerShown: false}}
          />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="RegistrationScreen" component={Registration} />
          <Stack.Screen name="LoginScreen" component={Login} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
