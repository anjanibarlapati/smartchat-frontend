import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height: number) =>  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.secondaryBackground,
      paddingHorizontal: width < 350 ? 10 : 20,

    },
    logoStyles: {
      width: width * 0.5,
      height: width * 0.5,
      resizeMode: 'contain',
      marginBottom: height < 600 ? 20 : 40,
    },
    appnameTagline: {
      alignItems: 'center',
      marginBottom: height < 600 ? 20 : 40,
    },
    appname: {
      fontSize: width < 360 ? 24 : 32,
      color: theme.primaryColor,
      marginBottom: 10,
      fontFamily: 'Nunito-Bold',
    },
    apptagline: {
      fontSize: width < 360 ? 14 : 18,
      color: theme.primaryColor,
      textAlign: 'center',
      fontFamily: 'Nunito-Regular',
      fontWeight: '400',
    },
    getstartButton: {
      width: Math.min(width * 0.8, 250),
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
      fontFamily: 'Nunito-Bold',
      fontSize: width < 360 ? 16 : 18,
      color: theme.primaryButtonTextColor,
      marginRight: 45,
    },

    chevronIconStyles: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
    },
  });


