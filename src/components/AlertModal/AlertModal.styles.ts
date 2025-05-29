import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.primaryInputBackground,
      borderRadius: 10,
      padding: width > 600 ? 40 : 25,
      width: width > 600 ? '50%' : '78%',
      elevation: 0.5,
      shadowColor: theme.primaryShadowColor,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    message: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      textAlign: 'center',
      marginBottom: 25,
      color: theme.primaryTextColor,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    cancelTextContainer: {
      paddingVertical: 10,
      backgroundColor: theme.primaryColor,
      borderRadius: 10,
      width: 100,
      transform: '1.1',
    },
    cancelText: {
      color: 'white',
      fontFamily: 'Nunito-Bold',
      textAlign: 'center',
    },
    confirmText: {
      color: 'white',
      fontFamily: 'Nunito-Bold',
      textAlign: 'center',
    },
    confirmTextContainer: {
      paddingVertical: 10,
      width: 100,
      backgroundColor: theme.alertButtonBackground,
      borderRadius: 8,
    },
  });
