import {useState} from 'react';
import { Image, Text, TouchableOpacity, View} from 'react-native';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { styles } from './Registration.styles';



const Registration = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');


  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [contactError , setContactError] = useState('');

  const handleRegister = () => {
    let isValid = true;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setContactError('');
    setConfirmPasswordError('');

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError(' Last name is required');
      isValid = false;
    }
    if(email){
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setEmailError('Invalid email address');
        isValid = false;
      }
    }
    if (!contact.trim() ) {
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

    if(isValid) {
      isValid = false;
    }
  };

  return (
    <>
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
            onChangeText={setFirstName}
            placeholder="First Name"
            error={firstNameError}
            required
          />
          <InputField
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            error={lastNameError}
            required
          />
          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            error={emailError}
          />
          <InputField
          value={contact}
          placeholder="Mobile Number"
          onChangeText={setContact}
          error={contactError}
          required

          />

          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            error={passwordError}
            required
          />
          <InputField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={true}
            error={confirmPasswordError}
            required
          />
        </View>
        <View style={styles.loginView}>
          <Text style={styles.text}>Already have an account ? </Text>
          <TouchableOpacity>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity >
        <Button label="Register" onPress={handleRegister} />
        </TouchableOpacity>

      </View>
    </>
  );
};



export default Registration;
