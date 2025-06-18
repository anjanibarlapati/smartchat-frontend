import {useNavigation} from '@react-navigation/native';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
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
import {ProfilePicturePickerModal} from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import {useAppTheme} from '../../hooks/appTheme';
import {useAlertModal} from '../../hooks/useAlertModal';
import {setSuccessMessage} from '../../redux/reducers/auth.reducer';
import {setUserDetails} from '../../redux/reducers/user.reducer';
import {InputUser} from '../../types/InputUser';
import {RegistrationScreenNavigationProps} from '../../types/Navigations';
import {UploadImage} from '../../types/UploadImage';
import {generateKeyPair, storeKeys} from '../../utils/keyPairs';
import {decryptPrivateKey, encryptPrivateKey} from '../../utils/privateKey';
import {socketConnection} from '../../utils/socket';
import {Theme} from '../../utils/themes';
import {register} from './Registration.service';
import {getStyles} from './Registration.styles';
import {generateAndUploadFcmToken} from '../../utils/fcmService';

const Registration = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProps>();
  const {width, height} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width, height);

  const {
    alertVisible, alertMessage, alertType, showAlert, hideAlert,
  } = useAlertModal();
  const [showProfilePicSelectModal, setShowProfilePicSelectModal] = useState(false);
  const [profilePic, setProfilePic] = useState<UploadImage | null | string>(null);
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<InputUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    confirmPassword: '',
    profilePic: null,
  });
  const dispatch: Dispatch = useDispatch();
  const [inputErrors, setInputErrors] = useState<InputUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    profilePic: null,
  });

  const handleChange = (field: string, value: string) => {
    if(field === 'email') {
      value = value.trim().toLowerCase();
    }
    setUser(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
    setInputErrors(prevValues => ({
      ...prevValues,
      [field]: '',
    }));
  };

  const setErrorMessage = (field: string, message: string) => {
    setInputErrors(prevValues => ({
      ...prevValues,
      [field]: message,
    }));
  };

  const validateFields = () => {
    let isValid = true;

    if (!user.firstName.trim()) {
      setErrorMessage('firstName', 'First name is required');
      isValid = false;
    }
    if (!user.lastName.trim()) {
      setErrorMessage('lastName', 'Last name is required');
      isValid = false;
    }
    if (user.email) {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
      if (!emailRegex.test(user.email)) {
        setErrorMessage('email', 'Invalid email address');
        isValid = false;
      }
    }
    if (user.mobileNumber.trim()) {
      const parsedPhoneNumber = parsePhoneNumberFromString(
        user.mobileNumber.trim(),
      );
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        setErrorMessage('mobileNumber', 'Invalid mobile number');
        isValid = false;
      }
    } else {
      setErrorMessage('mobileNumber', 'Mobile number is required');
      isValid = false;
    }
    if (!user.password) {
      setErrorMessage('password', 'Password is required');
      isValid = false;
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(user.password)) {
        setErrorMessage(
          'password',
          'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
        );
        isValid = false;
      } else if (user.password !== user.confirmPassword) {
        setErrorMessage('confirmPassword', 'Passwords do not match');
        isValid = false;
      }
      return isValid;
    }
  };

  const clearFields = () => {
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      confirmPassword: '',
      profilePic: null,
    });
    setProfilePic(null);
    setInputErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      confirmPassword: '',
      profilePic: null,
    });
  };
  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('mobileNumber', user.mobileNumber);
    formData.append('password', user.password);
    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    try {
      setLoading(true);
      const response = await register(formData);
      const result = await response.json();
      if (response.ok) {
        clearFields();
        const keyPair = await generateKeyPair();
        const encryptedPrivateKey = await encryptPrivateKey(
          keyPair.privateKey,
          result.userId,
        );
        const keysResponse = await storeKeys(
          result.user.mobileNumber,
          keyPair.publicKey,
          encryptedPrivateKey,
          result.access_token,
        );

        if (keysResponse.ok) {
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
        }
        await EncryptedStorage.setItem(
          result.user.mobileNumber,
          JSON.stringify({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          }),
        );
        dispatch(setUserDetails(result.user));
        dispatch(
          setSuccessMessage("You've successfully logged in to SmartChat!"),
        );
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(result.user),
        );
        await generateAndUploadFcmToken(result.user.mobileNumber);
        await socketConnection(result.user.mobileNumber);
        navigation.reset({
          index: 0,
          routes: [{name: 'Tabs'}],
        });
        return;
      }
      showAlert(result.message, 'warning');
    } catch (error) {
      showAlert('Something went wrong. Please try again', 'error');
      clearFields();
    } finally {
      setLoading(false);
    }
  };

  const removePicture = () => {
    setProfilePic(null);
    setShowProfilePicSelectModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.body}
        accessibilityLabel="body-container"
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => {
            setShowProfilePicSelectModal(true);
          }}>
          <Image
            style={styles.img}
            source={
              profilePic
                ? typeof profilePic === 'string'
                  ? { uri: profilePic }
                  : { uri: profilePic.uri }
                : require('../../../assets/images/profileImage.png')
            }
            accessibilityLabel="profile-image"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.inputfields}>
          <InputField
            value={user.firstName}
            onChangeText={text => {
              handleChange('firstName', text);
            }}
            placeholder="First Name"
            error={inputErrors.firstName}
            required
          />
          <InputField
            value={user.lastName}
            onChangeText={text => {
              handleChange('lastName', text);
            }}
            placeholder="Last Name"
            error={inputErrors.lastName}
            required
          />
          <InputField
            value={user.email}
            onChangeText={text => {
              handleChange('email', text);
            }}
            placeholder="Email"
            error={inputErrors.email}
          />
          <View style={styles.phoneInputWrapper}>
            <PhoneInput
              initialCountry="in"
              textProps={{
                placeholder: 'Mobile Number *',
              }}
              onChangePhoneNumber={(text: string) =>
                handleChange('mobileNumber', text)
              }
              style={styles.phoneInput}
              textStyle={styles.phoneInputText}
              autoFormat
              accessibilityLabel="phone-input"
            />
            {inputErrors.mobileNumber ? (
              <Text style={styles.errorText}>{inputErrors.mobileNumber}</Text>
            ) : null}
          </View>
          <InputField
            value={user.password}
            onChangeText={text => {
              handleChange('password', text);
            }}
            placeholder="Password"
            secureTextEntry
            error={inputErrors.password}
            required
          />
          <InputField
            value={user.confirmPassword}
            onChangeText={text => {
              handleChange('confirmPassword', text);
            }}
            placeholder="Confirm Password"
            secureTextEntry
            error={inputErrors.confirmPassword}
            required
          />
        </View>

        <View style={styles.loginView}>
          <Text style={styles.text}>Already have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Button label="Register" onPress={handleRegister} />
        <LoadingIndicator visible={isLoading} />
        <ProfilePicturePickerModal
          isEditingProfilePicture={showProfilePicSelectModal}
          close={() => {
            setShowProfilePicSelectModal(false);
          }}
          profilePicture={profilePic}
          setProfilePic={setProfilePic}
          remove={removePicture}
        />
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

export default Registration;
