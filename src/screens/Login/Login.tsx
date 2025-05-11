
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import LoadingScreen from '../Loading/LoadingScreen';
import { login } from './Login.handler';
import { styles } from './Login.styles';
import { setUserDetails } from '../../redux/reducer';
import { Credentials } from '../../types/Credentials';
import { RegistrationScreenNavigationProps } from '../../types/Navigations';
import { userState } from '../../types/User';



const LoginScreen = () => {
    const navigation = useNavigation<RegistrationScreenNavigationProps>();

  const [credentials, setCredentials] = useState<Credentials>({ mobileNumber: '', password: '' });
  const [errors, setErrors] = useState<Credentials>({
    mobileNumber: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);

  const dispatch: Dispatch = useDispatch();
  const userDetails = useSelector((state: userState) => state.user);

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
        Alert.alert('User Login Successful!');
        clearFields();
        dispatch(setUserDetails(result.user));
        await EncryptedStorage.setItem(
            userDetails.mobileNumber,
            JSON.stringify({
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            })
        );
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(result.user)
        );
        navigation.replace('Tabs');
        return;
      }
      Alert.alert(result.message);
      } catch(error) {
        Alert.alert('Invalid error!');
        clearFields();
      } finally{
        setLoading(false);
    }
  };

  if(isLoading) {
    return <LoadingScreen />;
  }


  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => navigation.navigate('RegistrationScreen')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
