import React, { useEffect } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ChatCard } from '../../components/ChatCard/ChatCard';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert';
import { useAppTheme } from '../../hooks/appTheme';
import { HomeChats, useHomeChats } from '../../hooks/homechats';
import { useAlertModal } from '../../hooks/useAlertModal';
import { setSuccessMessage } from '../../redux/reducers/auth.reducer';
import { resetUser } from '../../redux/reducers/user.reducer';
import { storeState } from '../../redux/store';
import { HomeScreenNavigationProps, WelcomeScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { getStyles } from './Home.styles';

export function Home(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width);
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const welcomeNavigation = useNavigation<WelcomeScreenNavigationProps>();
  const { alertMessage, alertType, alertVisible, hideAlert, showAlert } = useAlertModal();
  const successMessage = useSelector((state: storeState) => state.auth.successMessage);
  const dispatch = useDispatch();
  const homeChats: HomeChats[] = useHomeChats();

  useEffect(() => {
    if (successMessage === 'You\'ve successfully logged in to SmartChat!') {
      showAlert(successMessage, 'success');
      dispatch(setSuccessMessage('loggedIn'));
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
            {homeChats.length === 0 ? (
                <View style={styles.textContainer}>
                  <Image
                    source={theme.images.homeImageIcon}
                    style={styles.homeImageStyles}
                    accessibilityLabel="home-image"
                  />
                  <Text style={styles.bodyText}>
                    Start conversations with your closed ones
                  </Text>
                </View>
            ) : (
              <View style={styles.homeChatsContainer}>
                <FlatList
                  data={homeChats}
                  keyExtractor={(item) => item.contact.mobileNumber}
                  renderItem={({ item }) => (
                    <ChatCard
                      contact={item.contact}
                      message={item.lastMessage}
                      unreadCount={item.unreadCount}
                    />
                  )}
                />
              </View>
            )}
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
      <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </View>
  );
}
