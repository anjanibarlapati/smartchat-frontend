import React, { useEffect } from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CustomeAlert } from '../../components/CustomAlert/CustomAlert';
import {getStyles} from './Home.styles';
import {useAppTheme} from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { clearSuccessMessage } from '../../redux/reducers/auth.reducer';
import { storeState } from '../../redux/store';
import {ContactScreenNavigationProps} from '../../types/Navigations';
import {Theme} from '../../utils/themes';

export function Home(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<ContactScreenNavigationProps>();
  const { alertMessage, alertType, alertVisible, hideAlert, showAlert } = useAlertModal();
  const successMessage = useSelector((state: storeState) => state.auth.successMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (successMessage) {
      showAlert(successMessage, 'success');
      dispatch(clearSuccessMessage());
    }
  }, [dispatch, showAlert, successMessage]);

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <ScrollView contentContainerStyle={styles.bodyContainer}>
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
