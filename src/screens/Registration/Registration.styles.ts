import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primaryBackground,
    },
    body: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: width > 600 ? 100 : 2,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    img: {
      height: width > 600 ? 150 : 120,
      width: width > 600 ? 150 : 120,
      borderRadius: width > 600 ? 75 : 60,
    },
    inputfields: {
      gap: 1,
      marginTop: height < 600 ? '2%' : '5%',
      marginBottom: height < 600 ? '2%' : '5%',
      width: width > 600 ? '80%' : '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: 'Nunito-Regular',
      color: theme.primaryTextColor,
      fontSize: width > 600 ? 18 : 14,
    },
    loginView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '2%',
      gap: 5,
    },
    loginText: {
      color: theme.primaryColor,
      fontFamily: 'Nunito-Bold',
      fontSize: width > 600 ? 16 : 14,
    },
    phoneInputWrapper: {
      width: width > 600 ? '77%' : '74%',
      marginTop: 10,
      marginBottom: 10,
    },
    phoneInput: {
      height: 40,
      width: '100%',
      borderColor: theme.primaryInputBackground,
      backgroundColor: theme.primaryInputBackground,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      fontFamily: 'Nunito-Regular',
      fontSize: width > 600 ? 16 : 14,
      color: theme.primaryTextColor,
    },
    errorText: {
      color: theme.primaryErrorText,
      fontSize: width > 600 ? 14 : 12,
      marginTop: 5,
      fontFamily: 'Nunito-Regular',
    },
  });
