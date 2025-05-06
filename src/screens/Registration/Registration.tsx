import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import {styles} from './Registration.styles';

import {
  firstNameChanged,
  lastNameChanged,
  emailChanged,
  contactChanged,
  passwordChanged,
  confirmPasswordChanged,
  REGISTER_REQUEST,
} from '../../redux/action';

const Registration = () => {
  const dispatch = useDispatch();

  const {firstName, lastName, email, contact, password, confirmPassword} =
    useSelector((state: any) => state.registration);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [contactError, setContactError] = useState('');

  const handleRegister = () => {
    let isValid = true;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setContactError('');

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    }
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setEmailError('Invalid email address');
        isValid = false;
      }
    } else {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!contact.trim()) {
      setContactError('Mobile number is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      dispatch({
        type: REGISTER_REQUEST,
        payload: {
          firstName,
          lastName,
          email,
          contact,
          password,
          confirmPassword,
        },
      });
    }
  };

  return (
    <View style={styles.window}>
      <TouchableOpacity>
        <Image
          style={styles.img}
          source={require('../../../assets/images/profileImage.png')}
          accessibilityLabel="profile-image"
        />
      </TouchableOpacity>

      <View style={styles.inputfields}>
        <InputField
          value={firstName}
          onChangeText={text => dispatch(firstNameChanged(text))}
          placeholder="First Name"
          error={firstNameError}
          required
        />
        <InputField
          value={lastName}
          onChangeText={text => dispatch(lastNameChanged(text))}
          placeholder="Last Name"
          error={lastNameError}
          required
        />
        <InputField
          value={email}
          onChangeText={text => dispatch(emailChanged(text))}
          placeholder="Email"
          error={emailError}
        />
        <InputField
          value={contact}
          onChangeText={text => dispatch(contactChanged(text))}
          placeholder="Mobile Number"
          error={contactError}
          required
        />
        <InputField
          value={password}
          onChangeText={text => dispatch(passwordChanged(text))}
          placeholder="Password"
          secureTextEntry
          error={passwordError}
          required
        />
        <InputField
          value={confirmPassword}
          onChangeText={text => dispatch(confirmPasswordChanged(text))}
          placeholder="Confirm Password"
          secureTextEntry
          error={confirmPasswordError}
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
    </View>
  );
};

export default Registration;
