
import Button from '../../components/Button/Button';
import { Credentials } from '../../types/Credentials';
import InputField from '../../components/InputField/InputField';
import React, { useState } from 'react';
import { styles } from './Login.styles';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import LoadingScreen from '../Loading/LoadingScreen';
import { login } from './Login.handler';


const LoginScreen = () => {
  const [credentials, setCredentials] = useState<Credentials>({ mobileNumber: '', password: '' });
  const [errors, setErrors] = useState<Credentials>({
    mobileNumber: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
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
        Alert.alert('User Login Successfully!');
        clearFields();
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
        <TouchableOpacity>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
