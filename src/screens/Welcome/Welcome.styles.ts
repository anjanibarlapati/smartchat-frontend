import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) =>  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.secondaryBackground,
    },
    logoStyles: {
      width: 250,
      height: 250,
      resizeMode: 'contain',
      marginBottom: 40,
    },
    appnameTagline: {
      alignItems: 'center',
      marginBottom: 40,
    },
    appname: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginBottom: 10,
      fontFamily: 'Nunito',
    },
    apptagline: {
      fontSize: 18,
      color: theme.primaryColor,
      textAlign: 'center',
      fontFamily: 'Nunito',
      fontWeight: '400',
    },
    getstartButton: {
      width: 250,
      height: 48,
      backgroundColor: theme.primaryColor,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    getstartText: {
      fontFamily: 'Nunito',
      fontWeight: '700',
      fontSize: 18,
      color: theme.primaryButtonTextColor,
      marginRight: 45,
    },

    chevronIconStyles: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
    },
  });


