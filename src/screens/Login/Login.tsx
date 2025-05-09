import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import {LoginFormErrors, LoginFormInputs} from '../../types/LoginCredentials';
import React, {useState} from 'react';
import {styles} from './Login.styles';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

const LoginScreen = () => {
  const [form, setForm] = useState<LoginFormInputs>({
    mobilenumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({
    mobilenumber: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors: LoginFormErrors = {};
    let isValid = true;

    if (!form.mobilenumber.trim()) {
      newErrors.mobilenumber = t('Mobile number is required');
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = t('Password is required');
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
  const {t} = useTranslation('auth');


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
          onChangeText={text => setForm({...form, mobilenumber: text})}
          placeholder={t('Mobile Number')}
          error={errors.mobilenumber}
          keyboardType="numeric"
        />
        <InputField
          value={form.password}
          onChangeText={text => setForm({...form, password: text})}
          placeholder={t('Password')}
          secureTextEntry
          error={errors.password}
        />
      </View>
      <Button label={t('Login')} onPress={handleLogin} />
      <View style={styles.registerView}>
        <Text style={styles.text}>{t("Don't have an account?")}</Text>
        <TouchableOpacity>
          <Text style={styles.registerText}>{t('Register')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
