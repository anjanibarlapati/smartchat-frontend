import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import { ProfilePicutrePickerModal } from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import LoadingScreen from '../Loading/LoadingScreen';
import {styles} from './Registration.styles';
import { InputUser } from '../../types/InputUser';
import { register } from './Registration.handler';
import { UploadImage } from '../../types/UploadImage';

const Registration = () => {

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
    } else {
      setErrorMessage('email', 'Email is required');
      isValid = false;
    }
    if (!user.mobileNumber.trim()) {
      setErrorMessage('mobileNumber', 'Mobile number is required');
      isValid = false;
    }
    if (!user.password) {
      setErrorMessage('password', 'Password is required');
      isValid = false;
    }
    if (user.password !== user.confirmPassword) {
      setErrorMessage('confirmPassword', 'Passwords do not match');
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
        Alert.alert('User Registered Successfully!');
        clearFields();
        return;
      }
      Alert.alert(result.message);
    } catch(error) {
      Alert.alert('Invalid error!');
    } finally{
      setLoading(false);
    }
  };

  if(isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.window} keyboardShouldPersistTaps="always">
      <TouchableOpacity onPress={() => {setShowProfilePicSelectModal(true);}}>
        <Image
          style={styles.img}
          source={profilePic ? typeof profilePic === 'string' ? {uri: profilePic} : {uri: profilePic.uri} : require('../../../assets/images/profileImage.png')}
          accessibilityLabel="profile-image"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.inputfields}>
        <InputField
          value={user.firstName}
          onChangeText={(text) => { handleChange('firstName', text); }}
          placeholder="First Name"
          error={inputErrors.firstName}
          required
        />
        <InputField
          value={user.lastName}
          onChangeText={(text) => { handleChange('lastName', text); }}
          placeholder="Last Name"
          error={inputErrors.lastName}
          required
        />
        <InputField
          value={user.email}
          onChangeText={(text) => { handleChange('email', text); }}
          placeholder="Email"
          error={inputErrors.email}
        />
        <InputField
          value={user.mobileNumber}
          onChangeText={(text) => { handleChange('mobileNumber', text); }}
          placeholder="Mobile Number"
          error={inputErrors.mobileNumber}
          required
        />
        <InputField
          value={user.password}
          onChangeText={(text) => { handleChange('password', text); }}
          placeholder="Password"
          secureTextEntry
          error={inputErrors.password}
          required
        />
        <InputField
          value={user.confirmPassword}
          onChangeText={(text) => { handleChange('confirmPassword', text); }}
          placeholder="Confirm Password"
          secureTextEntry
          error={inputErrors.confirmPassword}
          required
        />
      </View>

      <View style={styles.loginView}>
        <Text style={styles.text}>Already have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      <Button label="Register" onPress={handleRegister} />
      <ProfilePicutrePickerModal
        isEditingProfilePicture={showProfilePicSelectModal}
        close={() => {setShowProfilePicSelectModal(false);}}
        profilePicture={profilePic}
        openedFrom="registration"
        setProfilePic={setProfilePic}
      />
    </ScrollView>
  );
};

export default Registration;
