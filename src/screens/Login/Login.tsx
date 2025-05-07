import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import { LoginFormErrors, LoginFormInputs } from '../../types/LoginCredentials';
import React, { useState } from 'react';
import { styles } from './Login.styles';
import { View, Image, Text, TouchableOpacity } from 'react-native';


const LoginScreen = () => {
  const [form, setForm] = useState<LoginFormInputs>({ mobilenumber: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({
    mobilenumber: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors: LoginFormErrors = {};
    let isValid = true;

    if (!form.mobilenumber.trim()) {
      newErrors.mobilenumber = 'Mobile number is required';
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (!validateForm()) {
        return;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoStyles}
        source={require('../../../assets/images/Applogo.png')}
        accessibilityLabel="appLogo"
      />
      <View style={styles.inputfields}>
        <InputField
          value={form.mobilenumber}
          onChangeText={(text) => setForm({ ...form, mobilenumber: text })}
          placeholder="Mobile Number"
          error={errors.mobilenumber}
        />
        <InputField
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
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
