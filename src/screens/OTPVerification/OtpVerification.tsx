import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '../../components/Button/Button';
import LoadingIndicator from '../../components/Loading/Loading';
import { useAppTheme } from '../../hooks/appTheme';
import { setSuccessMessage } from '../../redux/reducers/auth.reducer';
import { setUserDetails } from '../../redux/reducers/user.reducer';
import { OTPVerificationNavigationProps, RootStackParamList } from '../../types/Navigations';
import { generateAndUploadFcmToken } from '../../utils/fcmService';
import { generateKeyPair, storeKeys } from '../../utils/keyPairs';
import { decryptPrivateKey, encryptPrivateKey } from '../../utils/privateKey';
import { socketConnection } from '../../utils/socket';
import { Theme } from '../../utils/themes';
import {
  createUser,
  generateOTPAndSendMail,
  verifyOTP,
} from './OtpVerification.service.ts';
import { getStyles } from './OtpVerification.styles';

export type OtpVerificationRouteProp = RouteProp<
  RootStackParamList,
  'OTPVerificationScreen'
>;

export const OtpVerification = () => {
  const theme: Theme = useAppTheme();
  const { width } = useWindowDimensions();
  const styles = getStyles(theme, width);
  const otpRef = useRef<OtpInputRef>(null);

  const [startTime] = useState(Date.now());
  const [seconds, setSeconds] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [resendClicked, setResendClicked] = useState(false);

  const navigation = useNavigation<OTPVerificationNavigationProps>();
  const route = useRoute<OtpVerificationRouteProp>();
  const { mobileNumber, email } = route.params;
  const dispatch: Dispatch = useDispatch();

    const renderHeaderLeft = useCallback(
      () => (
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={()=>{navigation.goBack();}}>
                <Image
                    style={styles.backIcon}
                    source={require('../../../assets/images/chevron.png')}
                    accessibilityLabel="chevronIcon"
                />
            </TouchableOpacity>
        </View>
      ),
      [navigation, styles.backIcon, styles.headerLeft],
    );

    useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTitle: '',
        headerLeft: renderHeaderLeft,
        headerStyle: {backgroundColor: theme.primaryBackground},
      });
    }, [navigation, renderHeaderLeft, theme.primaryBackground]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 120 - elapsed;
      if (remaining <= 0) {
        setSeconds(0);
        clearInterval(interval);
      } else {
        setSeconds(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (seconds === 0 && resendClicked) {
      navigation.replace('RegistrationScreen');
    }
  }, [seconds, resendClicked, navigation]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const OTPVerificationResponse = await verifyOTP(otp, mobileNumber);
      if (OTPVerificationResponse.ok) {
        const response = await createUser(mobileNumber);
        if (response.ok) {
          const result = await response.json();
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
          socketConnection(result.user.mobileNumber);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
          return;
        } else {
          const data = await response.json();
          setError(data.message || 'User creation failed');
          setTimeout(() => {
            navigation.replace('RegistrationScreen');
          }, 3000);
        }
      } else {
        const data = await OTPVerificationResponse.json();
        setError(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setTimeout(() => {
        navigation.replace('RegistrationScreen');
      }, 3000);
    } finally {
      setOtp('');
      otpRef.current?.clear();
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds === 0 && !resendClicked) {
      setSeconds(120);
      setResendClicked(true);
      setError('');
      try {
        await generateOTPAndSendMail(email, mobileNumber);
      } catch (errr: any) {
        setError(errr.message || 'Failed to resend OTP. Please try again.');
      }
    }
  };

  const isResendEnabled = seconds === 0 && !resendClicked;
  const isOtpValid = otp.length === 6;

  return (
    <View style={styles.screenWindow}>
      <View style={styles.TopView}>
        <Image
          style={styles.img}
          accessibilityLabel="verification-image"
          source={require('../../../assets/images/verification.png')}
        />
        <Text style={styles.EnterOTPText}>Enter Verification Code</Text>
        <Text style={styles.infoText}>
          {`We've sent you a 6-digit verification code to ${email}`}
        </Text>
      </View>

      <View style={styles.OtpView} accessibilityLabel="One-Time-Password-Container">
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={(value) => {
            setOtp(value);
            setError('');
          }}
          focusColor="teal"
          autoFocus={true}
          hideStick={false}
          placeholder=""
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View
        style={[
          styles.submitView,
          isOtpValid ? styles.submitViewEnabled : styles.submitViewDisabled,
        ]}>
        <Button label="Submit" onPress={handleSubmit} />
      </View>

      <View style={styles.bottomView}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        <TouchableOpacity
          onPress={handleResend}
          disabled={seconds > 0 || resendClicked}>
          <Text
            style={[
              styles.resendBtn,
              isResendEnabled
                ? styles.resendBtnEnabled
                : styles.resendBtnDisabled,
            ]}>
            Resend Code?
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingIndicator visible={loading} />
    </View>
  );
};
