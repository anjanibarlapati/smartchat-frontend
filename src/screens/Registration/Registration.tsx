import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import { ProfilePicturePickerModal } from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import LoadingScreen from '../Loading/LoadingScreen';
import {styles} from './Registration.styles';
import { InputUser } from '../../types/InputUser';
import { register } from './Registration.handler';
import { UploadImage } from '../../types/UploadImage';
import { useTranslation } from 'react-i18next';

const Registration = () => {
  const { t } = useTranslation('auth');
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
  });
  const [inputErrors, setInputErrors] = useState<InputUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  });

  const handleChange = (field: string, value: string) => {
    setUser((prevValues) => ({
        ...prevValues,
        [field]: value,
    }));
    setInputErrors((prevValues) => ({
        ...prevValues,
        [field]: '',
    }));
  };

  const setErrorMessage = (field: string, message: string) => {
    setInputErrors((prevValues) => ({
      ...prevValues,
      [field]: message,
    }));
  };

  const validateFields = () => {
    let isValid = true;

    if (!user.firstName.trim()) {
      setErrorMessage('firstName', t('First name is required'));
      isValid = false;
    }
    if (!user.lastName.trim()) {
      setErrorMessage('lastName', t('Last name is required'));
      isValid = false;
    }
    if (user.email) {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
      if (!emailRegex.test(user.email)) {
        setErrorMessage('email', t('Invalid email address'));
        isValid = false;
      }
    } else {
      setErrorMessage('email', t('Email is required'));
      isValid = false;
    }
    if (!user.mobileNumber.trim()) {
      setErrorMessage('mobileNumber', t('Mobile number is required'));
      isValid = false;
    }
    if (!user.password) {
      setErrorMessage('password', t('Password is required'));
      isValid = false;
    }
    if (user.password !== user.confirmPassword) {
      setErrorMessage('confirmPassword', t('Passwords do not match'));
      isValid = false;
    }
    return isValid;
  };

  const clearFields = () => {
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      confirmPassword: '',
    });
    setProfilePic(null);
    setInputErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      confirmPassword: '',
    });
  };

  const handleRegister = async() => {
    if(!validateFields()) {
      return;
    }
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('mobileNumber', user.mobileNumber);
    formData.append('password', user.password);
    if(profilePic) {
      formData.append('profilePicture', profilePic);
    }

    try{
      setLoading(true);
      const response = await register(formData);
      const result = await response.json();
      if(response.ok) {
        Alert.alert(t('User Registered Successfully!'));
        clearFields();
        return;
      }
      Alert.alert(result.message);
    } catch(error) {
      Alert.alert(t('Invalid error!'));
    } finally{
      setLoading(false);
    }
  };

  if(isLoading) {
    return <LoadingScreen />;
  }

  return (
     <ScrollView contentContainerStyle={styles.window} keyboardShouldPersistTaps="always">
      <TouchableOpacity onPress={() => { setShowProfilePicSelectModal(true); }}>
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
          onChangeText={(text) => { handleChange('firstName', text); }}
          placeholder={t('First Name')}
          error={inputErrors.firstName}
          required
        />
        <InputField
          value={user.lastName}
          onChangeText={(text) => { handleChange('lastName', text); }}
          placeholder={t('Last Name')}
          error={inputErrors.lastName}
          required
        />
        <InputField
          value={user.email}
          onChangeText={(text) => { handleChange('email', text); }}
          placeholder={t('Email')}
          error={inputErrors.email}
        />
        <InputField
          value={user.mobileNumber}
          onChangeText={(text) => { handleChange('mobileNumber', text); }}
          placeholder={t('Mobile Number')}
          error={inputErrors.mobileNumber}
          required
        />
        <InputField
          value={user.password}
          onChangeText={(text) => { handleChange('password', text); }}
          placeholder={t('Password')}
          secureTextEntry
          error={inputErrors.password}
          required
        />
        <InputField
          value={user.confirmPassword}
          onChangeText={(text) => { handleChange('confirmPassword', text); }}
          placeholder={t('Confirm Password')}
          secureTextEntry
          error={inputErrors.confirmPassword}
          required
        />
      </View>

      <View style={styles.loginView}>
        <Text style={styles.text}>{t('Already have an account?')}</Text>
        <TouchableOpacity>
          <Text style={styles.loginText}>{t('Login')}</Text>
        </TouchableOpacity>
      </View>

      <Button label={t('Register')} onPress={handleRegister} />
      <ProfilePicturePickerModal
        isEditingProfilePicture={showProfilePicSelectModal}
        close={() => { setShowProfilePicSelectModal(false); }}
        profilePicture={profilePic}
        openedFrom="registration"
        setProfilePic={setProfilePic}
      />
    </ScrollView>
  );
};

export default Registration;
