import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 20,
    },
    box: {
      backgroundColor: theme.primaryInputBackground,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      elevation: 4,
      shadowColor: theme.primaryShadowColor,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      gap: 15,
    },
    icon: {
      fontSize: 30,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primaryColor,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.primaryColor,
      fontFamily: 'Nunito-SemiBold',
    },
    button: {
      backgroundColor: theme.primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    buttonText: {
      color: theme.primaryButtonTextColor,
      fontWeight: '600',
      fontFamily: 'Nunito-Regular',
    },
    iconImage: {
      width: 50,
      height: 50,
    },
  });
