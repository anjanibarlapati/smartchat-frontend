import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import { CustomeAlert } from '../components/CustomAlert/CustomAlert.tsx';
import { getDBConnection, getDBinstance } from '../database/connection.ts';
import { createContactsTable } from '../database/tables/contacts.ts';
import { useAlertModal } from '../hooks/useAlertModal.ts';
import { resetUser, setUserDetails } from '../redux/reducers/user.reducer.ts';
import Login from '../screens/Login/Login.tsx';
import Registration from '../screens/Registration/Registration.tsx';
import WelcomeScreen from '../screens/Welcome/Welcome.tsx';
import { RootStackParamList } from '../types/Navigations.ts';
import { checkAccessToken } from '../utils/checkToken.ts';
import { socketConnection } from '../utils/socket.ts';
import { Tabs } from './tabs/Tabs.tsx';



const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {

    const [isUserStored, setIsUserStored] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);
    const dispatch = useDispatch();
    const {
        alertVisible, alertMessage, alertType, showAlert, hideAlert,
      } = useAlertModal();

    useEffect(() => {
      const loadUser = async () => {
        try {

        const isAuthenticated = await checkAccessToken();
        if(!isAuthenticated) {
          await EncryptedStorage.clear();
          dispatch(resetUser());
          return;
        }
         const storedUser = await EncryptedStorage.getItem('User Data');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            await socketConnection(user.mobileNumber);
            dispatch(setUserDetails(user));
            await getDBConnection();
            const dbInstance = await getDBinstance();
            await createContactsTable(dbInstance);
            setIsUserStored(true);
          }
        } catch (error) {
          showAlert('Failed to load user from storage', 'error');
        } finally {
          setIsReady(true);
          SplashScreen.hide();
        }
      };
      loadUser();
    }, [dispatch, showAlert]);

    if(!isReady) {
      return <></>;
    }
    return(
          <NavigationContainer>
            <Stack.Navigator initialRouteName={isUserStored ? 'Tabs' : 'WelcomeScreen'} screenOptions={{ headerShown: false }}>
              <>
                <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
                <Stack.Screen name="RegistrationScreen" component={Registration}/>
                <Stack.Screen name="LoginScreen" component={Login}/>
                </>
            </Stack.Navigator>
            <CustomeAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
        </NavigationContainer>

    );
}
