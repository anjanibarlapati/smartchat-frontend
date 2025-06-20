import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import {  useSelector } from 'react-redux';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { storeState } from '../../redux/store';
import { WelcomeScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { getStyles } from './Welcome.styles';

const WelcomeScreen = ():React.JSX.Element => {

  const navigation = useNavigation<WelcomeScreenNavigationProps>();
  const { width, height } = useWindowDimensions();

  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width, height);
  const { alertVisible, alertMessage, alertType, showAlert, hideAlert } = useAlertModal();
  const successMessage = useSelector((state: storeState) => state.auth.successMessage);
  useEffect(() => {
    if (successMessage === 'logged-out') {
      showAlert('You have been logged out due to another device login.', 'info');
    }
  }, [ successMessage,  showAlert]);

  return (
    <View style={styles.container} >
      <Image
        style={styles.logoStyles}
        source={require('../../../assets/images/Applogo.png')}
        accessibilityLabel="appLogo"
      />
      <View style={styles.appnameTagline}>
        <Text style={styles.appname}>SmartChat</Text>
        <Text style={styles.apptagline}>Where conversations evolve</Text>
      </View>
      <Pressable style={styles.getstartButton} onPress={() => navigation.replace('RegistrationScreen')}>
        <View style={styles.buttonContent}>
          <Text style={styles.getstartText}>Let's Get Started</Text>
          <Image
            style={styles.chevronIconStyles}
            source={require('../../../assets/icons/rightArrowIcon.png')}
            accessibilityLabel="chevronIcon"
          />
        </View>
      </Pressable>
      <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </View>
  );
};

export default WelcomeScreen;
