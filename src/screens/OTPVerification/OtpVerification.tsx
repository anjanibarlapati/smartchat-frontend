import {useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {OtpInput, OtpInputRef} from 'react-native-otp-entry';
import Button from '../../components/Button/Button';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {getStyles} from './OtpVerification.styles';

export const OtpVerification = () => {
  const theme: Theme = useAppTheme();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  const otpRef = useRef<OtpInputRef>(null);

  const [seconds, setSeconds] = useState(120);

  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [resendClicked, setResendClicked] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSubmit = () => {
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit code.');
      setOtp('');
      otpRef.current?.clear();
      return;
    }
    setError('');
  };

  const handleResend = () => {
    if (seconds === 0 && !resendClicked) {
      //API Call
      setSeconds(120);
      setResendClicked(true);
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
          We've sent you a 6-digit verification code to email
        </Text>
      </View>

      <View style={styles.OtpView} accessibilityLabel="One-Time-Password-Container">
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={setOtp}
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
    </View>
  );
};
