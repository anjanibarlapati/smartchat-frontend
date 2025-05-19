
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import LoadingScreen from '../Loading/Loading';
import { login } from './Login.service';
import { getStyles } from './Login.styles';
import { setUserDetails } from '../../redux/reducers/user.reducer';
import { Credentials } from '../../types/Credentials';
import { RegistrationScreenNavigationProps } from '../../types/Navigations';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { socketConnection } from '../../utils/socket';



const LoginScreen = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProps>();

  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);

  const [credentials, setCredentials] = useState<Credentials>({ mobileNumber: '', password: '' });
  const [errors, setErrors] = useState<Credentials>({
    mobileNumber: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);

  const dispatch: Dispatch = useDispatch();

  const handleChange = (field: string, value: string) => {
    setCredentials((prevValues) => ({
        ...prevValues,
        [field]: value,
    }));
    setErrors((prevValues) => ({
        ...prevValues,
        [field]: '',
    }));
  };

  const setErrorMessage = (field: string, message: string) => {
    setErrors((prevValues) => ({
      ...prevValues,
      [field]: message,
    }));
  };


  const validateForm = () => {
    let isValid = true;

    if (!credentials.mobileNumber.trim()) {
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
  };

  const handleLogin = async () => {
    if (!validateForm()) {
        return;
    }
    try{
      setLoading(true);
      const response = await login(credentials);
      const result = await response.json();
      if(response.ok) {
        Alert.alert('You’ve successfully logged in to SmartChat!');
        clearFields();
        dispatch(setUserDetails(result.user));
        await EncryptedStorage.setItem(
            result.user.mobileNumber,
            JSON.stringify({
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            })
        );
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(result.user)
        );
        socketConnection();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
        return;
      }
      Alert.alert(result.message);
      } catch(error) {
        Alert.alert('Something went wrong. Please try again');
        clearFields();
      } finally{
        setLoading(false);
    }
  };

  if(isLoading) {
    return <LoadingScreen />;
  }


  return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        style={styles.logoStyles}
        source={require('../../../assets/images/Applogo.png')}
        accessibilityLabel="appLogo"
      />
      <View style={styles.inputfields}>
        <InputField
          value={credentials.mobileNumber}
          onChangeText={(text) => handleChange('mobileNumber', text)}
          placeholder="Mobile Number"
          error={errors.mobileNumber}
          keyboardType="numeric"
        />
        <InputField
          value={credentials.password}
          onChangeText={(text) => handleChange('password', text)}
          placeholder="Password"
          secureTextEntry
          error={errors.password}
        />
      </View>
      <Button label="Login" onPress={handleLogin}/>
      <View style={styles.registerView}>
        <Text style={styles.text}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('RegistrationScreen')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

export default LoginScreen;
