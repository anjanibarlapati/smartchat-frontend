import {useNavigation} from '@react-navigation/native';
import parsePhoneNumberFromString from 'libphonenumber-js';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import PhoneInput from 'react-native-phone-input';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import Button from '../../components/Button/Button';
import {CustomAlert} from '../../components/CustomAlert/CustomAlert';
import InputField from '../../components/InputField/InputField';
import LoadingIndicator from '../../components/Loading/Loading';
import {useRealm} from '../../contexts/RealmContext';
import {useAppTheme} from '../../hooks/appTheme';
import {useAlertModal} from '../../hooks/useAlertModal';
import {storeChats} from '../../realm-database/operations/storeChats';
import {setSuccessMessage} from '../../redux/reducers/auth.reducer';
import {setUserDetails} from '../../redux/reducers/user.reducer';
import {Credentials} from '../../types/Credentials';
import {Chat} from '../../types/message';
import {RegistrationScreenNavigationProps} from '../../types/Navigations';
import {generateAndUploadFcmToken} from '../../utils/fcmService';
import {decryptPrivateKey} from '../../utils/privateKey';
import {socketConnection} from '../../utils/socket';
import {Theme} from '../../utils/themes';
import {fetchChats, formatMessages, login} from './Login.service';
import {getStyles} from './Login.styles';

const LoginScreen = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProps>();
  const {width} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width);
  const realm = useRealm();

  const [phoneInputKey, setPhoneInputKey] = useState(0);
  const [credentials, setCredentials] = useState<Credentials>({
    mobileNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<Credentials>({
    mobileNumber: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {alertVisible, alertMessage, alertType, showAlert, hideAlert} =
    useAlertModal();

  const dispatch: Dispatch = useDispatch();

  const handleChange = (field: string, value: string) => {
    setCredentials(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
    setErrors(prevValues => ({
      ...prevValues,
      [field]: '',
    }));
  };

  const setErrorMessage = (field: string, message: string) => {
    setErrors(prevValues => ({
      ...prevValues,
      [field]: message,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (credentials.mobileNumber.trim()) {
      const parsedPhoneNumber = parsePhoneNumberFromString(
        credentials.mobileNumber.trim(),
      );
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        setErrorMessage('mobileNumber', 'Invalid mobile number');
        isValid = false;
      }
    } else {
      setErrorMessage('mobileNumber', 'Mobile number is required');
      isValid = false;
    }
    if (!credentials.password) {
      setErrorMessage('password', 'Password is required');
      isValid = false;
    }
    return isValid;
  };

  const clearFields = () => {
    setCredentials({
      mobileNumber: '',
      password: '',
    });
    setErrors({
      mobileNumber: '',
      password: '',
    });
    setPhoneInputKey(prevKey => prevKey + 1);
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const response = await login(credentials);
      const result = await response.json();
      if (response.ok) {
        clearFields();
        const encryptedPrivateKey = result.user.privateKey;
        const privateKey = await decryptPrivateKey(
          encryptedPrivateKey.salt,
          encryptedPrivateKey.nonce,
          encryptedPrivateKey.privateKey,
          result.userId,
        );
        await EncryptedStorage.setItem(
          'privateKey',
          JSON.stringify({
            privateKey: privateKey,
          }),
        );
        const chats = await fetchChats(
          result.user.mobileNumber,
          result.access_token,
        );
        const userChats = await chats.json();
        if (chats.ok) {
          const formattedMessages = await formatMessages(
            userChats as Chat[],
            result.access_token,
          );
          storeChats(realm, formattedMessages);
        } else {
          showAlert(userChats.message, 'error');
          return;
        }
        await EncryptedStorage.setItem(
          result.user.mobileNumber,
          JSON.stringify({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          }),
        );
        dispatch(setUserDetails(result.user));
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(result.user),
        );
        dispatch(
          setSuccessMessage("You've successfully logged in to SmartChat!"),
        );
        await generateAndUploadFcmToken(credentials.mobileNumber);
        socketConnection(result.user.mobileNumber);
        navigation.reset({
          index: 0,
          routes: [{name: 'Tabs'}],
        });
        return;
      }
      showAlert(result.message, 'warning');
      clearFields();
    } catch (error) {
      showAlert('Something went wrong. Please try again', 'error');
      clearFields();
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Image
          style={styles.logoStyles}
          source={require('../../../assets/images/Applogo.png')}
          accessibilityLabel="appLogo"
        />
        <View style={styles.inputfields}>
          <View style={styles.phoneInputWrapper}>
            <PhoneInput
              key={phoneInputKey}
              initialCountry="in"
              textProps={{
                placeholder: 'Mobile Number',
              }}
              onChangePhoneNumber={(text: string) =>
                handleChange('mobileNumber', text)
              }
              style={styles.phoneInput}
              textStyle={styles.phoneInputText}
              autoFormat
              accessibilityLabel="phone-input"
            />
            {errors.mobileNumber ? (
              <Text style={styles.errorText}>{errors.mobileNumber}</Text>
            ) : null}
          </View>
          <InputField
            value={credentials.password}
            onChangeText={text => handleChange('password', text)}
            placeholder="Password"
            secureTextEntry={!showPassword}
            error={errors.password}
          />
          <View style={styles.showPasswordView}>
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Image
                style={styles.eyeImage}
                source={
                  showPassword
                    ? theme.images.eyeoffIcon
                    : theme.images.eyeIcon
                }

              />
            </TouchableOpacity>
          </View>
        </View>
        <Button label="Login" onPress={handleLogin} />
        <LoadingIndicator visible={isLoading} />
        <View style={styles.registerView}>
          <Text style={styles.text}>Don't have an account ?</Text>
          <TouchableOpacity
            onPress={() => navigation.replace('RegistrationScreen')}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
