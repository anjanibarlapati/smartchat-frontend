import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    headerLeft: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
    },
    backIcon: {
      height: 30,
      width:30,
    },
    screenWindow: {
      flex: 1,
      backgroundColor: theme.primaryBackground,
      paddingHorizontal: 24,
      paddingTop: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    TopView: {
      alignItems: 'center',
      marginBottom: 24,
    },
    img: {
      height: 80,
      width: 80,
    },
    EnterOTPText: {
      fontFamily: 'Nunito-Bold',
      fontSize: 24,
      textAlign: 'center',
      marginTop: 16,
      color: theme.primaryTextColor,
    },
    infoText: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      color: theme.primaryTextColor,
      textAlign: 'center',
      marginTop: 8,
    },

    OtpView: {
      marginVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    otpContainer: {
      width: width > 450 ? 'auto' : '100%',
      gap: width > 450 ? 20 : 20,
    },
    pinCodeContainer: {
      borderColor: 'gray',
    },
    pinCodeText: {
      color: theme.primaryTextColor,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      marginTop: 12,
      fontFamily: 'Nunito-Regular',
      textAlign: 'center',
    },
    submitView: {
      alignItems: 'center',
      marginVertical: 16,
    },
    submitViewEnabled: {
      opacity: 1,
    },
    submitViewDisabled: {
      opacity: 0.5,
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    timerText: {
      fontFamily: 'Nunito-Regular',
      fontSize: 16,
      color: theme.primaryTextColor,
    },
    resendBtn: {
      color: '#008080',
      fontFamily: 'Nunito-Bold',
      fontSize: 14,
      marginLeft: 8,
    },
    resendBtnDisabled: {
      opacity: 0.5,
    },
    resendBtnEnabled: {
      opacity: 1,
    },
  });
