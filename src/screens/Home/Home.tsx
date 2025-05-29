import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomeAlert } from '../../components/CustomAlert/CustomAlert';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { resetUser } from '../../redux/reducers/user.reducer';
import { storeState } from '../../redux/store';
import { HomeScreenNavigationProps, WelcomeScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { getStyles } from './Home.styles';

export function Home(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const welcomeNavigation = useNavigation<WelcomeScreenNavigationProps>();
  const { alertMessage, alertType, alertVisible, hideAlert, showAlert } = useAlertModal();
  const successMessage = useSelector((state: storeState) => state.auth.successMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (successMessage) {
      showAlert(successMessage, 'success');
    }
  }, [dispatch, showAlert, successMessage]);

  useEffect(() => {
    const forceLogout = async() => {
      dispatch(resetUser());
      await EncryptedStorage.clear();
      welcomeNavigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
      Alert.alert('You have been logged out due to another device login.');
    };
    if(successMessage === null){
      forceLogout();
    }
  }, [dispatch, welcomeNavigation, successMessage]);

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.bodyText}>
              Start conversations with your closed ones
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate('Contact')}
          style={styles.addContactContainer}>
          <Image
            source={theme.images.contactsAddcon}
            style={styles.addContactImage}
            accessibilityLabel="addContact"
          />
        </TouchableOpacity>
      </View>
      <CustomeAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </View>
  );
}
